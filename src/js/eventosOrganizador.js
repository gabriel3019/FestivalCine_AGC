document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("eventos-container");

    const btnAnadir = document.getElementById("btnAnadir");
    const formulario = document.getElementById("formulario-evento");
    const formEvento = document.getElementById("form-evento");
    const cancelar = document.getElementById("cancelar");

    const overlay = document.getElementById("overlay");

    const nombre = document.getElementById("nombre");
    const descripcion = document.getElementById("descripcion");
    const fecha = document.getElementById("fecha");
    const lugar = document.getElementById("lugar");
    const inicio = document.getElementById("inicio");
    const fin = document.getElementById("fin");
    const tipo_evento = document.getElementById("tipo_evento");
    const imagen = document.getElementById("imagen");

    // Modal editar 
    const modalEditar = document.getElementById("modal-evento");
    const modalForm = document.getElementById("modal-form");
    const modalCancelar = document.getElementById("modal-cancelar");

    //Modal eliminar
    const modalEliminar = document.getElementById("modal-eliminar");
    const confirmarEliminar = document.getElementById("confirmar-eliminar");
    const cancelarEliminar = document.getElementById("cancelar-eliminar");

    let eventoActualId = null;

    // ===================== SESIÓN =====================
    fetch("../php/acciones/check-session.php", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (!data.logged || data.usuario.tipo.toLowerCase() !== "organizador") {
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

        const res = await fetch("../php/acciones/eventosOrganizador.php", {
            method: "POST",
            body: formData
        });

        return res.json();
    }
    // ===================== CARGAR EVENTOS =====================
    async function cargarEventos() {
        const data = await api({ action: "listar" });
        if (!data.success) return;

        contenedor.innerHTML = "";

        data.eventos.forEach(ev => {
            const div = document.createElement("div");
            div.className = "evento";
            div.dataset.id = ev.id_evento;
            div.dataset.raw = JSON.stringify(ev); // Guardamos datos para editar rápido

            // Si no hay imagen, usamos la de fondo por defecto
            const imgSrc = ev.imagen ? ev.imagen : "../css/imagenes/fondo.png";

            div.innerHTML = `
                <img src="${imgSrc}" alt="Imagen evento">
                <div class="contenido">
                    <div class="meta-info">
                        <span class="lugar"><img src="../css/iconos/icono_ubicacion.svg" class="icono-detalle" alt="Lugar"> ${ev.lugar}</span>
                        <span class="fecha"><img src="../css/iconos/icono_calendario.svg" class="icono-detalle" alt="Fecha">  ${ev.fecha_formateada}</span>
                    </div>
                    <h3 class="nombre">${ev.nombre}</h3>
                    <p class="descripcion">${ev.descripcion}</p>
                    <p class="info-extra"><img src="../css/iconos/icono_relogArena.svg" class="icono-detalle" alt="Relog"> ${ev.hora_inicio_formateada} - ${ev.hora_fin_formateada} | <img src="../css/iconos/icono_pergamino.svg" class="icono-detalle" alt="Fecha"> ${ev.tipo_evento}</p>
                    <div class="acciones">
                        <button class="btn-editar"><img src="../css/iconos/icono_editar.svg" class="icono-detalle" alt="Fecha"></button>
                        <button class="btn-eliminar"><img src="../css/iconos/icono_eliminar.svg" class="icono-detalle" alt="Fecha"></button>
                    </div>
                </div>
            `;
            contenedor.appendChild(div);
        });
    }

    cargarEventos();

    // ===================== ABRIR/CERRAR MODALES =====================
    function cerrarTodo() {
        formulario.classList.add("oculto");
        modalEditar.classList.add("oculto");
        modalEliminar.classList.add("oculto");
        overlay.classList.add("oculto");
        eventoActualId = null;
    }

    function resetFormularioEvento() {
        formEvento.reset();
    }

    btnAnadir.addEventListener("click", () => {
        resetFormularioEvento();
        formulario.classList.remove("oculto");
        overlay.classList.remove("oculto");
    });

    cancelar.addEventListener("click", () => {
        resetFormularioEvento();
        cerrarTodo();
    });

    overlay.addEventListener("click", cerrarTodo);
    modalCancelar.addEventListener("click", cerrarTodo);
    cancelarEliminar.addEventListener("click", cerrarTodo);

    // ===================== AÑADIR EVENTO =====================
    formEvento.addEventListener("submit", async e => {
        e.preventDefault();

        let hayError = false;

        campos.forEach(({ input, error }) => {
            if (
                (input.type !== "file" && input.value.trim() === "") ||
                (input.type === "file" && input.files.length === 0)
            ) {
                input.classList.add("input-error");
                if (error) error.style.display = "block";
                hayError = true;
            }
        });

        if (hayError) return;


        const data = {
            action: "anadir",
            nombre: formEvento.nombre.value.trim(),
            descripcion: formEvento.descripcion.value.trim(),
            fecha: formEvento.fecha.value.trim(),
            hora_inicio: formEvento.hora_inicio.value.trim(),
            hora_fin: formEvento.hora_fin.value.trim(),
            lugar: formEvento.lugar.value.trim(),
            tipo_evento: formEvento.tipo_evento.value.trim(),
            imagen: formEvento.imagen.files[0]
        };

        if (!data.nombre || !data.imagen) {
            alert("Faltan campos obligatorios");
            return;
        }

        const res = await api(data);

        if (res.success) {
            formEvento.reset();
            cerrarTodo();
            cargarEventos();
        } else {
            alert(res.message || "Error al añadir evento");
        }
    });

    // ===================== EDITAR / ELIMINAR =====================
    contenedor.addEventListener("click", e => {
        const tarjeta = e.target.closest(".evento");
        if (!tarjeta) return;

        const ev = JSON.parse(tarjeta.dataset.raw); // Usamos los datos crudos guardados
        eventoActualId = ev.id_evento;

        if (e.target.classList.contains("btn-editar")) {
            // Rellenar el modal con los datos del objeto ev
            document.getElementById("modal-nombre-input").value = ev.nombre;
            document.getElementById("modal-descripcion-input").value = ev.descripcion;
            document.getElementById("modal-fecha-input").value = ev.fecha;
            document.getElementById("modal-lugar-input").value = ev.lugar;
            document.getElementById("modal-inicio-input").value = ev.hora_inicio;
            document.getElementById("modal-fin-input").value = ev.hora_fin;
            document.getElementById("modal-tipo_evento-input").value = ev.tipo_evento;

            modalEditar.classList.remove("oculto");
            overlay.classList.remove("oculto");
        }

        if (e.target.classList.contains("btn-eliminar")) {
            modalEliminar.classList.remove("oculto");
            overlay.classList.remove("oculto");
        }
    });

    // ===================== GUARDAR EDICIÓN =====================
    modalForm.addEventListener("submit", async e => {
        e.preventDefault();

        // 1. Definir las referencias que faltaban
        const nombreInput = document.getElementById("modal-nombre-input");
        const descripcionInput = document.getElementById("modal-descripcion-input");
        const fechaInput = document.getElementById("modal-fecha-input");
        const lugarInput = document.getElementById("modal-lugar-input");
        const inicioInput = document.getElementById("modal-inicio-input");
        const finInput = document.getElementById("modal-fin-input");
        const tipoEventoInput = document.getElementById("modal-tipo_evento-input");
        const imagenInput = document.getElementById("modal-imagen-input");

        // 2. Validar campos básicos
        if (!nombreInput.value.trim() || !fechaInput.value) {
            alert("El nombre y la fecha son obligatorios");
            return;
        }

        // 3. Construir el objeto de datos (id_evento debe coincidir con el PHP)
        const data = {
            action: "editar",
            id_evento: eventoActualId, // Cambiado de 'id' a 'id_evento'
            nombre: nombreInput.value.trim(),
            descripcion: descripcionInput.value.trim(),
            fecha: fechaInput.value,
            hora_inicio: inicioInput.value,
            hora_fin: finInput.value,
            lugar: lugarInput.value.trim(),
            tipo_evento: tipoEventoInput.value.trim()
        };

        // 4. Si hay imagen nueva, la añadimos
        if (imagenInput.files[0]) {
            data.imagen = imagenInput.files[0];
        }

        try {
            const res = await api(data);

            if (res.success) {
                cerrarTodo();
                cargarEventos(); // Recargar la lista para ver los cambios
            } else {
                alert("Error al actualizar: " + (res.message || "Error desconocido"));
            }
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    });

    // ===================== CONFIRMAR ELIMINACIÓN =====================
    confirmarEliminar.addEventListener("click", async () => {
        const res = await api({ action: "borrar", id_evento: eventoActualId });
        if (res.success) {
            cerrarTodo();
            cargarEventos();
        }
    });

    const campos = [
        { input: nombre, error: document.getElementById('add-nombreError') },
        { input: descripcion, error: document.getElementById('add-descripcionError') },
        { input: fecha, error: document.getElementById('add-fechaError') },
        { input: inicio, error: document.getElementById('add-inicioError') },
        { input: fin, error: document.getElementById('add-finError') },
        { input: lugar, error: document.getElementById('add-lugarError') },
        { input: tipo_evento, error: document.getElementById('add-tipo_eventoError') },
        { input: imagen, error: document.getElementById('add-imagenError') }
    ];

    campos.forEach(({ input, error }) => {
        input.classList.remove("input-error");
        if (error) error.style.display = "none";
    });

    campos.forEach(({ input, error }) => {

        // Cuando sales del campo
        input.addEventListener("blur", () => {
            if (
                (input.type !== "file" && input.value.trim() === "") ||
                (input.type === "file" && input.files.length === 0)
            ) {
                input.classList.add("input-error");
                if (error) error.style.display = "block";
            }
        });

        // Cuando escribes
        input.addEventListener("input", () => {
            if (input.value.trim() !== "") {
                input.classList.remove("input-error");
                if (error) error.style.display = "none";
            }
        });

        // Para input type="file"
        input.addEventListener("change", () => {
            if (input.files.length > 0) {
                input.classList.remove("input-error");
                if (error) error.style.display = "none";
            }
        });
    });



});
