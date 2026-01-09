document.addEventListener("DOMContentLoaded", () => {
    cargarEventos();

    const contenedor = document.querySelector(".eventos-container");
    const btnAnadir = document.querySelector(".btn-anadir");
    const accionesGenerales = btnAnadir.parentElement;

    // ------------------ FUNCIONES ------------------
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

    // ------------------ CARGAR EVENTOS ------------------
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

    // ------------------ EVENTO CLICK ------------------
    contenedor.addEventListener("click", async (e) => {
        const evento = e.target.closest(".evento");
        if (!evento) return;

        const id = evento.dataset.id;

        // ---- BORRAR ----
        if (e.target.classList.contains("btn-eliminar")) {
            if (!confirm("¿Eliminar evento?")) return;
            const data = await enviarEvento({ action: "borrar", id });
            if (data.success) evento.remove();
            else alert(data.message || "Error al borrar evento");
        }

        // ---- EDITAR ----
        if (e.target.classList.contains("btn-editar")) {
            const nombre = evento.querySelector(".nombre").textContent;
            const descripcion = evento.querySelector(".descripcion").textContent;
            const fecha = evento.querySelector(".fecha").textContent;
            const lugar = evento.querySelector(".lugar").textContent;
            const tipo_evento = evento.querySelector(".tipo_evento").textContent;

            const nuevoNombre = prompt("Nuevo nombre", nombre);
            if (!nuevoNombre) return;

            const nuevaDescripcion = prompt("Nueva descripcion", descripcion);
            if (!nuevaDescripcion) return;

            let nuevaFecha = prompt("Fecha del evento (AAAA-MM-DD)");
            if (!nuevaFecha) return;

            // Validar formato simple YYYY-MM-DD
            const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
            if (!regexFecha.test(fecha)) {
                alert("Formato de fecha incorrecto. Usa AAAA-MM-DD");
                return;
            }

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
                tipo_evento: nuevoTipo_evento,
                id_organizador: 1
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

    // ------------------ AÑADIR ------------------
    btnAnadir.addEventListener("click", async () => {
        const nombre = prompt("Nombre del evento");
        if (!nombre) return;

        const descripcion = prompt("Descripcion del evento");
        if (!descripcion) return;

        const fecha = prompt("Fecha del evento");
        if (!fecha) return;

        const lugar = prompt("Lugar del evento");
        if (!lugar) return;

        const tipo_evento = prompt("Tipo de evento");
        if (!tipo_evento) return;


        const data = await enviarEvento({
            action: "anadir",
            nombre: nombre,
            descripcion: descripcion,
            fecha: fecha,
            lugar: lugar,
            tipo_evento: tipo_evento
        });

        if (data.success) {
            cargarEventos();
        } else {
            alert(data.message || "Error al añadir el ecento");
        }
    });
});
