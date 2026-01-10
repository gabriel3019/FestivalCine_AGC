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

function listarGala(){
    var formData = new FormData();

    formData.append("funcion", "listarGala");
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

                var html = `<option>${element.nombre} nivel:(${element.descripcion})</option>`;

                SelectGala.innerHTML += html;
            });
        })

        .catch(function (error) {
            console.error("Errorrrrrrr en la solicitud ", error);
            alert("Error al hacer la solicitud. Vete a la consola para ver que ha pasado");
        })
}

listarGala();

/* Funciones pre gala
function listarSecciones() {

}

// Funciones pos gala
function listarSeccionesPos() {
    var formData = new formData();

    formData.append("funcion", "listarSeccionesPos");
    fetch("../php/acciones/gala.php", {
        method: "POST",
        body: formData
    })

        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            var SelectUsr = document.querySelector('#nombreU');
            data.forEach(element => {

                var html = `<option value="${element.id_usuario}" nivel="${element.nivel}">${element.apodo} nivel:(${element.nivel})</option>`;

                SelectUsr.innerHTML += html;
            });
        })

        .catch(function (error) {
            console.error("Errorrrrrrr en la solicitud ", error);
            alert("Error al hacer la solicitud. Vete a la consola para ver que ha pasado");
        })
}*/