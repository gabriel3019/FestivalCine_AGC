document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", function(e){
        e.preventDefault();

        const nombre = document.querySelector("input[name='nombre']").value;
        const apellidos = document.querySelector("input[name='apellidos']").value;
        const email = document.querySelector("input[name='email']").value;
        const password = document.querySelector("input[name='password']").value;
        const rol = document.querySelector("select[name='rol']").value;

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("apellidos", apellidos);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("rol", rol);

        fetch("php/acciones/registro.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Usuario registrado correctamente");
                window.location.href = "login.html";
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
