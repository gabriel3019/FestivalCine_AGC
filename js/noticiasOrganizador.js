document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("noticias-container");

    const btnAnadir = document.getElementById("btnAnadir");
    const formulario = document.getElementById("formulario-noticia");
    const formNoticia = document.getElementById("form-noticia");
    const cancelar = document.getElementById("cancelar");

    const overlay = document.getElementById("overlay");

    const campos = [
        { input: document.getElementById('titulo'), error: document.getElementById('tituloError') },
        { input: document.getElementById('contenido'), error: document.getElementById('contenidoError') },
        { input: document.getElementById('imagen'), error: document.getElementById('imagenError') }
    ];

    // Modal editar / eliminar
    const modalEditar = document.getElementById("modal-noticia");
    const modalForm = document.getElementById("modal-form");
    const modalCancelar = document.getElementById("modal-cancelar");
    const modalTituloInput = document.getElementById("modal-titulo-input");
    const modalContenidoInput = document.getElementById("modal-contenido-input");
    const modalImagenInput = document.getElementById("modal-imagen-input"); 

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

            // Si no hay imagen, usamos la de fondo por defecto
            const imgSrc = n.imagen ? n.imagen : "../css/imagenes/fondo.png";

            div.innerHTML = `
            <img src="${imgSrc}" alt="Imagen noticia">
            <div class="contenido">
                <div class="meta-info">
                    <span class="lugar">Madrid</span>
                    <span class="fecha">${n.fecha} - ${n.hora}</span>
                </div>
                
                <h3 class="titulo">${n.titulo}</h3>
                <p class="descripcion">${n.contenido}</p>

                <div class="acciones">
                    <button class="btn-editar">✏️</button>
                    <button class="btn-eliminar">🗑️</button>
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
            modalContenidoInput.value = noticia.querySelector(".descripcion").textContent;
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
        const imagen = document.getElementById("modal-imagen-input").files[0];

        if (!titulo || !contenido) return;

        const data = {
            action: "editar",
            id: noticiaActualId,
            titulo: titulo,
            contenido: contenido
        };

        if (imagen) {
            data.imagen = imagen; // La función api() ya se encarga de meterlo en el FormData
        }

        const res = await api(data);

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

    campos.forEach(item => {
        // Evento 'blur': al salir del input
        item.input.addEventListener('blur', () => {
            if (item.input.value.trim() === "") {
                item.input.classList.add("input-error"); // Añadimos la clase de error
                item.error.textContent = "Este campo es obligatorio";
                item.error.style.display = "block";
            } else {
                item.input.classList.remove("input-error");
                item.error.style.display = "none";
            }
        });

        // Quitar error mientras se escribe
        item.input.addEventListener('input', () => {
            if (item.input.value.trim() !== "") {
                item.input.classList.remove("input-error");
                item.error.style.display = "none";
            }
        });
    });

});
