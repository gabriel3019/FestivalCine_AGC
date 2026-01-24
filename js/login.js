document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const email = form.querySelector("input[name='email']");
    const password = form.querySelector("input[name='password']");
    const button = form.querySelector("button");

    function setValid(field) {
        field.classList.remove("invalid");
        field.classList.add("valid");
    }

    function setInvalid(field, msg) {
        field.classList.remove("valid");
        field.classList.add("invalid");
        field.querySelector(".error-msg").textContent = msg;
    }

    function validateEmail() {
        const field = email.closest(".field");
        const value = email.value.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setInvalid(field, "Correo electrónico no válido");
            return false;
        }
        setValid(field);
        return true;
    }

    function validatePassword() {
        const field = password.closest(".field");
        if (password.value.trim() === "") {
            setInvalid(field, "Debes introducir una contraseña");
            return false;
        }
        setValid(field);
        return true;
    }

    function updateButton() {
        button.disabled = !(validateEmail() && validatePassword());
    }

    email.addEventListener("input", updateButton);
    password.addEventListener("input", updateButton);

    form.addEventListener("submit", e => {
        e.preventDefault();
        if (button.disabled) return;

        const data = new FormData(form);

        fetch("../php/acciones/login.php", {
            method: "POST",
            body: data
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                //  REDIRECCIÓN SEGÚN TIPO
                if (data.tipo === "organizador") {
                    window.location.href = "../html/home_organizador.html";
                } else {
                    window.location.href = "../html/home.html";
                }
            } else {
                alert(data.message || "Credenciales incorrectas");
            }
        })
        .catch(() => alert("Error de conexión"));
    });

});
