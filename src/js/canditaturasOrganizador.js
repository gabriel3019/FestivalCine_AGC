document.addEventListener("DOMContentLoaded", () => {

    let candidaturaActual = null;

    /* ===================== SESIÓN ORGANIZADOR ===================== */
    fetch("../php/acciones/check-session.php", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (!data.logged || data.usuario?.tipo !== "organizador") {
                window.location.href = "login.html";
            } else {
                document.getElementById("auth-user").style.display = "flex";
                document.getElementById("nombreUsuario").textContent =
                    data.usuario.nombre;
            }
        });

    /* ===================== CARGAR CANDIDATURAS ===================== */
    fetch("../php/acciones/obtenerCanditaturaOrganizador.php")
        .then(res => res.json())
        .then(candidaturas => {

            candidaturas.forEach(c => {

                const card = document.createElement("div");
                card.className = "candidatura-card";
                card.dataset.estado = c.estado_candidatura;

                card.innerHTML = `
                    <h4>${c.titulo}</h4>
                    <p>${c.nombre} ${c.apellidos}</p>

                    <span class="estado estado-${c.estado_candidatura}">
                        ${c.estado_candidatura.toUpperCase()}
                    </span>

                    <button class="btn-ver revisar">Ver corto</button>
                `;

                card.querySelector(".revisar")
                    .addEventListener("click", () => abrirModal(c));

                const contenedor =
                    document.getElementById(
                        c.categoria === "alumno"
                            ? "candidaturas-alumno"
                            : c.categoria === "alumni"
                                ? "candidaturas-alumni"
                                : "candidaturas-honorifico"
                    );

                contenedor.appendChild(card);
            });
        });

    /* ===================== MODAL ===================== */
    function abrirModal(c) {
        candidaturaActual = c;

        // 🏷️ TÍTULO
        document.getElementById("modal-titulo").textContent =
            `${c.titulo} (${c.estado_candidatura.toUpperCase()})`;

        // 👤 AUTOR
        document.getElementById("modal-autor").textContent =
            `${c.nombre} ${c.apellidos}`;

        // 🆔 EXPEDIENTE
        document.getElementById("modal-expediente").textContent =
            c.numero_expediente;

        // 🖼️ PORTADA (RUTA CORRECTA)
        const portada = document.getElementById("modal-portada");
        if (c.imagen_portada) {
            portada.src = "../" + c.imagen_portada;
            portada.style.display = "block";
        } else {
            portada.style.display = "none";
        }

        // 📝 DESCRIPCIÓN
        document.getElementById("modal-descripcion").textContent =
            c.descripcion || "Sin descripción disponible.";

        // 🎬 VÍDEO
        document.getElementById("modal-video").src =
            "../" + c.archivo_video;

        // 📄 PDF
        document.getElementById("modal-memoria").href =
            "../" + c.memoria_pdf;

        // ⚖️ ACCIONES
        document.querySelector(".acciones").style.display =
            c.estado_candidatura === "pendiente" ? "flex" : "none";

        document.getElementById("modal-revision")
            .classList.remove("oculto");
    }


    /* ===================== BOTONES ===================== */
    document.getElementById("btn-aceptar")
        ?.addEventListener("click", () => resolver("aceptada"));

    document.getElementById("btn-rechazar")
        ?.addEventListener("click", () => {
            const motivo = prompt("Motivo del rechazo:");
            if (motivo) resolver("rechazada", motivo);
        });

    document.getElementById("cerrar-modal")
        ?.addEventListener("click", cerrarModales);

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") cerrarModales();
    });

    function resolver(estado, motivo = null) {
        const fd = new FormData();
        fd.append("id", candidaturaActual.id_candidatura);
        fd.append("estado", estado);
        if (motivo) fd.append("motivo", motivo);

        fetch("../php/acciones/resolverCanditatura.php", {
            method: "POST",
            body: fd
        }).then(() => cerrarModales());
    }

    function cerrarModales() {
        document.getElementById("modal-revision")
            .classList.add("oculto");
        document.getElementById("modal-video").src = "";
    }

});
