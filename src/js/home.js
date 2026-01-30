// ---------------------- LOGIN Y REGISTRO ----------------------

const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        window.location.href = "/FestivalCine_AGC/src/html/login.html";
    });
}

const registerBtn = document.getElementById("register-btn");
if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        window.location.href = "/FestivalCine_AGC/src/html/registro.html";
    });
}


// ---------------------- AUTH / SESIÓN ----------------------

const authUser = document.getElementById("auth-user");
const authButtons = document.getElementById("auth-buttons");
const nombreUsuario = document.getElementById("nombreUsuario");
const profileIcon = document.getElementById("icono_persona");
const profileMenu = document.getElementById("menu");
const logoutBtn = document.getElementById("cerrar_sesion");
const volverHome = document.getElementById("volver_home");

if (authUser && authButtons) {
    fetch("../php/acciones/check-session.php", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (data.logged) {
                authUser.style.display = "flex";
                authButtons.style.display = "none";

                if (nombreUsuario) {
                    nombreUsuario.textContent = data.usuario.nombre;
                }
            } else {
                authUser.style.display = "none";
                authButtons.style.display = "flex";
            }
        })
        .catch(() => {
            authUser.style.display = "none";
            authButtons.style.display = "flex";
        });
}

// Menú perfil
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
            .then(() => {
                window.location.href = "../html/home.html";
            });
    });
}

// Volver a home organizador
if (volverHome) {
    volverHome.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "home_organizador.html";
    });
}


// ---------------------- CARRUSEL ----------------------

const slides = document.querySelectorAll(".carousel img");
const dots = document.querySelectorAll(".dot");
let current = 0;

if (slides.length > 0 && dots.length > 0) {

    function showSlide(index) {
        slides.forEach((img, i) => {
            img.classList.toggle("active", i === index);
            dots[i].classList.toggle("active", i === index);
        });
        current = index;
    }

    setInterval(function () {
        let next = (current + 1) % slides.length;
        showSlide(next);
    }, 4500);

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });
}


// ---------------------- ÚLTIMA NOTICIA ----------------------

const ultimaNoticia = document.getElementById("ultima-noticia");

if (ultimaNoticia) {
    fetch("../php/acciones/obtenerUltimaNoticias.php")
        .then(res => res.json())
        .then(noticia => {
            if (!noticia || !noticia.id_noticia) return;

            ultimaNoticia.innerHTML = `
                <div class="thumb" style="background-image: url('/FestivalCine_AGC/uploads/${noticia.imagen}')"></div>
                <p><strong>${noticia.titulo}</strong></p>
                <p>${noticia.contenido.substring(0, 100)}...</p>
            `;

            ultimaNoticia.style.cursor = "pointer";
            ultimaNoticia.addEventListener("click", function () {
                window.location.href = "/FestivalCine_AGC/html/noticias.html";
            });
        });
}


// ---------------------- ÚLTIMO EVENTO ----------------------

const ultimoEvento = document.getElementById("ultimo-evento");

if (ultimoEvento) {
    fetch("../php/acciones/obtenerUltimoEvento.php")
        .then(res => res.json())
        .then(evento => {
            if (!evento || !evento.id_evento) return;

            ultimoEvento.innerHTML = `
                <div class="thumb" style="background-color: #ccc;"></div>
                <p><strong>${evento.nombre}</strong></p>
                <p>${evento.fecha} - ${evento.lugar}</p>
                <p>${evento.descripcion.substring(0, 100)}...</p>
            `;

            ultimoEvento.style.cursor = "pointer";
            ultimoEvento.addEventListener("click", function () {
                window.location.href = "/FestivalCine_AGC/html/eventos.html";
            });
        });
}


// ---------------------- CORTOMETRAJES PREMIADOS ----------------------

const cortosContainer = document.getElementById("cortos-container");

if (cortosContainer) {
    fetch("/FestivalCine_AGC/php/obtener_cortos.php")
        .then(res => res.json())
        .then(cortos => {
            cortosContainer.innerHTML = "";

            cortos.forEach(function (corto) {
                const card = document.createElement("div");
                card.className = "card";

                card.innerHTML = `
                    <div class="thumb video">
                        <video width="200" controls>
                            <source src="/FestivalCine_AGC/${corto.archivo_video}" type="video/mp4">
                        </video>
                    </div>
                    <p>${corto.titulo}</p>
                `;

                cortosContainer.appendChild(card);
            });
        });
}
