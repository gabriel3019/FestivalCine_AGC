document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");
    const steps = document.querySelectorAll(".step");
    const nextBtns = document.querySelectorAll(".next-step");
    const prevBtns = document.querySelectorAll(".prev-step");
    const progressBar = document.querySelector(".progress-bar");

    let currentStep = 0;
    let iti = null; // instancia teléfono

    /* =====================================================
       MOSTRAR PASO
    ===================================================== */
    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle("active", i === index);
        });
        updateProgress();
        updateButtonState();
    }

    /* =====================================================
       PROGRESO
    ===================================================== */
    function updateProgress() {
        const percent = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = `${percent}%`;
    }

    showStep(currentStep);

    /* =====================================================
       ESTADOS DE VALIDACIÓN
    ===================================================== */
    function setValid(field) {
        field.classList.remove("invalid");
        field.classList.add("valid");
    }

    function setInvalid(field, msg) {
        field.classList.remove("valid");
        field.classList.add("invalid");
        const error = field.querySelector(".error-msg");
        if (error) error.textContent = msg;
    }

    /* =====================================================
       VALIDAR INPUT
    ===================================================== */
    function validateInput(input) {
        const field = input.closest(".field");
        if (!field) return;

        const value = input.value.trim();

        switch (input.name) {

            case "nombre":
                value.length >= 2
                    ? setValid(field)
                    : setInvalid(field, "Por favor, introduce tu nombre");
                break;

            case "apellidos":
                value.length >= 2
                    ? setValid(field)
                    : setInvalid(field, "Por favor, introduce tus apellidos");
                break;

            case "telefono":
                if (value === "") {
                    // opcional
                    setValid(field);
                } else if (iti && iti.isValidNumber()) {
                    setValid(field);
                } else {
                    setInvalid(field, "Número de teléfono no válido");
                }
                break;

            case "correo":
                if (value === "") {
                    setValid(field);
                } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    setValid(field);
                } else {
                    setInvalid(field, "Correo electrónico no válido");
                }
                break;

            case "password":
                const strongPassword =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/;
                strongPassword.test(value)
                    ? setValid(field)
                    : setInvalid(
                        field,
                        "Mín. 8 caracteres, mayúscula, número y símbolo"
                    );
                break;

            case "numero_expediente":
                value.length >= 4
                    ? setValid(field)
                    : setInvalid(field, "Número de expediente incorrecto");
                break;

            case "titulo":
                value.length >= 3
                    ? setValid(field)
                    : setInvalid(field, "Introduce el título del corto");
                break;

            case "descripcion":
                value.length >= 10
                    ? setValid(field)
                    : setInvalid(field, "La descripción es demasiado corta");
                break;


            case "categoria":
            case "portada":
            case "video":
            case "memoria_pdf":
                value
                    ? setValid(field)
                    : setInvalid(field, "Campo obligatorio");
                break;

            default:
                setValid(field);
        }
    }

    /* =====================================================
       VALIDACIÓN EN TIEMPO REAL
    ===================================================== */
    document.querySelectorAll("input, select").forEach(input => {
        input.addEventListener("input", () => {
            validateInput(input);
            updateButtonState();
        });
        input.addEventListener("change", () => {
            validateInput(input);
            updateButtonState();
        });
    });

    /* =====================================================
       VALIDAR PASO
    ===================================================== */
    function validateStep(stepIndex) {
        const fields = steps[stepIndex].querySelectorAll(".field");
        let valid = true;

        fields.forEach(field => {
            const input = field.querySelector("input, select");
            if (!input) return;

            if (input.hasAttribute("required")) {
                if (!input.value || field.classList.contains("invalid")) {
                    valid = false;
                }
            }
        });

        return valid;
    }

    function updateButtonState() {
        const btn = steps[currentStep].querySelector(
            ".next-step, button[type='submit']"
        );
        if (btn) btn.disabled = !validateStep(currentStep);
    }

    /* =====================================================
       NAVEGACIÓN
    ===================================================== */
    function nextStep() {
        if (!validateStep(currentStep)) return;
        currentStep++;
        if (currentStep < steps.length) showStep(currentStep);
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    }

    nextBtns.forEach(b => b.addEventListener("click", nextStep));
    prevBtns.forEach(b => b.addEventListener("click", prevStep));

    /* =====================================================
       TELÉFONO INTERNACIONAL (BIEN HECHO)
    ===================================================== */
    const telefono = document.querySelector("#telefono");
    if (telefono && window.intlTelInput) {
        iti = window.intlTelInput(telefono, {
            initialCountry: "es",
            separateDialCode: true,
            preferredCountries: ["es", "fr", "pt", "it", "de"],
            utilsScript:
                "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js"
        });
    }

    /* =====================================================
       VIDEO
    ===================================================== */
    const videoInput = document.getElementById("videoInput");
    const videoText = document.getElementById("videoText");

    if (videoInput) {
        videoInput.addEventListener("change", () => {
            videoText.textContent = videoInput.files.length
                ? videoInput.files[0].name
                : "Haz clic para subir un vídeo";
            updateButtonState();
        });
    }

    /* =====================================================
       SUBMIT FINAL
    ===================================================== */
    form.addEventListener("submit", e => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        const data = new FormData(form);

        // Guardar teléfono en formato internacional real
        if (iti && telefono.value.trim() !== "") {
            data.set("telefono", iti.getNumber());
        }

        fetch("../php/acciones/registro.php", {
            method: "POST",
            body: data
        })
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    window.location.href = "../html/home.html";
                } else {
                    alert(res.message || "Error en el registro");
                }
            })
            .catch(() => alert("Error de conexión"));
    });

});
