const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        window.location.href = "/FestivalCine_AGC/html/login.html";
    });
}

const registerBtn = document.getElementById("register-btn");
if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        window.location.href = "/FestivalCine_AGC/html/registro.html";
    });
}

fetch("../php/acciones/eventos.php")
    .then(res => res.json())
    .then(eventos => {
        const contenedor = document.getElementById("eventos-container");

        eventos.forEach(evento => {
            const card = document.createElement("article");
            card.classList.add("card");

            card.innerHTML = `
                <h3>${evento.nombre}</h3>
    <p>${evento.descripcion}</p>

    <div class="card-info">
        <div class="info-row">
            <span class="icon"><img src="../css/imagenes/icono_ubicacion.png"  style="width:25px; height:30px;"></span>
            <span>${evento.lugar}</span>
        </div>

        <div class="info-row">
            <span class="icon"><img src="../css/imagenes/icono_tipoEvento.png"  style="width:20px; height:20px;"></span>
            <span>${evento.tipo_evento}</span>
        </div>

        <div class="info-row date-row">
            <span class="icon"><img src="../css/imagenes/icono_calendario.png"  style="width:20px; height:20px;"></span>
            <span>${formatearFecha(evento.fecha)}</span>
        </div>
    </div>
`;

            contenedor.appendChild(card);
        });
    })
    .catch(err => console.error("Error cargando eventos:", err));

function formatearFecha(fecha) {
    const f = new Date(fecha);
    return f.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}