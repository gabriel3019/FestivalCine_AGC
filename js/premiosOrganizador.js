document.addEventListener("DOMContentLoaded", () => {

    const categoriasContainer = document.querySelector(".categorias-premios");

    /* ===================== */
    /* MODAL */
    /* ===================== */

    const btnNuevo = document.getElementById("btnNuevoPremio");
    const modal = document.getElementById("modalPremio");
    const cerrarModal = document.getElementById("cerrarModal");
    const formPremio = document.getElementById("formPremio");

    const modalTitulo = document.getElementById("modalTitulo");
    const premioIdInput = document.getElementById("premio_id");
    const nombreInput = document.getElementById("modal_nombre");
    const descripcionInput = document.getElementById("modal_descripcion");
    const categoriaInput = document.getElementById("modal_categoria");

    /* ===================== */
    /* SESIÓN */
    /* ===================== */

    const profileIcon = document.getElementById("icono_persona");
    const profileMenu = document.getElementById("menu");
    const logoutBtn = document.getElementById("cerrar_sesion");
    const volver_home = document.getElementById("volver_home");
    const nombreUsuario = document.getElementById("nombreUsuario");

    fetch("../php/acciones/check-session.php", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (data.logged && data.usuario?.rol.toLowerCase() === "organizador") {
                profileIcon.style.display = "flex";
                nombreUsuario.textContent = data.usuario.nombre;
            } else {
                window.location.href = "../html/login.html";
            }
        });

    profileIcon.addEventListener("click", e => {
        e.stopPropagation();
        profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => profileMenu.style.display = "none");

    volver_home.addEventListener("click", () => {
        window.location.href = "home_organizador.html";
    });

    logoutBtn.addEventListener("click", () => {
        fetch("../php/acciones/cerrar_sesion.php")
            .then(() => window.location.href = "../html/login.html");
    });

    /* ===================== */
    /* FETCH */
    /* ===================== */

    async function fetchPremios(action, data = {}) {
        const formData = new FormData();
        formData.append("action", action);
        for (const key in data) formData.append(key, data[key]);
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
                <td data-label="Nombre"><strong>${p.nombre_premio}</strong></td>
                <td data-label="Descripción">${p.descripcion}</td>
                <td data-label="Acciones">
                    <button class="editar">Editar</button>
                    <button class="eliminar">Eliminar</button>
                </td>
            `;

            if (p.categoria === "Alumnos") {
                tabla = document.getElementById("tabla-alumnos");
            } else if (p.categoria === "Alumni") {
                tabla = document.getElementById("tabla-alumni");
            } else {
                tabla = document.getElementById("tabla-carrera");
            }

            tabla.appendChild(tr);
        });
    }

    /* ===================== */
    /* ABRIR MODAL NUEVO */
    /* ===================== */

    btnNuevo.addEventListener("click", () => {
        modalTitulo.textContent = "Añadir premio";
        formPremio.reset();
        premioIdInput.value = "";
        modal.style.display = "flex";
    });

    cerrarModal.addEventListener("click", () => modal.style.display = "none");

    modal.addEventListener("click", e => {
        if (e.target === modal) modal.style.display = "none";
    });

    /* ===================== */
    /* GUARDAR (AÑADIR / EDITAR) */
    /* ===================== */

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
            modal.style.display = "none";
            cargarPremios();
        } else {
            alert(data.message);
        }
    });

    /* ===================== */
    /* EDITAR / ELIMINAR */
    /* ===================== */

    categoriasContainer.addEventListener("click", async e => {
        const tr = e.target.closest("tr");
        if (!tr) return;

        const id = tr.dataset.id;

        if (e.target.classList.contains("editar")) {
            modalTitulo.textContent = "Editar premio";
            premioIdInput.value = id;
            nombreInput.value = tr.children[0].innerText;
            descripcionInput.value = tr.children[1].innerText;
            modal.style.display = "flex";
        }

        if (e.target.classList.contains("eliminar")) {
            if (!confirm("¿Eliminar premio?")) return;
            const data = await fetchPremios("borrar_premio", { id_premio: id });
            if (data.success) cargarPremios();
        }
    });

    cargarPremios();
});
