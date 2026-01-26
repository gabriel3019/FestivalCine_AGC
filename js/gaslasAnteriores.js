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
                        <img src="../css/imagenes/${gala.imagen}" alt="${gala.nombre}">
                    </td>
                    <td>${gala.resumen}</td>
                </tr>
            `;
            });

            tbody.innerHTML = html;
        })
        .catch(err => console.error(err));

    // =================Botones de iniciar y cerrar sesion======================
    document.getElementById("login-btn")?.addEventListener("click", () => {
        window.location.href = "/FestivalCine_AGC/html/login.html";
    });

    document.getElementById("register-btn")?.addEventListener("click", () => {
        window.location.href = "/FestivalCine_AGC/html/registro.html";
    });

    document.getElementById("icono_persona")?.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = document.getElementById("menu");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    });

    document.getElementById("cerrar_sesion")?.addEventListener("click", () => {
        fetch("../php/acciones/cerrar_sesion.php").then(() => {
            window.location.reload();
        });
    });

    document.addEventListener("click", () => {
        const menu = document.getElementById("menu");
        if (menu) menu.style.display = "none";
    });
}