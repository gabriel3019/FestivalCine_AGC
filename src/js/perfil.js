document.addEventListener("DOMContentLoaded", () => {

    const perfilForm = document.getElementById("perfilForm");
    const candidaturaForm = document.getElementById("candidaturaForm");
    const listaCandidaturas = document.getElementById("lista-candidaturas");
    const successMsg = document.getElementById("successMsg");

    /* ===================== */
    /* MODAL SUBSANAR */
    /* ===================== */
    const modalSubsanar = document.getElementById("modal-subsanar");
    const motivoTexto = document.getElementById("motivo-rechazo-texto");
    const mensajeSubsanacion = document.getElementById("mensaje-subsanacion");
    const cancelarSubsanar = document.getElementById("cancelar-subsanar");
    const enviarSubsanacion = document.getElementById("enviar-subsanacion");

    let candidaturaSubsanarId = null;

    /* =====================================================
       CARGAR PERFIL DE USUARIO
    ===================================================== */
    fetch("../php/acciones/perfil.php")
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                window.location.href = "login.html";
                return;
            }

            const u = data.usuario;
            perfilForm.nombre.value = u.nombre;
            perfilForm.apellidos.value = u.apellidos;
            perfilForm.telefono.value = u.telefono ?? "";
            perfilForm.correo.value = u.correo;
            perfilForm.numero_expediente.value = u.numero_expediente;
        });

    /* =====================================================
       GUARDAR DATOS DEL PERFIL
    ===================================================== */
    perfilForm.addEventListener("submit", e => {
        e.preventDefault();

        const data = new FormData(perfilForm);

        fetch("../php/acciones/actualizarPerfil.php", {
            method: "POST",
            body: data
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                successMsg.textContent = "Perfil actualizado correctamente";
                successMsg.style.display = "block";
            } else {
                alert(res.message || "Error al actualizar perfil");
            }
        });
    });

    /* =====================================================
       CARGAR CANDIDATURAS DEL USUARIO
    ===================================================== */
    fetch("../php/acciones/obtenerCandidatura.php")
        .then(res => res.json())
        .then(candidaturas => {

            listaCandidaturas.innerHTML = "";

            if (!Array.isArray(candidaturas) || candidaturas.length === 0) {
                listaCandidaturas.innerHTML =
                    "<p>No has enviado candidaturas todavía.</p>";
                return;
            }

            candidaturas.forEach(c => {

                const div = document.createElement("div");
                div.className = "candidatura-card";

                const titulo = c.titulo?.trim() || "Sin título";
                const descripcion = c.descripcion?.trim() || "Sin descripción";
                const estado = c.estado_candidatura || "pendiente";
                const videoSrc = c.archivo_video ? `../${c.archivo_video}` : "";

                div.innerHTML = `
                    <span class="estado ${estado}">
                        ${estado.toUpperCase()}
                    </span>

                    <h4>${titulo}</h4>
                    <p>${descripcion}</p>

                    ${
                        videoSrc
                            ? `<video controls width="280">
                                   <source src="${videoSrc}">
                               </video>`
                            : `<p><em>Vídeo no disponible</em></p>`
                    }

                    ${
                        estado === "rechazada"
                            ? `
                            <p class="rechazo-texto">
                                <strong>Motivo del rechazo:</strong><br>
                                ${c.motivo_rechazo}
                            </p>

                            <button class="btn-principal btn-subsanar"
                                data-id="${c.id_candidatura}"
                                data-motivo="${c.motivo_rechazo}">
                                Subsanar candidatura
                            </button>
                            `
                            : ""
                    }
                `;

                listaCandidaturas.appendChild(div);
            });
        })
        .catch(err => {
            console.error("Error al cargar candidaturas:", err);
            listaCandidaturas.innerHTML =
                "<p>Error al cargar las candidaturas.</p>";
        });

    /* =====================================================
       ABRIR MODAL SUBSANAR
    ===================================================== */
    document.addEventListener("click", e => {
        if (e.target.classList.contains("btn-subsanar")) {

            candidaturaSubsanarId = e.target.dataset.id;
            motivoTexto.textContent =
                "Motivo del rechazo: " + e.target.dataset.motivo;

            mensajeSubsanacion.value = "";
            modalSubsanar.classList.remove("oculto");
        }
    });

    /* =====================================================
       CANCELAR SUBSANAR
    ===================================================== */
    cancelarSubsanar?.addEventListener("click", () => {
        candidaturaSubsanarId = null;
        modalSubsanar.classList.add("oculto");
    });

    /* =====================================================
       ENVIAR SUBSANACIÓN
    ===================================================== */
    enviarSubsanacion?.addEventListener("click", () => {

        const mensaje = mensajeSubsanacion.value.trim();

        if (!mensaje) {
            alert("Debes explicar qué has corregido");
            return;
        }

        const fd = new FormData();
        fd.append("id_candidatura", candidaturaSubsanarId);
        fd.append("mensaje", mensaje);

        fetch("../php/acciones/subsanarCandidatura.php", {
            method: "POST",
            body: fd
        })
        .then(res => res.json())
        .then(() => location.reload());
    });

    /* =====================================================
       NUEVA CANDIDATURA
    ===================================================== */
    candidaturaForm.addEventListener("submit", e => {
        e.preventDefault();

        const data = new FormData(candidaturaForm);

        fetch("../php/acciones/crearCandidatura.php", {
            method: "POST",
            body: data
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                alert("Candidatura enviada correctamente");
                candidaturaForm.reset();
                location.reload();
            } else {
                alert(res.message || "Error al enviar candidatura");
            }
        });
    });

});
