document.addEventListener("DOMContentLoaded", function () {

    //Elementos importantes al cargar la página
    const eventos = document.getElementById("eventos");
    const premios = document.getElementById("premios");
    const profileIcon = document.getElementById("icono_persona");
    const profileMenu = document.getElementById("menu");
    const logoutBtn = document.getElementById("cerrar_sesion");
    const volver_home = document.getElementById("volver_home");
    const nombreUsuario = document.getElementById("nombreUsuario");

    const preGala = document.getElementById("pre");
    const posGala = document.getElementById("pos");
    const btnCambio = document.getElementById("cambio");

    const btnAnadir = document.getElementById("btnNuevaSeccion");
    const formulario = document.getElementById("formulario-seccion");
    const formSeccion = document.getElementById("form-seccion");
    const cancelar = document.getElementById("cancelar");
    const btnGuardarSeccion = document.getElementById("guardarSecciones");
    const lista = document.getElementById("lista");

    const resumen = document.getElementById("texto-resumen");
    const btnEliminarResumen = document.getElementById("btn-eliminarR");

    const inputImagen = document.getElementById("inputImagen");
    const galeria = document.getElementById("galeria");

    //Comprobamos que la sesion está iniciada
    fetch("../php/acciones/check-session.php", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (data.logged && data.usuario?.tipo.toLowerCase() === "organizador") {
                profileIcon.style.display = "flex";
                nombreUsuario.textContent = data.usuario.nombre;
            } else {
                window.location.href = "../html/login.html";
            }
        });

    //Parte del menu del perfl
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
        fetch("../php/acciones/cerrar_sesion.php").then(() => {
            window.location.href = "../html/login.html";
        });
    });

    //fetch para gargar las tablas de la página
    fetch("../php/acciones/home_organizador.php")
        .then(res => res.json())
        .then(data => {
            // EVENTOS
            let html = "<tr><th>Nombre</th><th>Fecha</th><th>Lugar</th></tr>";
            data.eventos.forEach(e => {
                html += `<tr><td>${e.nombre}</td><td>${e.fecha}</td><td>${e.lugar}</td></tr>`;
            });
            eventos.innerHTML = html;

            // PREMIOS
            html = "<tr><th>Premio</th><th>Categoria</th></tr>";
            data.premios.forEach(p => {
                html += `<tr><td>${p.nombre_premio}</td><td>${p.categoria || ''}</td></tr>`;
            });
            premios.innerHTML = html;
        })
        .catch(err => console.error("Error al cargar datos:", err));

    //fecth para recorger en que formato está la gala
    const formDataFormato = new FormData();
    formDataFormato.append("funcion", "obtenerFormatoGala");

    fetch("../php/acciones/gala.php", {
        method: "POST",
        body: formDataFormato
    })
        .then(res => res.json())
        .then(data => {
            if (data.formato === "pos") {
                preGala.style.display = "none";
                posGala.style.display = "block";
            } else {
                preGala.style.display = "block";
                posGala.style.display = "none";
            }
        });

    //boton para el cambio del formato de la gala
    btnCambio.addEventListener("click", () => {
        let nuevoFormato;

        if (preGala.style.display === "block") {
            preGala.style.display = "none";
            posGala.style.display = "block";
            nuevoFormato = "pos";
        } else {
            preGala.style.display = "block";
            posGala.style.display = "none";
            nuevoFormato = "pre";
        }

        // fetch para guardar en la base de datos
        const formData = new FormData();
        formData.append("funcion", "cambiarFormato");
        formData.append("formato", nuevoFormato);

        fetch("../php/acciones/gala.php", {
            method: "POST",
            body: formData
        });
    });

    //Secciones de la pre-gala
    btnAnadir.addEventListener("click", () => formulario.classList.remove("oculto"));
    cancelar.addEventListener("click", () => {
        limpiar();
        formSeccion.reset();
    });

    formSeccion.addEventListener("submit", async e => {
        e.preventDefault();
        const nombre = formSeccion.nombre.value.trim();
        const contenido = formSeccion.contenido.value.trim();

        if (!nombre || !contenido) return;

        const data = { action: "anadir", titulo: nombre, contenido };
        const res = await api(data, true);
        if (res.success) {
            formSeccion.reset();
            limpiar();
            cargarSecciones();
        } else {
            alert(res.message || "Error al añadir seccion");
        }
    });

    btnGuardarSeccion.addEventListener("click", () => {
        const fd = new FormData();
        if (id.value) {
            fd.append("funcion", "editarSeccion");
            fd.append("id", id.value);
        } else {
            fd.append("funcion", "nuevaSeccion");
        }
        fd.append("nombre", nombre.value);
        fd.append("hora", hora.value);
        fd.append("lugar", lugar.value);

        fetch("../php/acciones/gala.php", { method: "POST", body: fd })
            .then(() => { limpiar(); cargarSecciones(); });
    });

    function cargarSecciones() {
        const fd = new FormData();
        fd.append("funcion", "cargarSecciones");
        fetch("../php/acciones/gala.php", { method: "POST", body: fd })
            .then(r => r.json())
            .then(data => {
                lista.innerHTML = "<tr><th>Nombre</th><th>Hora</th><th>Lugar</th><th>Borrar/Editar</th></tr>";
                data.forEach(elemnto => {
                    lista.innerHTML += `
                        <tr class="evento">
                            <td>${elemnto.nombre}</td>
                            <td>${elemnto.hora}</td>  
                            <td>${elemnto.lugar}</td>
                            <td>
                                <button class="eliminar" onclick="borrar(${elemnto.id})">🗑️</button>
                                <button class="editar" onclick="editar(${elemnto.id},'${elemnto.nombre}','${elemnto.hora}','${elemnto.lugar}')">✏️</button>
                            </td>
                        </tr>`;
                });
            });
    }

    function limpiar() {
        id.value = "";
        nombre.value = "";
        hora.value = "";
        lugar.value = "";
        formulario.classList.add("oculto");
    }

    cargarSecciones();

    //Parte de la pos-gala
    btnEliminarResumen.addEventListener("click", () => resumen.value = "");

    inputImagen.addEventListener("change", function () {
        const archivo = inputImagen.files[0];
        if (!archivo) return;

        const img = document.createElement("img");
        img.src = URL.createObjectURL(archivo);
        img.style.width = "200px";
        img.style.margin = "10px";
        galeria.appendChild(img);
    });

});
