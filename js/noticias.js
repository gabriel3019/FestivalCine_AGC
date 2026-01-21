document.addEventListener("DOMContentLoaded", () => {
    const authVisitante = document.getElementById("auth-visitante");
    const authUsuario = document.getElementById("auth-usuario");
    const nombreUsuarioSpan = document.getElementById("nombreUsuario");
    const contenedor = document.getElementById("noticias-container");
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

    // ===================== 2. CARGAR NOTICIAS =====================
    async function cargarNoticias() {
        try {
            const res = await fetch("../php/acciones/noticias.php");
            const data = await res.json();

            if (data.success) {
                contenedor.innerHTML = "";
                data.noticias.forEach(n => {
                    const div = document.createElement("div");
                    div.className = "noticia";
                    const imgSrc = n.imagen ? n.imagen : "../css/imagenes/fondo.png";

                    div.innerHTML = `
                        <img src="${imgSrc}" alt="Imagen noticia">
                        <div class="contenido">
                            <div class="meta-info">
                                <span class="lugar">Madrid</span>
                                <span class="fecha">${n.fecha} - ${n.hora}</span>
                            </div>
                            <h3 class="titulo">${n.titulo}</h3>
                            <p class="descripcion">${n.contenido}</p>
                        </div>
                    `;
                    contenedor.appendChild(div);
                });
            }
        } catch (error) {
            console.error("Error cargando noticias:", error);
        }
    }

    // ===================== 3. EVENTOS =====================
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

    cargarNoticias();
});