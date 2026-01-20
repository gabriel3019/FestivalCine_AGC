document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("noticias-container");

    const btnAnadir = document.getElementById("btnAnadir");
    const formulario = document.getElementById("formulario-noticia");
    const formNoticia = document.getElementById("form-noticia");
    const cancelar = document.getElementById("cancelar");

    const overlay = document.getElementById("overlay");

    // Modal editar / eliminar
    const modalEditar = document.getElementById("modal-noticia");
    const modalForm = document.getElementById("modal-form");
    const modalCancelar = document.getElementById("modal-cancelar");
    const modalTituloInput = document.getElementById("modal-titulo-input");
    const modalContenidoInput = document.getElementById("modal-contenido-input");
    const modalImagenInput = document.getElementById("modal-imagen-input"); // opcional si agregas campo en HTML

    const modalEliminar = document.getElementById("modal-eliminar");
    const confirmarEliminar = document.getElementById("confirmar-eliminar");
    const cancelarEliminar = document.getElementById("cancelar-eliminar");

    let noticiaActualId = null;

    // ===================== SESIÓN =====================
    fetch("../php/acciones/check-session.php", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (!data.logged || data.usuario.rol.toLowerCase() !== "organizador") {
                window.location.href = "../html/login.html";
            } else {
                document.getElementById("nombreUsuario").textContent = data.usuario.nombre;
            }
        });

    document.getElementById("icono_persona").addEventListener("click", e => {
        e.stopPropagation();
        const menu = document.getElementById("menu");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
        document.getElementById("menu").style.display = "none";
    });

    document.getElementById("cerrar_sesion").addEventListener("click", () => {
        fetch("../php/acciones/cerrar_sesion.php").then(() => {
            window.location.href = "../html/login.html";
        });
    });

    document.getElementById("volver_home").addEventListener("click", () => {
        window.location.href = "home_organizador.html";
    });

    // ===================== FUNCIONES API =====================
    async function api(data) {
    const formData = new FormData();
    for (let key in data) {
        if (key === "imagen" && data[key] instanceof File) {
            formData.append("imagen", data[key]);
        } else {
            formData.append(key, data[key]);
        }
    }

    const res = await fetch("../php/acciones/noticiasOrganizador.php", {
        method: "POST",
        body: formData
    });

    return res.json();
}
    // ===================== CARGAR NOTICIAS =====================
    async function cargarNoticias() {
        const data = await api({ action: "listar" });
        if (!data.success) return;

        contenedor.innerHTML = "";

        data.noticias.forEach(n => {
            const div = document.createElement("div");
            div.className = "noticia";
            div.dataset.id = n.id_noticia;

            const imgSrc = n.imagen ? n.imagen : "../css/imagenes/fondo.png";

            div.innerHTML = `
    <div class="acciones">
        <button class="btn-editar">✏️</button>
        <button class="btn-eliminar">🗑️</button>
    </div>
    <img src="${imgSrc}" alt="Imagen noticia">
    <div class="contenido">
        <h3 class="titulo">${n.titulo}</h3>
        <p class="texto">${n.contenido}</p>
        <div class="info">
            <span class="fecha">${new Date(n.fecha_publicacion).toLocaleDateString("es-ES")}</span>
        </div>
    </div>
`;

            contenedor.appendChild(div);
        });
    }

    cargarNoticias();

    // ===================== ABRIR/CERRAR MODALES =====================
    function cerrarTodo() {
        formulario.classList.add("oculto");
        modalEditar.classList.add("oculto");
        modalEliminar.classList.add("oculto");
        overlay.classList.add("oculto");
        noticiaActualId = null;
    }

    btnAnadir.addEventListener("click", () => {
        formulario.classList.remove("oculto");
        overlay.classList.remove("oculto");
    });

    cancelar.addEventListener("click", cerrarTodo);
    overlay.addEventListener("click", cerrarTodo);
    modalCancelar.addEventListener("click", cerrarTodo);
    cancelarEliminar.addEventListener("click", cerrarTodo);

    // ===================== AÑADIR NOTICIA =====================
    formNoticia.addEventListener("submit", async e => {
        e.preventDefault();

        const titulo = formNoticia.titulo.value.trim();
        const contenido = formNoticia.contenido.value.trim();
        const imagen = formNoticia.imagen.files[0];

        if (!titulo || !contenido) return;

        const data = { action: "anadir", titulo, contenido };
        if (imagen) data.imagen = imagen;

        const res = await api(data, true);
        if (res.success) {
            formNoticia.reset();
            cerrarTodo();
            cargarNoticias();
        } else {
            alert(res.message || "Error al añadir noticia");
        }
    });

    // ===================== EDITAR / ELIMINAR =====================
    contenedor.addEventListener("click", e => {
        const noticia = e.target.closest(".noticia");
        if (!noticia) return;

        noticiaActualId = noticia.dataset.id;

        // ✏️ EDITAR
        if (e.target.classList.contains("btn-editar")) {
            modalTituloInput.value = noticia.querySelector(".titulo").textContent;
            modalContenidoInput.value = noticia.querySelector(".texto").textContent;
            modalEditar.classList.remove("oculto");
            overlay.classList.remove("oculto");
        }

        // 🗑️ ELIMINAR
        if (e.target.classList.contains("btn-eliminar")) {
            modalEliminar.classList.remove("oculto");
            overlay.classList.remove("oculto");
        }
    });

    // ===================== GUARDAR EDICIÓN =====================
    modalForm.addEventListener("submit", async e => {
        e.preventDefault();

        const titulo = modalTituloInput.value.trim();
        const contenido = modalContenidoInput.value.trim();
        const imagen = modalImagenInput?.files[0];

        if (!titulo || !contenido) return;

        const data = { action: "editar", id: noticiaActualId, titulo, contenido };
        if (imagen) data.imagen = imagen;

        const res = await api(data, true);
        if (res.success) {
            cerrarTodo();
            cargarNoticias();
        }
    });

    // ===================== CONFIRMAR ELIMINACIÓN =====================
    confirmarEliminar.addEventListener("click", async () => {
        const res = await api({ action: "borrar", id: noticiaActualId });
        if (res.success) {
            cerrarTodo();
            cargarNoticias();
        }
    });

});
