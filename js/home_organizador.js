document.addEventListener("DOMContentLoaded", function () {

    // Elementos de tablas
    const noticias = document.getElementById("noticias");
    const eventos = document.getElementById("eventos");
    const premios = document.getElementById("premios");
    const patrocinadores = document.getElementById("patrocinadores");
    const gala = document.getElementById("gala");

    // Elementos de sesión
    const profileIcon = document.getElementById("icono_persona");
    const profileMenu = document.getElementById("menu");
    const logoutBtn = document.getElementById("cerrar_sesion");
    const volver_home = document.getElementById("volver_home");
    const nombreUsuario = document.getElementById("nombreUsuario");
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.querySelector("header nav");

    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("active");
    });


    // Comprobar sesión
    fetch("../php/acciones/check-session.php", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (data.logged && data.usuario?.rol.toLowerCase() === "organizador") {
                profileIcon.style.display = "flex";
                nombreUsuario.textContent = data.usuario.nombre;
            } else {
                window.location.href = "../html/login.html";
            }
        });

    profileIcon.addEventListener("click", function (event) {
        event.stopPropagation();
        profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function () {
        profileMenu.style.display = "none";
    });
    volver_home.addEventListener("click", function () {
        window.location.href = "home_organizador.html";
    });

    logoutBtn.addEventListener("click", function () {
        fetch("../php/acciones/cerrar_sesion.php")
            .then(() => {
                window.location.href = "../html/login.html";
            });
    });

    // Cargar datos desde PHP
    fetch("../php/acciones/home_organizador.php")
        .then(res => res.json())
        .then(data => {

            // NOTICIAS
            let html = "<tr><th>Título</th><th>Contenido</th></tr>";
            data.noticias.forEach(n => {
                html += `<tr><td>${n.titulo}</td><td>${n.contenido}</td></tr>`;
            });
            noticias.innerHTML = html;

            // EVENTOS
            html = "<tr><th>Nombre</th><th>Fecha</th><th>Lugar</th></tr>";
            data.eventos.forEach(e => {
                html += `<tr><td>${e.nombre}</td><td>${e.fecha}</td><td>${e.lugar}</td></tr>`;
            });
            eventos.innerHTML = html;

            // PREMIOS
            html = "<tr><th>Premio</th><th>Categoria</th></tr>";
            data.premios.forEach(p => {
                html += `<tr><td>${p.nombre_premio}</td><td>${p.categoria || ''}</td></tr>`;
            });
            premios.innerHTML = html;

            // PATROCINADORES
            html = "<tr><th>Logo</th><th>Nombre</th></tr>";
            data.patrocinadores.forEach(p => {
                html += `<tr><td>${p.logo}</td><td>${p.nombre}</td></tr>`;
            });
            patrocinadores.innerHTML = html;

            // GALAS
            html = "<tr><th>Fecha</th><th>Lugar</th><th>Nombre</th></tr>";
            data.galas.forEach(g => {
                html += `<tr><td>${g.fecha}</td><td>${g.lugar}</td><td>${g.nombre}</td></tr>`;
            });
            gala.innerHTML = html;

        })
        .catch(err => console.error("Error al cargar datos:", err));

});
