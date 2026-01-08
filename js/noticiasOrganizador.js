document.addEventListener("DOMContentLoaded", () => {
    cargarNoticias();

    const contenedor = document.querySelector(".noticias-container");
    const btnAnadir = document.querySelector(".btn-anadir");

    // ------------------ FUNCIONES ------------------
    async function enviarNoticia(data) {
        try {
            const formData = new FormData();
            for (const key in data) formData.append(key, data[key]);

            const res = await fetch("../php/acciones/noticiasOrganizador.php", {
                method: "POST",
                body: formData
            });

            const text = await res.text();
            console.log("Respuesta del servidor:", text); // 👈 ver qué devuelve realmente
            return JSON.parse(text); // convertir a JSON
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Error en el servidor");
        }
    }

    // ------------------ CARGAR NOTICIAS ------------------
    async function cargarNoticias() {
        const res = await fetch("../php/acciones/noticiasOrganizador.php?action=listar");
        const data = await res.json();

        if (!data.success) return;

        contenedor.innerHTML = "";

        data.noticias.forEach(noticia => {
            const div = document.createElement("div");
            div.classList.add("noticia");
            div.dataset.id = noticia.id;

            div.innerHTML = `
                <div class="acciones">
                    <button class="btn-editar">✏️</button>
                    <button class="btn-eliminar">🗑️</button>
                </div>
                <img src="../css/imagenes/fondo.png">
                <div class="contenido">
                    <h3 class="titulo">${noticia.titulo}</h3>
                    <p class="contenido">${noticia.contenido}</p>
                    <div class="info">
                        <span class="fecha">${new Date(noticia.fecha).toLocaleDateString("es-ES")}</span>
                    </div>
                </div>
            `;

            contenedor.appendChild(div);
        });
    }

    // ------------------ EVENTO CLICK ------------------
    contenedor.addEventListener("click", async (e) => {
        const noticia = e.target.closest(".noticia");
        if (!noticia) return;

        const id = noticia.dataset.id;

        // ---- BORRAR ----
        if (e.target.classList.contains("btn-eliminar")) {
            if (!confirm("¿Eliminar noticia?")) return;
            const data = await enviarNoticia({ action: "borrar", id });
            if (data.success) noticia.remove();
            else alert(data.message || "Error al borrar noticia");
        }

        // ---- EDITAR ----
        if (e.target.classList.contains("btn-editar")) {
            const titulo = noticia.querySelector(".titulo").textContent;
            const contenido = noticia.querySelector(".contenido").textContent;

            const nuevoTitulo = prompt("Nuevo título", titulo);
            if (!nuevoTitulo) return;

            const nuevoContenido = prompt("Nuevo contenido", contenido);
            if (!nuevoContenido) return;

            const data = await enviarNoticia({
                action: "editar",
                id,
                titulo: nuevoTitulo,
                contenido: nuevoContenido,
                id_organizador: 1
            });

            if (data.success) {
                noticia.querySelector(".titulo").textContent = nuevoTitulo;
                noticia.querySelector(".contenido").textContent = nuevoContenido;
            } else {
                alert(data.message || "Error al editar noticia");
            }
        }
    });

    // ------------------ AÑADIR ------------------
    btnAnadir.addEventListener("click", async () => {
        const titulo = prompt("Título de la noticia");
        if (!titulo) return;

        const contenido = prompt("Contenido de la noticia");
        if (!contenido) return;

        const data = await enviarNoticia({
            action: "anadir",
            titulo: titulo,
            contenido: contenido
        });

        if (data.success) {
            cargarNoticias();
        } else {
            alert(data.message || "Error al añadir noticia");
        }
    });
});
