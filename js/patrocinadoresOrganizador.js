document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("patrocinadores-container");
    const btnAnadir = document.getElementById("btnAnadir");
    const formulario = document.getElementById("formulario-patrocinador");
    const formPatrocinador = document.getElementById("form-patrocinador");
    const cancelar = document.getElementById("cancelar");
    const overlay = document.getElementById("overlay");

    const modalEditar = document.getElementById("modal-patrocinador");
    const modalForm = document.getElementById("modal-form");
    const modalCancelar = document.getElementById("modal-cancelar");
    const modalNombreInput = document.getElementById("modal-nombre-input");
    const modalLogoInput = document.getElementById("modal-logo-input");

    const modalEliminar = document.getElementById("modal-eliminar");
    const confirmarEliminar = document.getElementById("confirmar-eliminar");
    const cancelarEliminar = document.getElementById("cancelar-eliminar");

    let patrocinadorActualId = null;

        // ===================== SESIÓN =====================
    fetch("../php/acciones/check-session.php", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (!data.logged || data.usuario.tipo.toLowerCase() !== "organizador") {
                window.location.href = "../html/login.html";
            } else {
                document.getElementById("nombreUsuario").textContent = data.usuario.nombre;
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

    // ===================== FUNCIONES API =====================
    async function api(data){
        const formData = new FormData();
        for(let key in data){
            if(key==="logo" && data[key] instanceof File){
                formData.append("logo", data[key]);
            } else {
                formData.append(key,data[key]);
            }
        }
        const res = await fetch("../php/acciones/patrocinadoresOrganizador.php", {
            method:"POST",
            body: formData
        });
        return res.json();
    }

    // ===================== CARGAR =====================
    async function cargarPatrocinadores(){
        const data = await api({ action:"listar" });
        if(!data.success) return;

        contenedor.innerHTML = "";
        data.patrocinadores.forEach(p=>{
            const div = document.createElement("div");
            div.className="patrocinador";
            div.dataset.id=p.id_patrocinador;
            const logoSrc = p.logo ? p.logo : "../css/imagenes/fondo.png";
            div.innerHTML=`
                <img src="${logoSrc}" alt="${p.nombre}">
                <div class="patrocinador-info">
                    <h4>${p.nombre}</h4>
                </div>
                <div class="acciones">
                    <button class="btn-editar">✏️</button>
                    <button class="btn-eliminar">🗑️</button>
                </div>
            `;
            contenedor.appendChild(div);
        });
    }

    cargarPatrocinadores();

    // ===================== MODALES =====================
    function cerrarTodo(){
        formulario.classList.add("oculto");
        modalEditar.classList.add("oculto");
        modalEliminar.classList.add("oculto");
        overlay.classList.add("oculto");
        patrocinadorActualId = null;
        formPatrocinador.reset();
        modalForm.reset();
    }

    btnAnadir.addEventListener("click", ()=>{
        formulario.classList.remove("oculto");
        overlay.classList.remove("oculto");
    });

    cancelar.addEventListener("click", cerrarTodo);
    overlay.addEventListener("click", cerrarTodo);
    modalCancelar.addEventListener("click", cerrarTodo);
    cancelarEliminar.addEventListener("click", cerrarTodo);

    // ===================== AÑADIR =====================
    formPatrocinador.addEventListener("submit", async e=>{
        e.preventDefault();
        const nombre = formPatrocinador.nombre.value.trim();
        const logo = formPatrocinador.logo.files[0];
        if(!nombre) return;

        const res = await api({ action:"anadir", nombre, logo });
        if(res.success){
            cerrarTodo();
            cargarPatrocinadores();
        }
    });

    // ===================== EDITAR / ELIMINAR =====================
    contenedor.addEventListener("click", e=>{
        const pat = e.target.closest(".patrocinador");
        if(!pat) return;
        patrocinadorActualId = pat.dataset.id;

        if(e.target.classList.contains("btn-editar")){
            modalNombreInput.value = pat.querySelector("h4").textContent;
            modalEditar.classList.remove("oculto");
            overlay.classList.remove("oculto");
        }
        if(e.target.classList.contains("btn-eliminar")){
            modalEliminar.classList.remove("oculto");
            overlay.classList.remove("oculto");
        }
    });

    modalForm.addEventListener("submit", async e=>{
        e.preventDefault();
        const nombre = modalNombreInput.value.trim();
        const logo = modalLogoInput.files[0];
        if(!nombre) return;

        const res = await api({ action:"editar", id:patrocinadorActualId, nombre, logo });
        if(res.success){
            cerrarTodo();
            cargarPatrocinadores();
        }
    });

    confirmarEliminar.addEventListener("click", async ()=>{
        const res = await api({ action:"borrar", id:patrocinadorActualId });
        if(res.success){
            cerrarTodo();
            cargarPatrocinadores();
        }
    });

});
