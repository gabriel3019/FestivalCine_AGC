document.addEventListener("DOMContentLoaded", function () {

    // Elementos de tablas
    const eventos = document.getElementById("eventos");
    const premios = document.getElementById("premios");

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

    // Cargar datos desde PHP
    fetch("../php/acciones/home_organizador.php")
        .then(res => res.json())
        .then(data => {

            // EVENTOS
            html = "<tr><th>Nombre</th><th>Fecha</th><th>Lugar</th></tr>";
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

});


// Recojo los dos divs que contienen la info de la pre y post gala
preGala = document.getElementById("pre");
posGala = document.getElementById("pos");

// Una vez se pulse el boton si la pre es la opcion visibe se esconde y se muestra la pos y viceversa
document.getElementById("cambio").addEventListener("click", () => {
    if (preGala.style.display === "block") {
        preGala.style.display = "none";
        posGala.style.display = "block";
    } else {
        preGala.style.display = "block";
        posGala.style.display = "none";
    }
});

// Funciones pre gala

// ===================== AÑADIR SECCION =====================

const btnAnadir = document.getElementById("btnNuevaSeccion");
const formulario = document.getElementById("formulario-seccion");
const formSeccion = document.getElementById("form-seccion");
const cancelar = document.getElementById("cancelar");

// ==========================ABRIR Y CERRAR EL MODAL=================================
btnAnadir.addEventListener("click", () => {
    formulario.classList.remove("oculto");
});

formSeccion.addEventListener("submit", async e => {
    e.preventDefault();

    const nombre = formSeccion.nombre.value.trim();
    const contenido = formSeccion.contenido.value.trim();
    const imagen = formSeccion.imagen.files[0];

    if (!nombre || !contenido) return;

    const data = { action: "anadir", titulo: nombre, contenido };
    if (imagen) data.imagen = imagen;

    const res = await api(data, true);
    if (res.success) {
        formSeccion.reset();
        limpiar();
        cargarSecciones();
    } else {
        alert(res.message || "Error al añadir seccion");
    }
});

cancelar.addEventListener("click", () => {
    limpiar();
    formSeccion.reset();
});

function cargarSecciones() {
    var formData = new FormData();

    formData.append("funcion", "cargarSecciones");
    fetch("../php/acciones/gala.php", {
        method: "POST",
        body: formData
    })
        .then(r => r.json())
        .then(data => {
            lista.innerHTML = "<tr><th>Nombre</th><th>Hora</th><th>Lugar</th><th>Borrar/Editar</th></tr>";
            data.forEach(elemnto => {
                lista.innerHTML += `
                <tr class="evento">
                    <td>${elemnto.nombre}</td>
                    <td>${elemnto.hora}</td>  
                    <td>${elemnto.lugar}</td>
                    <td><button class="eliminar"  onclick="borrar(${elemnto.id})">🗑️</button>
                    <button class="editar" onclick="editar(${elemnto.id},'${elemnto.nombre}','${elemnto.hora}','${elemnto.lugar}')">✏️</button></td>
                </tr>`;
            });
        });
}

function editar(i, n, h, l) {
    id.value = i;
    nombre.value = n;
    hora.value = h;
    lugar.value = l;
}

$btnGuardarSeccion = document.getElementById("guardarSecciones");
$btnGuardarSeccion.addEventListener("click", () => {
    var formData = new FormData();

    // Decidir función según si hay id
    if (id.value) {
        formData.append("funcion", "editarSeccion");
        formData.append("id", id.value);
    } else {
        formData.append("funcion", "nuevaSeccion");
    }

    // Datos del formulario
    formData.append("nombre", nombre.value);
    formData.append("hora", hora.value);
    formData.append("lugar", lugar.value);

    // Enviar al PHP
    fetch("../php/acciones/gala.php", {
        method: "POST",
        body: formData
    })
        .then(() => {
            limpiar();
            cargarSecciones();
        });
});

function borrar(id) {
    var formData = new FormData();
    formData.append("funcion", "borrarSeccion");
    formData.append("id", id);

    fetch("../php/acciones/gala.php", {
        method: "POST",
        body: formData
    })
        .then(() => cargarSecciones());
}

function limpiar() {
    id.value = "";
    nombre.value = "";
    hora.value = "";
    lugar.value = "";
    formulario.classList.add("oculto");
    noticiaActualId = null;
}

cargarSecciones();

// Funciones pos gala
resumen = document.getElementById("#texto-resumen");


eliminarResumen = document.getElementById("btn-eliminarR").addEventListener("click", () => {
    resumen.value = "";
});

// Añadir las imagenes al html
// Recogo el imput y la galeria de las imagenes
const inputImagen = document.getElementById("inputImagen");
const galeria = document.getElementById("galeria");

// Detecta cuando un usuario selecciona una imagen
inputImagen.addEventListener("change", function () {
    const archivo = inputImagen.files[0];

    if (archivo) {
        // Crear una etiqueta <img>
        const img = document.createElement("img");

        // Crear una URL temporal para la imagen
        img.src = URL.createObjectURL(archivo);

        // Estilo simple
        img.style.width = "200px";
        img.style.margin = "10px";

        // Añadir la imagen a la galería
        galeria.appendChild(img);
    }
});