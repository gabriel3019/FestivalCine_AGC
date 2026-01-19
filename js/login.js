document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const emailInput = document.querySelector("input[name='email']");
    const passwordInput = document.querySelector("input[name='password']");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    // Validación al salir del campo

    emailInput.addEventListener("blur", () => {
        if (emailInput.value.trim() === "") {
            emailError.textContent = "Debes introducir un correo electrónico";
            emailError.style.display = "block";
        } else {
            emailError.textContent = "";
            emailError.style.display = "none";
        }
    });

    passwordInput.addEventListener("blur", () => {
        if (passwordInput.value.trim() === "") {
            passwordError.textContent = "Debes introducir una contraseña";
            passwordError.style.display = "block";
        } else {
            passwordError.textContent = "";
            passwordError.style.display = "none";
        }
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Tomamos los valores del formulario
        const emailInput = document.querySelector("input[name='email']");
        const passwordInput = document.querySelector("input[name='password']");

        if (!emailInput || !passwordInput) {
            console.error("No se encontraron los inputs de email o contraseña");
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (email === "" || password === "") {
            alert("Por favor completa todos los campos");
            return;
        }

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        fetch("../php/acciones/login.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const rol = data.rol ? data.rol.toLowerCase() : '';
                    if (rol === "organizador") {
                        window.location.href = "../html/home_organizador.html";
                    } else {
                        window.location.href = "../html/home.html";
                    }
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error en el servidor");
            });
    });
});
