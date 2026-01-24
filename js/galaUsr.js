document.addEventListener("DOMContentLoaded", mostrarGala);

function mostrarGala() {
    const formData = new FormData();
    formData.append("funcion", "mostrarContenido");

    fetch("../php/acciones/galaUsr.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) return;

        const gala = data[0];

        document.getElementById("nombre").textContent = gala.nombre;
        document.getElementById("descripcion").textContent = gala.descripcion;
        document.getElementById("fecha").textContent = gala.fecha;

        const galeria = document.getElementById("galeria");
        galeria.innerHTML = "";

        gala.imagenes.forEach(img => {
            galeria.innerHTML += `<img src="../img/${img}" width="150">`;
        });
    })
    .catch(err => console.error(err));
}