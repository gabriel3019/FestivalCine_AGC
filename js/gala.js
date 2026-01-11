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
function listarSecciones() {

}

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