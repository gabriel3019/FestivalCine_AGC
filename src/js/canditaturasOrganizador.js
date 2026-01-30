document.addEventListener("DOMContentLoaded", () => {

    let candidaturaActual = null;

    /* ===================== SESIÓN ORGANIZADOR ===================== */
    const nombreUsuario = document.getElementById("nombreUsuario");
    const profileIcon = document.getElementById("icono_persona");
    const profileMenu = document.getElementById("menu");
    const logoutBtn = document.getElementById("cerrar_sesion");
    const volverHome = document.getElementById("volver_home");

    fetch("../php/acciones/check-session.php", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (!data.logged || data.usuario?.tipo !== "organizador") {
                window.location.href = "../html/login.html";
                return;
            }

            document.getElementById("auth-user").style.display = "flex";
            if (nombreUsuario) nombreUsuario.textContent = data.usuario.nombre;
        });

    profileIcon?.addEventListener("click", e => {
        e.stopPropagation();
        profileMenu.style.display =
            profileMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
        if (profileMenu) profileMenu.style.display = "none";
    });

    logoutBtn?.addEventListener("click", () => {
        fetch("../php/acciones/cerrar_sesion.php")
            .then(() => window.location.href = "../html/login.html");
    });

    volverHome?.addEventListener("click", () => {
        window.location.href = "home_organizador.html";
    });

    /* ===================== CARGAR CANDIDATURAS ===================== */
    fetch("../php/acciones/obtenerCanditaturaOrganizador.php")
        .then(res => res.json())
        .then(data => {

            data.forEach(c => {
                const card = document.createElement("div");
                card.className = "candidatura-card";
                card.dataset.estado = c.estado_candidatura;

                card.innerHTML = `
                    <h4>${c.titulo}</h4>
                    <p>${c.nombre} ${c.apellidos}</p>

                    <span class="estado estado-${c.estado_candidatura}">
                        ${c.estado_candidatura.toUpperCase()}
                    </span>

                    ${
                        c.estado_candidatura === "pendiente"
                            ? `<button class="btn-aceptar revisar">Revisar</button>`
                            : ""
                    }
                `;

                card.querySelector(".revisar")
                    ?.addEventListener("click", () => abrirModal(c));

                const contenedor =
                    document.getElementById(
                        c.categoria === "alumno"
                            ? "candidaturas-alumno"
                            : c.categoria === "alumni"
                                ? "candidaturas-alumni"
                                : "candidaturas-honorifico"
                    );

                contenedor?.appendChild(card);
            });
        });

    /* ===================== MODAL REVISIÓN ===================== */
    function abrirModal(c) {
        candidaturaActual = c;

        document.getElementById("modal-titulo").textContent = c.titulo;
        document.getElementById("modal-autor").textContent =
            `${c.nombre} ${c.apellidos}`;
        document.getElementById("modal-expediente").textContent =
            c.numero_expediente;
        document.getElementById("modal-video").src = "../" + c.archivo_video;
        document.getElementById("modal-memoria").href =
            "../" + c.memoria_pdf;

        document.getElementById("modal-revision").classList.remove("oculto");
    }

    /* ===================== BOTONES MODALES ===================== */
    document.getElementById("btn-aceptar")
        ?.addEventListener("click", () => {
            document.getElementById("modal-revision").classList.add("oculto");
            document.getElementById("modal-aceptar").classList.remove("oculto");
        });

    document.getElementById("btn-rechazar")
        ?.addEventListener("click", () => {
            document.getElementById("modal-revision").classList.add("oculto");
            document.getElementById("modal-rechazo").classList.remove("oculto");
        });

    document.getElementById("volver-revision")
        ?.addEventListener("click", () => {
            document.getElementById("modal-rechazo").classList.add("oculto");
            document.getElementById("modal-revision").classList.remove("oculto");
        });

    document.getElementById("cancelar-aceptar")
        ?.addEventListener("click", () => {
            document.getElementById("modal-aceptar").classList.add("oculto");
            document.getElementById("modal-revision").classList.remove("oculto");
        });

    document.getElementById("confirmar-aceptar")
        ?.addEventListener("click", () => resolver("aceptada"));

    document.getElementById("confirmar-rechazo")
        ?.addEventListener("click", () => {
            const motivo = document.getElementById("motivo-rechazo").value.trim();
            if (!motivo) {
                alert("Debes indicar un motivo de rechazo");
                return;
            }
            resolver("rechazada", motivo);
        });

    /* ===================== RESOLVER SIN RECARGAR ===================== */
    function resolver(estado, motivo = null) {

        const fd = new FormData();
        fd.append("id", candidaturaActual.id_candidatura);
        fd.append("estado", estado);
        if (motivo) fd.append("motivo", motivo);

        fetch("../php/acciones/resolverCanditatura.php", {
            method: "POST",
            body: fd
        }).then(() => {

            // Actualizar visualmente la tarjeta
            document.querySelectorAll(".candidatura-card").forEach(card => {
                if (card.querySelector("h4").textContent === candidaturaActual.titulo) {

                    card.dataset.estado = estado;

                    const estadoSpan = card.querySelector(".estado");
                    estadoSpan.textContent = estado.toUpperCase();
                    estadoSpan.className = `estado estado-${estado}`;

                    const btn = card.querySelector(".revisar");
                    if (btn) btn.remove();
                }
            });

            cerrarModales();
        });
    }

    function cerrarModales() {
        document.querySelectorAll(".modal")
            .forEach(m => m.classList.add("oculto"));
    }

    /* ===================== FILTROS ===================== */
    document.querySelectorAll(".filtro").forEach(btn => {
        btn.addEventListener("click", () => {

            document.querySelectorAll(".filtro")
                .forEach(b => b.classList.remove("activo"));
            btn.classList.add("activo");

            const estado = btn.dataset.estado;

            document.querySelectorAll(".candidatura-card").forEach(card => {
                if (estado === "todas" || card.dataset.estado === estado) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

});
