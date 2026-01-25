document.addEventListener("DOMContentLoaded", mostrarGalasAnteriores);

function mostrarGalasAnteriores() {
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
            document.getElementById("texto").textContent = gala.texto;
            document.getElementById("fecha").textContent = gala.fecha;

            const galeria = document.getElementById("galeria");
            galeria.innerHTML = "";

            gala.imagenes.forEach(img => {
                galeria.innerHTML += `<img src="../css/imagenes/${img}" width="150">`;
            });
        })
        .catch(err => console.error(err));
}