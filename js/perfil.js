document.addEventListener("DOMContentLoaded", () => {

    const perfilForm = document.getElementById("perfilForm");
    const candidaturaForm = document.getElementById("candidaturaForm");
    const listaCandidaturas = document.getElementById("lista-candidaturas");
    const successMsg = document.getElementById("successMsg");

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
            listaCandidaturas.innerHTML = "<p>No has enviado candidaturas todavía.</p>";
            return;
        }

        candidaturas.forEach(c => {
            const div = document.createElement("div");
            div.className = "candidatura-card";
            console.log(c);

            const titulo = (c.titulo && c.titulo.trim() !== "")
                ? c.titulo
                : "Sin título";

            const descripcion = (c.descripcion && c.descripcion.trim() !== "")
                ? c.descripcion
                : "Sin descripción";

            const estado = c.estado_candidatura
                ? c.estado_candidatura.toUpperCase()
                : "DESCONOCIDO";

            const videoSrc = c.archivo_video
                ? `../${c.archivo_video}`
                : "";

            div.innerHTML = `
                <strong class="estado ${estado.toLowerCase()}">${estado}</strong><br>
                <strong>${titulo}</strong>
                <p>${descripcion}</p>
                ${
                    videoSrc
                        ? `<video controls width="280">
                               <source src="${videoSrc}">
                           </video>`
                        : `<p><em>Vídeo no disponible</em></p>`
                }
            `;

            listaCandidaturas.appendChild(div);
        });
    })
    .catch(err => {
        console.error("Error al cargar candidaturas:", err);
        listaCandidaturas.innerHTML = "<p>Error al cargar las candidaturas.</p>";
    });


    /* =====================================================
       NUEVA CANDIDATURA (NO REEMPLAZA)
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
                location.reload(); // recarga para ver la nueva candidatura
            } else {
                alert(res.message || "Error al enviar candidatura");
            }
        });
    });

});
