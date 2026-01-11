document.getElementById("home-btn").addEventListener("click", () => {
    window.location.href = "../html/home.html";
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

function listarGanadoresGala() {
    var formData = new FormData();

    formData.append("funcion", "listarGanadoresGala");
    fetch("../php/acciones/gala.php", {
        method: "POST",
        body: formData
    })

        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            var SelectGala = document.querySelector('#galas');
            data.forEach(element => {

                var html = `<option> id_premio: ${element.id_premio} id_corto:(${element.id_corto})</option>`;

                SelectGala.innerHTML += html;
            });
        })

        .catch(function (error) {
            console.error("Errorrrrrrr en la solicitud ", error);
            alert("Error al hacer la solicitud. Vete a la consola para ver que ha pasado");
        })
}

listarGanadoresGala();

// Funciones pre gala
function cargarSecciones() {
    var formData = new FormData();

    formData.append("funcion", "cargarSecciones");
    fetch("../php/acciones/gala.php", {
        method: "POST",
        body: formData
    })
        .then(r => r.json())
        .then(data => {
            lista.innerHTML = "";
            data.forEach(elemnto => {
                lista.innerHTML += `
                <div class="evento">
                    <b>${elemnto.nombre}</b><br>
                    ${elemnto.hora} - ${elemnto.lugar}<br>
                    <button onclick="editar(${elemnto.id},'${elemnto.nombre}','${elemnto.hora}','${elemnto.lugar}')">Editar</button>
                    <button onclick="borrar(${elemnto.id})">Borrar</button>
                </div>`;
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
}

cargarSecciones();

// Funciones pos gala
$resumen = document.getElementById("resumen");
$Btnresumen = document.getElementById("btn-resumen").addEventListener("click", () => {
    $resumen.style.display = "block";
});

$eliminarResumen = document.getElementById("btn-eliminarR").addEventListener("click", () => {
    $resumen.style.display = "none";

    SelectResumen = document.getElementById('#texto-resumen');
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