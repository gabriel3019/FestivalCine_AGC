document.addEventListener("DOMContentLoaded", () => {
    const authVisitante = document.getElementById("auth-visitante");
    const authUsuario = document.getElementById("auth-usuario");
    const nombreUsuarioSpan = document.getElementById("nombreUsuario");
    const contenedor = document.getElementById("eventos-container");

    // ===================== 1. COMPROBACIÓN DE SESIÓN =====================
    fetch("../php/acciones/check-session.php", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (data.logged) {
                authVisitante.style.display = "none";
                authUsuario.style.display = "flex";
                nombreUsuarioSpan.textContent = data.usuario.nombre;
            } else {
                authVisitante.style.display = "flex";
                authUsuario.style.display = "none";
            }
        })
        .catch(err => {
            console.error("Error al verificar sesión", err);
            authVisitante.style.display = "flex";
            authUsuario.style.display = "none";
        });

    // ===================== 2. CARGAR EVENTOS =====================
    async function cargarEventos() {
        try {
            const res = await fetch("../php/acciones/eventos.php");
            const data = await res.json();

            if (!data.success) {
                console.error("Error cargando eventos:", data);
                return;
            }

            contenedor.innerHTML = "";

            data.eventos.forEach(ev => {
                const div = document.createElement("div");
                div.className = "evento";

                const imgSrc = ev.imagen ? ev.imagen : "../css/imagenes/fondo.png";

                div.innerHTML = `
                <img src="${imgSrc}" alt="Imagen evento">
                <div class="contenido">
                    <div class="meta-info">
                        <span class="lugar">
                            <img src="../css/iconos/icono_ubicacion.svg" class="icono-detalle">
                            ${ev.lugar || 'Por confirmar'}
                        </span>
                        <span class="fecha">
                            <img src="../css/iconos/icono_calendario.svg" class="icono-detalle">
                            ${ev.fecha_formateada}
                        </span>
                    </div>
                    <h3 class="titulo">${ev.nombre}</h3>
                    <p class="descripcion">${ev.descripcion || ''}</p>
                    <p class="info-extra">
                        <img src="../css/iconos/icono_relogArena.svg" class="icono-detalle">
                        ${ev.hora_inicio_formateada} - ${ev.hora_fin_formateada}
                        |
                        <img src="../css/iconos/icono_pergamino.svg" class="icono-detalle">
                        ${ev.tipo_evento || 'Evento'}
                    </p>
                </div>
            `;

                contenedor.appendChild(div);
            });

        } catch (error) {
            console.error("Error en fetch eventos:", error);
        }
    }

    // ===================== 3. EVENTOS DE INTERFAZ =====================
    document.getElementById("login-btn")?.addEventListener("click", () => {
        window.location.href = "/FestivalCine_AGC/html/login.html";
    });

    document.getElementById("register-btn")?.addEventListener("click", () => {
        window.location.href = "/FestivalCine_AGC/html/registro.html";
    });

    document.getElementById("icono_persona")?.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = document.getElementById("menu");
        if (menu) menu.style.display = menu.style.display === "block" ? "none" : "block";
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

    cargarEventos();
});