document.addEventListener("DOMContentLoaded", mostrarGalasAnteriores);

function mostrarGalasAnteriores() {
    const formData = new FormData();
    formData.append("funcion", "mostrarContenido");

    fetch("../php/acciones/galasAnteriores.php", {
        method: "POST",
        body: formData
    })
        .then(res => {
            if (!res.ok) throw new Error("Error en la respuesta");
            return res.json();
        })
        .then(data => {
            const tbody = document.getElementById("galas");
            if (!tbody || !Array.isArray(data)) return;

            let html = "";
            data.forEach(gala => {
                html += `
                <tr>
                    <td>${gala.nombre}</td>
                    <td class="imagen">
                        <img src="../css/${gala.imagen}" alt="${gala.nombre}">
                    </td>
                    <td>${gala.resumen}</td>
                </tr>
            `;
            });

            tbody.innerHTML = html;
        })
        .catch(err => console.error(err));
}