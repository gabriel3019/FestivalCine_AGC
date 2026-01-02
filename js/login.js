document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", function(e){
        e.preventDefault();

        // Tomamos los valores del formulario
        const email = document.querySelector("input[placeholder='Introduce tu correo']").value;
        const password = document.querySelector("input[placeholder='Introduce tu contraseña']").value;

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
            if (data.success) {
                alert("Login correcto");

                // Redirigir según rol si lo necesitas
                if (data.rol === "organizador") {
                    window.location.href = "organizador/dashboard.html";
                } else {
                    window.location.href = "home.html"; // usuario normal
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
