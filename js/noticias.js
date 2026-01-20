const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        window.location.href = "/FestivalCine_AGC/html/login.html";
    });
}

const registerBtn = document.getElementById("register-btn");
if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        window.location.href = "/FestivalCine_AGC/html/registro.html";
    });
}

fetch("../php/acciones/noticias.php")
    .then(res => res.json())
    .then(noticias => {
        const contenedor = document.getElementById("noticias-container");

        noticias.forEach(noticia => {
            const card = document.createElement("article");
            card.classList.add("card");

            card.innerHTML = `
                <h3>${noticia.titulo}</h3>
                <p>${noticia.contenido}</p>
                <small>${formatearFecha(noticia.fecha_publicacion)}</small>
            `;

            contenedor.appendChild(card);
        });
    })
    .catch(err => console.error("Error cargando noticias:", err));

function formatearFecha(fecha) {
    const f = new Date(fecha);
    return f.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}