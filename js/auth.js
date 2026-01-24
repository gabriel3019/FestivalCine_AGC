const authUser = document.getElementById("auth-user");
const authButtons = document.getElementById("auth-buttons");
const nombreUsuario = document.getElementById("nombreUsuario");
const profileIcon = document.getElementById("icono_persona");
const profileMenu = document.getElementById("menu");
const logoutBtn = document.getElementById("cerrar_sesion");


// Comprobar sesión
fetch("../php/acciones/check-session.php", { method: "POST" })
    .then(res => res.json())
    .then(data => {
        if (data.logged) {
            authUser.style.display = "flex";
            authButtons.style.display = "none";
            nombreUsuario.textContent = data.usuario.nombre;
        } else {
            authUser.style.display = "none";
            authButtons.style.display = "flex";
        }
    });

// Abrir / cerrar menú
if (profileIcon && profileMenu) {
    profileIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        profileMenu.style.display =
            profileMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function () {
        profileMenu.style.display = "none";
    });
}

// Cerrar sesión
if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();

        fetch("../php/acciones/cerrar_sesion.php")
            .then(res => res.json())
            .then(() => {
                window.location.href = "../html/home.html";
            });
    });
}

