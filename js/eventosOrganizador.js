document.addEventListener("DOMContentLoaded", () => {
    cargarEventos();

    const contenedor = document.querySelector(".eventos-container");
    const accionesGenerales = document.querySelector(".acciones-generales");

    const btnAnadir = document.querySelector("#btnAnadir");
    const formularioEvento = document.querySelector("#formulario-evento");
    const overlay = document.getElementById("overlay");
    const formEvento = document.querySelector("#form-evento");
    const btnCancelar = document.querySelector("#cancelar");

    const nombre = document.getElementById("nombre");
    const descripcion = document.getElementById("descripcion");
    const fecha = document.getElementById("fecha");
    const lugar = document.getElementById("lugar");
    const tipo_evento = document.getElementById("tipo_evento");
    const form = document.getElementById("form-evento");

    const inputFecha = document.getElementById("fecha");

    console.log("btnAnadir:", btnAnadir);
    console.log("formularioEvento:", formularioEvento);

    if (inputFecha) {
        const hoy = new Date().toISOString().split("T")[0];
        inputFecha.min = hoy;
    }

    async function enviarEvento(data) {
        try {
            const formData = new FormData();
            for (const key in data) formData.append(key, data[key]);

            const res = await fetch("../php/acciones/eventosOrganizador.php", {
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

    async function cargarEventos() {
        const formData = new FormData();
        formData.append("action", "listar");

        const res = await fetch("../php/acciones/eventosOrganizador.php", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!data.success) return;

        contenedor.innerHTML = "";
        contenedor.appendChild(accionesGenerales);

        data.eventos.forEach(evento => {
            const div = document.createElement("div");
            div.classList.add("evento");
            div.dataset.id = evento.id_evento;

            div.innerHTML = `
            <div class="acciones">
                <button class="btn-editar">✏️</button>
                <button class="btn-eliminar">🗑️</button>
            </div>
            <img src="../css/imagenes/fondo.png">
            <div class="contenido">
                <h3 class="nombre">${evento.nombre}</h3>
                <p class="descripcion">${evento.descripcion}</p>
                <p class="fecha">${evento.fecha}</p>
                <p class="lugar">${evento.lugar}</p>
                <p class="tipo_evento">${evento.tipo_evento}</p>
            </div>
        `;

            contenedor.appendChild(div);
        });
    }


    // Mostrar formulario
    btnAnadir.addEventListener("click", () => {
        formularioEvento.classList.remove("oculto");
        overlay.classList.remove("oculto");
    });

    // Cancelar formulario
    btnCancelar.addEventListener("click", () => {
        formularioEvento.classList.add("oculto");
        overlay.classList.add("oculto");
    });


    //Cerrar si se pulsa fuera
    overlay.addEventListener("click", () => {
        formularioEvento.classList.add("oculto");
        overlay.classList.add("oculto");
    });

    // Enviar formulario
    formEvento.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombreInput = formEvento.nombre;
        const descripcionTextarea = formEvento.descripcion;
        const fechaInput = formEvento.fecha;
        const lugarInput = formEvento.lugar;
        const tipo_eventoInput = formEvento.tipo_evento;

        const nombre = nombreInput.value.trim();
        const descripcion = descripcionTextarea.value.trim();
        const fecha = fechaInput.value.trim();
        const lugar = lugarInput.value.trim();
        const tipo_evento = tipo_eventoInput.value.trim();

        let valido = true;

        // Validación de error
        if (!nombre) {
            mostrarError(nombreInput, "Debes escribir un nombre");
            valido = false;
        } else {
            quitarError(nombreInput);
        }

        if (!descripcion) {
            mostrarError(descripcionTextarea, "Debes escribir una descripcion");
            valido = false;
        } else {
            quitarError(descripcionTextarea);
        }

        if (!fecha) {
            mostrarError(fechaInput, "Debes escribir una fecha");
            valido = false;
        } else {
            quitarError(fechaInput);
        }

        if (!lugar) {
            mostrarError(lugarInput, "Debes escribir un lugar");
            valido = false;
        } else {
            quitarError(lugarInput);
        }

        if (!tipo_evento) {
            mostrarError(tipo_eventoInput, "Debes escribir un tipo de evento");
            valido = false;
        } else {
            quitarError(tipo_eventoInput);
        }



        if (!valido) return; // si hay errores, no continuamos

        // Llamada al servidor
        const data = await enviarEvento({
            action: "anadir",
            nombre,
            descripcion,
            fecha,
            lugar,
            tipo_evento
        });

        if (data.success) {
            cargarEventos();

            formularioEvento.classList.add("oculto");
            overlay.classList.add("oculto");

            // Limpiar el formulario y errores
            formEvento.reset();
            quitarError(nombreInput);
            quitarError(descripcionTextarea);
            quitarError(fechaInput);
            quitarError(lugarInput);
            quitarError(tipo_eventoInput);

        } else {
            alert(data.message || "Error al añadir evento");
        }
    });

    // Editar y borrar
    contenedor.addEventListener("click", async (e) => {
        const evento = e.target.closest(".evento");
        if (!evento) return;

        const id = evento.dataset.id;

        if (e.target.classList.contains("btn-eliminar")) {
            if (!confirm("¿Eliminar evento?")) return;

            const data = await enviarEvento({ action: "borrar", id });
            if (data.success) evento.remove();
            else alert(data.message || "No se pudo borrar el evento");
        }

        if (e.target.classList.contains("btn-editar")) {
            const nombre = evento.querySelector(".nombre").textContent;
            const descripcion = evento.querySelector(".descripcion").textContent;
            const fecha = evento.querySelector(".fecha").textContent;
            const lugar = evento.querySelector(".lugar").textContent;
            const tipo_evento = evento.querySelector(".tipo_evento").textContent;

            const nuevoNombre = prompt("Nuevo nombre", nombre);
            if (!nuevoNombre) return;

            const nuevaDescripcion = prompt("Nueva descripción", descripcion);
            if (!nuevaDescripcion) return;

            const nuevaFecha = prompt("Nueva fecha", fecha);
            if (!nuevaFecha) return;

            const nuevoLugar = prompt("Nuevo lugar", lugar);
            if (!nuevoLugar) return;

            const nuevoTipo_evento = prompt("Nuevo tipo de evento", tipo_evento);
            if (!nuevoTipo_evento) return;

            const data = await enviarEvento({
                action: "editar",
                id,
                nombre: nuevoNombre,
                descripcion: nuevaDescripcion,
                fecha: nuevaFecha,
                lugar: nuevoLugar,
                tipo_evento: nuevoTipo_evento
            });

            if (data.success) {
                evento.querySelector(".nombre").textContent = nuevoNombre;
                evento.querySelector(".descripcion").textContent = nuevaDescripcion;
                evento.querySelector(".fecha").textContent = nuevaFecha;
                evento.querySelector(".lugar").textContent = nuevoLugar;
                evento.querySelector(".tipo_evento").textContent = nuevoTipo_evento;
            } else {
                alert(data.message || "Error al editar evento");
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
    nombre.addEventListener("blur", () => {
        if (nombre.value.trim() === "") {
            mostrarError(nombre, "Debes escribir un nombre");
        } else {
            quitarError(nombre);
        }
    });

    descripcion.addEventListener("blur", () => {
        if (descripcion.value.trim() === "") {
            mostrarError(descripcion, "Debes escribir una descripcion");
        } else {
            quitarError(descripcion);
        }
    });

    fecha.addEventListener("blur", () => {
        if (fecha.value.trim() === "") {
            mostrarError(fecha, "Debes escribir una fecha");
        } else {
            quitarError(fecha);
        }
    });

    lugar.addEventListener("blur", () => {
        if (lugar.value.trim() === "") {
            mostrarError(lugar, "Debes escribir un lugar");
        } else {
            quitarError(lugar);
        }
    });

    tipo_evento.addEventListener("blur", () => {
        if (tipo_evento.value.trim() === "") {
            mostrarError(tipo_evento, "Debes escribir un tipo de evento");
        } else {
            quitarError(tipo_evento);
        }
    });

    // Validación al enviar el formulario
    form.addEventListener("submit", (e) => {
        let valido = true;

        if (nombre.value.trim() === "") {
            mostrarError(nombre, "Debes escribir un nombre");
            valido = false;
        } else {
            quitarError(nombre);
        }

        if (descripcion.value.trim() === "") {
            mostrarError(descripcion, "Debes escribir una descripcion");
        } else {
            quitarError(descripcion);
        }

        if (fecha.value.trim() === "") {
            mostrarError(fecha, "Debes escribir una fecha");
        } else {
            quitarError(fecha);
        }

        if (lugar.value.trim() === "") {
            mostrarError(lugar, "Debes escribir un lugar");
        } else {
            quitarError(lugar);
        }

        if (tipo_evento.value.trim() === "") {
            mostrarError(tipo_evento, "Debes escribir un tipo de evento");
        } else {
            quitarError(tipo_evento);
        }

        if (!valido) {
            e.preventDefault(); // Evita enviar si hay errores
        }
    });
});

