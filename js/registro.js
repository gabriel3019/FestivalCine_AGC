document.addEventListener("DOMContentLoaded", function () {
    // --- ELEMENTOS DEL FORMULARIO ---
    const form = document.getElementById("registerForm");
    const videoInput = document.getElementById("videoInput");
    const videoText = document.getElementById("videoText");

    if (!videoInput || !videoText) return;

    // Mostrar el nombre del archivo seleccionado
    videoInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            videoText.textContent = `Archivo seleccionado: ${file.name}`;
        } else {
            videoText.textContent = "Haz clic para subir un vídeo";
        }
    });

    // Envío del formulario
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Validación: vídeo obligatorio
        if (!videoInput.files[0]) {
            alert("Debes subir un vídeo");
            return;
        }

        const formData = new FormData(form);

        fetch("../php/acciones/registro.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Usuario registrado correctamente");
                    window.location.href = "../html/home.html";
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