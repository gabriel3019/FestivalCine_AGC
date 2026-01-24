function mostrarGala() {
    contenido = document.getElementById("contenido");

    var formData = new FormData();

    formData.append("funcion", "mostrarContenido");
    fetch("../php/acciones/galaUsr.php", {
        method: "POST",
        body: formData
    })
        .then(r => r.json())
        .then(data => {
            texto.innerHTML = "";
            data.forEach(elemnto => {
                texto.innerHTML += ``;
            });
        });
};

function cargarImagenes() {
    contenido = document.getElementById("galeria");

    var formData = new FormData();

    formData.append("funcion", "mostrarImagenes");
    fetch("../php/acciones/galaUsr.php", {
        method: "POST",
        body: formData
    })
        .then(r => r.json())
        .then(data => {
            texto.innerHTML = "";
            data.forEach(elemnto => {
                texto.innerHTML += ``;
            });
        });
};