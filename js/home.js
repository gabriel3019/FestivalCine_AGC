// ---------------------- LOGIN Y REGISTRO ----------------------
document.getElementById("login-btn").addEventListener("click", () => {
    window.location.href = "/FestivalCine_AGC/html/login.html";
});

document.getElementById("register-btn").addEventListener("click", () => {
    window.location.href = "/FestivalCine_AGC/html/registro.html";
});


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
            // Mostrar usuario
            authUser.style.display = "flex";
            authButtons.style.display = "none";
            nombreUsuario.textContent = data.usuario.nombre;
        } else {
            // Mostrar botones
            authUser.style.display = "none";
            authButtons.style.display = "flex";
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

// ---------------------- CARRUSEL ----------------------
const slides = document.querySelectorAll(".carousel img");
const dots = document.querySelectorAll(".dot");
let current = 0;

function showSlide(index) {
    slides.forEach((img, i) => {
        img.classList.toggle("active", i === index);
        dots[i].classList.toggle("active", i === index);
    });
    current = index;
}

setInterval(() => {
    let next = (current + 1) % slides.length;
    showSlide(next);
}, 4500);

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showSlide(index);
    });
});

// ---------------------- ÚLTIMA NOTICIA ----------------------
fetch("../php/acciones/obtenerUltimaNoticias.php")
    .then(res => res.json())
    .then(noticia => {
        if (!noticia || !noticia.id_noticia) return;

        const container = document.getElementById("ultima-noticia");
        container.innerHTML = `
            <div class="thumb" style="background-image: url('/FestivalCine_AGC/uploads/${noticia.imagen}')"></div>
            <p><strong>${noticia.titulo}</strong></p>
            <p>${noticia.contenido.substring(0, 100)}...</p>
        `;
        container.style.cursor = "pointer";
        container.addEventListener("click", () => {
            window.location.href = "/FestivalCine_AGC/html/noticias.html";
        });
    });

// ---------------------- ÚLTIMO EVENTO ----------------------
fetch("../php/acciones/obtenerUltimoEvento.php")
    .then(res => res.json())
    .then(evento => {
        if (!evento || !evento.id_evento) return;

        const container = document.getElementById("ultimo-evento");
        container.innerHTML = `
            <div class="thumb" style="background-color: #ccc;"></div>
            <p><strong>${evento.nombre}</strong></p>
            <p>${evento.fecha} - ${evento.lugar}</p>
            <p>${evento.descripcion.substring(0, 100)}...</p>
        `;
        container.style.cursor = "pointer";
        container.addEventListener("click", () => {
            window.location.href = "/FestivalCine_AGC/html/eventos.html";
        });
    });

// ---------------------- CORTOMETRAJES PREMIADOS ----------------------
fetch('/FestivalCine_AGC/php/obtener_cortos.php')
    .then(response => response.json())
    .then(cortos => {
        const container = document.getElementById("cortos-container");
        container.innerHTML = '';

        cortos.forEach(corto => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <div class="thumb video">
                    <video width="200" controls>
                        <source src="/FestivalCine_AGC/videos/${corto.archivo_video}" type="video/mp4">
                    </video>
                    <div class="play-mini"></div>
                </div>
                <p>${corto.titulo}</p>
            `;
            container.appendChild(card);
        });
    });
