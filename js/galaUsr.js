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