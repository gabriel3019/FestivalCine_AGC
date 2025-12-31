document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Evita recargar la página

    const email = document.querySelector("input[type='email']").value;
    const password = document.querySelector("input[type='password']").value;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    fetch("php/login.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Login correcto");
            window.location.href = "home.html"; // página destino
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error en el servidor");
    });
});
