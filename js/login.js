document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    if (!form) return; // Si no existe el formulario, no hace nada

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

        // Validación simple
        if (email === "" || password === "") {
            alert("Por favor completa todos los campos");
            return;
        }
        // Creamos FormData igual que en registro.js
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        // Petición AJAX
        fetch("php/acciones/login.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log("Respuesta login:", data);
                if (data.success) {
                    console.log("Rol del usuario:", data.rol);
                    // alert("Login correcto");

                    // Redirigir según rol si lo necesitas
                    if (data.rol.toLowerCase() === "organizador") {
                        console.log("Redirigiendo al home de organizador");
                        window.location.href = "html/home_organizador.html";
                    } else {
                        window.location.href = "html/home.html"; // usuario normal
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
