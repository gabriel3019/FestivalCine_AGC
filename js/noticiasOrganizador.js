document.addEventListener("DOMContentLoaded", () => {
    cargarNoticias();

    const contenedor = document.querySelector(".noticias-container");
    const accionesGenerales = document.querySelector(".acciones-generales");

    const btnAnadir = document.querySelector("#btnAnadir");
    const formularioNoticia = document.querySelector("#formulario-noticia");
    const overlay = document.getElementById("overlay");
    const formNoticia = document.querySelector("#form-noticia");
    const btnCancelar = document.querySelector("#cancelar");

    const titulo = document.getElementById("titulo");
    const contenido = document.getElementById("contenido");
    const form = document.getElementById("form-noticia");

    console.log("btnAnadir:", btnAnadir);
    console.log("formularioNoticia:", formularioNoticia);

    // Elementos de sesión
    const profileIcon = document.getElementById("icono_persona");
    const profileMenu = document.getElementById("menu");
    const logoutBtn = document.getElementById("cerrar_sesion");
    const volver_home = document.getElementById("volver_home");
    const nombreUsuario = document.getElementById("nombreUsuario");

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

    // Mostrar/Ocultar menú de perfil
    profileIcon.addEventListener("click", function (event) {
        event.stopPropagation();
        profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function () {
        profileMenu.style.display = "none";
    });

    // Volver a home
    volver_home.addEventListener("click", function () {
        window.location.href = "home_organizador.html";
    });

    // Cerrar sesión
    logoutBtn.addEventListener("click", function () {
        fetch("../php/acciones/cerrar_sesion.php")
            .then(() => {
                window.location.href = "../html/login.html";
            });
    });

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
            console.log("Respuesta del servidor:", text);
            return JSON.parse(text);
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Error en el servidor");
        }
    }

    async function cargarNoticias() {
        const formData = new FormData();
        formData.append("action", "listar");

        const res = await fetch("../php/acciones/noticiasOrganizador.php", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        if (!data.success) return;

        contenedor.innerHTML = "";
        contenedor.appendChild(accionesGenerales);

        data.noticias.forEach(noticia => {
            const div = document.createElement("div");
            div.classList.add("noticia");
            div.dataset.id = noticia.id_noticia;

            div.innerHTML = `
            <div class="acciones">
                <button class="btn-editar">✏️</button>
                <button class="btn-eliminar">🗑️</button>
            </div>
            <img src="../css/imagenes/fondo.png">
            <div class="contenido">
                <h3 class="titulo">${noticia.titulo}</h3>
                <p class="texto">${noticia.contenido}</p>
                <div class="info">
                    <span class="fecha">${new Date(noticia.fecha_publicacion).toLocaleDateString("es-ES")}</span>
                </div>
            </div>
        `;
            contenedor.appendChild(div);
        });
    }

    // Mostrar formulario
    btnAnadir.addEventListener("click", () => {
        formularioNoticia.classList.remove("oculto");
        overlay.classList.remove("oculto");
    });

    // Cancelar formulario
    btnCancelar.addEventListener("click", () => {
        formularioNoticia.classList.add("oculto");
        overlay.classList.add("oculto");
    });


    //Cerrar si se pulsa fuera 
    overlay.addEventListener("click", () => {
        formularioNoticia.classList.add("oculto");
        overlay.classList.add("oculto");
    });

    // Enviar formulario
    formNoticia.addEventListener("submit", async (e) => {
        e.preventDefault();

        const tituloInput = formNoticia.titulo;
        const contenidoInput = formNoticia.contenido;
        const titulo = tituloInput.value.trim();
        const contenido = contenidoInput.value.trim();

        let valido = true;

        // Validación con mensajes debajo de los campos
        if (!titulo) {
            mostrarError(tituloInput, "Debes escribir un título");
            valido = false;
        } else {
            quitarError(tituloInput);
        }

        if (!contenido) {
            mostrarError(contenidoInput, "Debes escribir contenido");
            valido = false;
        } else {
            quitarError(contenidoInput);
        }

        if (!valido) return; // si hay errores, no continuamos

        // Llamada al servidor
        const data = await enviarNoticia({
            action: "anadir",
            titulo,
            contenido
        });

        if (data.success) {
            cargarNoticias();

            // Cierra el formulario y el overlay automáticamente
            formularioNoticia.classList.add("oculto");
            overlay.classList.add("oculto");

            // Limpiar el formulario y errores
            formNoticia.reset();
            quitarError(tituloInput);
            quitarError(contenidoInput);
        } else {
            alert(data.message || "Error al añadir noticia");
        }
    });

    // Editar y borrar
    contenedor.addEventListener("click", async (e) => {
        const noticia = e.target.closest(".noticia");
        if (!noticia) return;

        const id = noticia.dataset.id;

        if (e.target.classList.contains("btn-eliminar")) {
            if (!confirm("¿Eliminar noticia?")) return;

            const data = await enviarNoticia({ action: "borrar", id });
            if (data.success) noticia.remove();
            else alert(data.message || "No se pudo borrar la noticia");
        }

        if (e.target.classList.contains("btn-editar")) {
            const titulo = noticia.querySelector(".titulo").textContent;
            const contenido = noticia.querySelector(".texto").textContent;

            const nuevoTitulo = prompt("Nuevo título", titulo);
            if (nuevoTitulo === null) return;

            const nuevoContenido = prompt("Nuevo contenido", contenido);
            if (nuevoContenido === null) return;


            const data = await enviarNoticia({
                action: "editar",
                id,
                titulo: nuevoTitulo,
                contenido: nuevoContenido
            });

            if (data.success) {
                noticia.querySelector(".titulo").textContent = nuevoTitulo;
                noticia.querySelector(".texto").textContent = nuevoContenido;
            } else {
                alert(data.message || "Error al editar noticia");
            }
        }
    });

    // Función para mostrar mensaje de error
    function mostrarError(input, mensaje) {
        // Elimina error anterior si existe
        let error = input.nextElementSibling;
        if (error && error.classList.contains("error")) {
            error.textContent = mensaje;
        } else {
            error = document.createElement("div");
            error.classList.add("error");
            error.textContent = mensaje;
            input.parentNode.insertBefore(error, input.nextSibling);
        }
        input.classList.add("input-error");
    }

    function quitarError(input) {
        let error = input.nextElementSibling;
        if (error && error.classList.contains("error")) {
            error.remove();
        }
        input.classList.remove("input-error");
    }

    // Validación cuando se sale del campo
    titulo.addEventListener("blur", () => {
        if (titulo.value.trim() === "") {
            mostrarError(titulo, "Debes escribir un título");
        } else {
            quitarError(titulo);
        }
    });

    contenido.addEventListener("blur", () => {
        if (contenido.value.trim() === "") {
            mostrarError(contenido, "Debes escribir contenido");
        } else {
            quitarError(contenido);
        }
    });

    // Validación al enviar el formulario
    form.addEventListener("submit", (e) => {
        let valido = true;

        if (titulo.value.trim() === "") {
            mostrarError(titulo, "Debes escribir un título");
            valido = false;
        } else {
            quitarError(titulo);
        }

        if (contenido.value.trim() === "") {
            mostrarError(contenido, "Debes escribir contenido");
            valido = false;
        } else {
            quitarError(contenido);
        }

        if (!valido) {
            e.preventDefault(); // Evita enviar si hay errores
        }
    });
});
