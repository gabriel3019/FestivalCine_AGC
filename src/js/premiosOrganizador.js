document.addEventListener("DOMContentLoaded", () => {

    /* ===================== */
    /* ELEMENTOS GENERALES */
    /* ===================== */
    const categoriasContainer = document.querySelector(".categorias-premios");

    const btnNuevo = document.getElementById("btnNuevoPremio");
    const modalPremio = document.getElementById("modalPremio");
    const cerrarModal = document.getElementById("cerrarModal");
    const formPremio = document.getElementById("formPremio");

    const modalTitulo = document.getElementById("modalTitulo");
    const premioIdInput = document.getElementById("premio_id");
    const nombreInput = document.getElementById("modal_nombre");
    const descripcionInput = document.getElementById("modal_descripcion");
    const categoriaInput = document.getElementById("modal_categoria");

    /* ===================== */
    /* MODAL CANDIDATOS */
    /* ===================== */
    const modalCandidatos = document.getElementById("modalCandidatos");
    const cerrarCandidatos = document.getElementById("cerrarCandidatos");
    const listaCandidatos = document.getElementById("listaCandidatos");
    const buscador = document.getElementById("buscadorCandidatos");

    let premioActivo = null;
    let categoriaActiva = null;
    let cortoActivo = null;

    const nombreUsuarioSpan = document.getElementById("nombreUsuario");

    fetch("../php/acciones/check-session.php", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (!data.logged || data.usuario?.tipo.toLowerCase() !== "organizador") {
                window.location.href = "../html/login.html";
                return;
            }


            if (nombreUsuarioSpan && data.usuario?.nombre) {
                nombreUsuarioSpan.textContent = data.usuario.nombre;
            }
        });


    document.getElementById("icono_persona").addEventListener("click", e => {
        e.stopPropagation();
        const menu = document.getElementById("menu");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
        document.getElementById("menu").style.display = "none";
    });

    document.getElementById("cerrar_sesion").addEventListener("click", () => {
        fetch("../php/acciones/cerrar_sesion.php").then(() => {
            window.location.href = "../html/login.html";
        });
    });

    document.getElementById("volver_home").addEventListener("click", () => {
        window.location.href = "home_organizador.html";
    });

    /* ===================== */
    /* FETCH GENÉRICO */
    /* ===================== */
    async function fetchPremios(action, data = {}) {
        const formData = new FormData();
        formData.append("action", action);
        for (const k in data) formData.append(k, data[k]);

        const res = await fetch("../php/acciones/premiosOrganizador.php", {
            method: "POST",
            body: formData
        });
        return res.json();
    }

    /* ===================== */
    /* CARGAR PREMIOS */
    /* ===================== */
    async function cargarPremios() {
        const data = await fetchPremios("listar");
        if (!data.success) return;

        document.getElementById("tabla-alumnos").innerHTML = "";
        document.getElementById("tabla-alumni").innerHTML = "";
        document.getElementById("tabla-carrera").innerHTML = "";

        data.premios.forEach(p => {
            const tr = document.createElement("tr");
            tr.dataset.id = p.id_premio;

            tr.innerHTML = `
                <td><strong>${p.nombre_premio}</strong></td>
                <td>${p.descripcion}</td>
                <td class="acciones">
                    <button class="btn-icon editar" title="Editar"></button>
                    <button class="btn-icon eliminar" title="Eliminar"></button>
                </td>

            `;


            if (p.categoria === "alumno") {
                document.getElementById("tabla-alumnos").appendChild(tr);
            } else if (p.categoria === "alumni") {
                document.getElementById("tabla-alumni").appendChild(tr);
            } else if (p.categoria === "honorifico") {
                document.getElementById("tabla-carrera").appendChild(tr);
            }
        });
    }

    /* ===================== */
    /* MODAL PREMIO */
    /* ===================== */
    btnNuevo.addEventListener("click", () => {
        modalTitulo.textContent = "Añadir premio";
        formPremio.reset();
        premioIdInput.value = "";
        modalPremio.style.display = "flex";
    });

    cerrarModal.addEventListener("click", () => {
        modalPremio.style.display = "none";
    });

    formPremio.addEventListener("submit", async e => {
        e.preventDefault();

        const action = premioIdInput.value ? "editar_premio" : "anadir_premio";

        const data = await fetchPremios(action, {
            id_premio: premioIdInput.value,
            nombre_premio: nombreInput.value,
            descripcion: descripcionInput.value,
            categoria: categoriaInput.value

        });

        if (data.success) {
            modalPremio.style.display = "none";
            cargarPremios();
        } else {
            alert(data.message);
        }
    });

    categoriasContainer.addEventListener("click", async e => {
        const tr = e.target.closest("tr");
        if (!tr) return;

        const id = tr.dataset.id;

        if (e.target.classList.contains("editar")) {
            modalTitulo.textContent = "Editar premio";
            premioIdInput.value = id;
            nombreInput.value = tr.children[0].innerText;
            descripcionInput.value = tr.children[1].innerText;
            modalPremio.style.display = "flex";
        }

        if (e.target.classList.contains("eliminar")) {
            await fetchPremios("borrar_premio", { id_premio: id });
            cargarPremios();
        }
    });

    let bloquePremioActivo = null;

    /* ===================== */
    /* ABRIR MODAL */
    /* ===================== */
    document.querySelectorAll(".btn-asignar").forEach(btn => {
        btn.addEventListener("click", async () => {

            bloquePremioActivo = btn.closest(".bloque-premio");
            const categoria = bloquePremioActivo.dataset.categoria;

            modalCandidatos.style.display = "flex";
            listaCandidatos.innerHTML = "";
            buscador.value = "";

            const data = await fetchPremios("listar_candidatos", { categoria });
            if (!data.success) return;

            data.candidatos.forEach(c => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td>${c.nombre} ${c.apellidos}</td>
                <td>${c.numero_expediente}</td>
                <td>${c.titulo}</td>
                <td>
                    <button class="btn-add-ganador"
                        data-corto="${c.id_corto}"
                        data-nombre="${c.nombre} ${c.apellidos}"
                        data-expediente="${c.numero_expediente}"
                        data-titulo="${c.titulo}">
                        Añadir ganador
                    </button>
                </td>
            `;
                listaCandidatos.appendChild(tr);
            });
        });
    });

    /* ===================== */
    /* SELECCIONAR CANDIDATO */
    /* ===================== */
    listaCandidatos.addEventListener("click", e => {
        if (!e.target.classList.contains("btn-add-ganador")) return;

        const btn = e.target;
        const ganadorDiv = bloquePremioActivo.querySelector(".ganador-seleccionado");
        const btnAsignar = bloquePremioActivo.querySelector(".btn-asignar");

        modalCandidatos.style.display = "none";
        btnAsignar.style.display = "none";

        ganadorDiv.innerHTML = `
        <div class="card-ganador">
            <p><strong>${btn.dataset.nombre}</strong></p>
            <p>Expediente: ${btn.dataset.expediente}</p>
            <p>Corto: ${btn.dataset.titulo}</p>

            <div class="acciones-ganador">
                <button class="btn-confirmar"
                    data-corto="${btn.dataset.corto}">
                    Confirmar ganador
                </button>
                <button class="btn-eliminar">
                    Eliminar
                </button>
            </div>
        </div>
    `;
    });

    /* ===================== */
    /* CONFIRMAR / ELIMINAR */
    /* ===================== */
    document.addEventListener("click", async e => {

        /* CONFIRMAR */
        if (e.target.classList.contains("btn-confirmar")) {

            const bloque = e.target.closest(".bloque-premio");

            const data = await fetchPremios("asignar_ganador", {
                id_premio: bloque.dataset.premio,
                id_corto: e.target.dataset.corto,
                id_gala: 1
            });

            if (!data.success) {
                alert(data.message);
                return;
            }

            e.target.parentElement.innerHTML =
                `<span style="color:green">✔ Ganador confirmado</span>`;
        }

        /* ELIMINAR */
        if (e.target.classList.contains("btn-eliminar")) {

            const bloque = e.target.closest(".bloque-premio");
            bloque.querySelector(".ganador-seleccionado").innerHTML = "";
            bloque.querySelector(".btn-asignar").style.display = "inline-block";
        }
    });


    buscador.addEventListener("input", () => {
        const texto = buscador.value.toLowerCase();
        listaCandidatos.querySelectorAll("tr").forEach(tr => {
            tr.style.display = tr.innerText.toLowerCase().includes(texto)
                ? ""
                : "none";
        });
    });

    listaCandidatos.addEventListener("click", async e => {

        /* ===== AÑADIR GANADOR (PRECONFIRMAR) ===== */
        if (e.target.classList.contains("btn-add-ganador")) {

            const btn = e.target;
            const cortoId = btn.dataset.corto;

            // Evitar duplicados
            if (btn.closest("tr").querySelector(".confirmacion-ganador")) return;

            // Ocultar botón original
            btn.style.display = "none";

            // Crear bloque de confirmación
            const div = document.createElement("div");
            div.classList.add("confirmacion-ganador");
            div.innerHTML = `
            <button class="btn-confirmar" data-corto="${cortoId}">
                Confirmar ganador
            </button>
            <button class="btn-eliminar" data-corto="${cortoId}">
                Eliminar
            </button>
        `;

            btn.parentElement.appendChild(div);
        }

        /* ===== CONFIRMAR GANADOR ===== */
        if (e.target.classList.contains("btn-confirmar")) {

            const cortoId = e.target.dataset.corto;

            const data = await fetchPremios("asignar_ganador", {
                id_premio: premioActivo,
                id_corto: cortoId,
                id_gala: 1
            });

            if (!data.success) {
                alert(data.message);
                return;
            }

            // Bloquear fila tras confirmar
            const fila = e.target.closest("tr");
            fila.querySelector(".confirmacion-ganador").innerHTML =
                `<strong style="color:green">✔ Ganador asignado</strong>`;
        }

        /* ===== ELIMINAR (VOLVER ATRÁS) ===== */
        if (e.target.classList.contains("btn-eliminar")) {

            const fila = e.target.closest("tr");
            const btnAsignar = fila.querySelector(".btn-add-ganador");
            const confirmacion = fila.querySelector(".confirmacion-ganador");

            // Restaurar estado original
            confirmacion.remove();
            btnAsignar.style.display = "inline-block";
        }
    });


    cerrarCandidatos.addEventListener("click", () => {
        modalCandidatos.style.display = "none";
    });

    /* ===================== */
    /* CONFIRMAR ELIMINAR PREMIO */
    /* ===================== */

    const modalEliminar = document.getElementById("modalConfirmarEliminar");
    const btnCancelarEliminar = document.getElementById("cancelarEliminar");
    const btnConfirmarEliminar = document.getElementById("confirmarEliminar");

    let premioAEliminar = null;

    // Click en icono eliminar
    document.addEventListener("click", e => {
        if (e.target.classList.contains("eliminar")) {

            const tr = e.target.closest("tr");
            premioAEliminar = tr.dataset.id;

            modalEliminar.style.display = "flex";
        }
    });

    // Cancelar
    btnCancelarEliminar.addEventListener("click", () => {
        premioAEliminar = null;
        modalEliminar.style.display = "none";
    });

    // Confirmar
    btnConfirmarEliminar.addEventListener("click", async () => {
        if (!premioAEliminar) return;

        await fetchPremios("borrar_premio", {
            id_premio: premioAEliminar
        });

        modalEliminar.style.display = "none";
        premioAEliminar = null;

        cargarPremios();
    });


    /* ===================== */
    /* INIT */
    /* ===================== */
    cargarPremios();
});
