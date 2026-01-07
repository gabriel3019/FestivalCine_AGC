document.addEventListener("DOMContentLoaded", function () {
    const authButtons = document.getElementById("auth-buttons");
    const profileIcon = document.getElementById("icono_persona");
    const profileMenu = document.getElementById("menu");
    const logoutBtn = document.getElementById("cerrar_sesion");
    const volver_home = document.getElementById("volver_home");


    fetch("php/acciones/check-session.php", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (data.logged && data.usuario?.rol.toLowerCase() === "organizador") {

                if (authButtons) authButtons.style.display = "none";


                profileIcon.style.display = "flex";


                document.getElementById("nombreUsuario").textContent = data.usuario.nombre;


                fetch("php/acciones/home_organizador.php")
                    .then(res => res.json())
                    .then(organizador => {
                        document.getElementById("total_cortos").textContent = organizador.total_cortos;
                        document.getElementById("cortos_pendientes").textContent = organizador.cortos_pendientes;
                        document.getElementById("votos_totales").textContent = organizador.votos_totales;
                        document.getElementById("total_participantes").textContent = organizador.total_participantes;

                        const actividadDiv = document.getElementById("actividad_reciente");
                        actividadDiv.innerHTML = "";
                        organizador.actividad_reciente.forEach(item => {
                            const div = document.createElement("div");
                            div.className = "activity-item";
                            div.textContent = item;
                            actividadDiv.appendChild(div);
                        });
                    })
                    .catch(err => console.error("Error al cargar administrador:", err));
            } else {

                if (authButtons) authButtons.style.display = "block";
                profileIcon.style.display = "none";
                window.location.href = "../html/login.html";
            }

        })
        .catch(err => console.error("Error al comprobar sesión:", err));


    profileIcon.addEventListener("click", function (event) {
        event.stopPropagation(); // Evita que se cierre al hacer click en el document
        profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    });


    volver_home.addEventListener("click", function () {
        fetch("php/acciones/home.php")
            .then(() => {
                window.location.href = "html/home.html";
            });
    });


    logoutBtn.addEventListener("click", function () {
        fetch("php/acciones/cerrar_sesion.php")
            .then(() => {
                window.location.href = "html/login.html";
            });
    });


    document.addEventListener("click", function (event) {
        if (!profileIcon.contains(event.target)) {
            profileMenu.style.display = "none";
        }
    });
});
