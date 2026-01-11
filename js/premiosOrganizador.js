document.addEventListener("DOMContentLoaded", () => {
    const categoriasContainer = document.querySelector(".categorias-premios");
    const nuevaCategoriaInput = document.getElementById("nombre_categoria");
    const nuevaCategoriaForm = document.querySelector(".nueva-categoria form");

    
    // Elementos de sesión
    const profileIcon = document.getElementById("icono_persona");
    const profileMenu = document.getElementById("menu");
    const logoutBtn = document.getElementById("cerrar_sesion");
    const volver_home = document.getElementById("volver_home");
    const nombreUsuario = document.getElementById("nombreUsuario");

    // Comprobar sesión
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

    // Mostrar/Ocultar menú de perfil
    profileIcon.addEventListener("click", function (event) {
        event.stopPropagation();
        profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function () {
        profileMenu.style.display = "none";
    });

    // Volver a home
    volver_home.addEventListener("click", function () {
        window.location.href = "home_organizador.html";
    });

    // Cerrar sesión
    logoutBtn.addEventListener("click", function () {
        fetch("../php/acciones/cerrar_sesion.php")
            .then(() => {
                window.location.href = "../html/login.html";
            });
    });

    async function fetchPremios(action, data = {}) {
        const formData = new FormData();
        formData.append("action", action);
        for (const key in data) formData.append(key, data[key]);
        const res = await fetch("../php/acciones/premiosOrganizador.php", { method: "POST", body: formData });
        return res.json();
    }

    async function cargarPremios() {
        const data = await fetchPremios("listar");
        if (!data.success) return;

        // Limpiar categorías actuales
        const categorias = categoriasContainer.querySelectorAll(".categoria");
        categorias.forEach(c => c.remove());

        data.premios.forEach(p => {
            const div = document.createElement("div");
            div.classList.add("categoria");
            div.dataset.id = p.id_premio;
            div.innerHTML = `
                    <h3>${p.categoria}</h3>
                    <ul>
                        <li class="premio-item">
                        <strong>${p.nombre_premio}</strong>
                        <p>${p.descripcion}</p>
                        </li>
                    </ul>
                    <div class="premio-acciones">
                        <button class="editar">Editar</button>
                        <button class="eliminar">Eliminar</button>
                    </div>
`;
            categoriasContainer.insertBefore(div, categoriasContainer.querySelector(".nueva-categoria"));
        });
    }

    nuevaCategoriaForm.addEventListener("submit", async e => {
        e.preventDefault();
        const nombre = nuevaCategoriaInput.value.trim();
        const descripcion = document.getElementById("descripcion_categoria").value.trim();
        const categoria = document.getElementById("categoria_premio").value;

        if (!nombre || !descripcion || !categoria) return alert("Rellena todos los campos");

        const data = await fetchPremios("anadir_premio", {
            nombre_premio: nombre,
            descripcion: descripcion,
            categoria: categoria
        });

        if (data.success) {
            nuevaCategoriaInput.value = "";
            document.getElementById("descripcion_categoria").value = "";
            document.getElementById("categoria_premio").value = "";
            cargarPremios();
        } else {
            alert(data.message);
        }
    });


    // Editar / borrar
    categoriasContainer.addEventListener("click", async e => {
        const div = e.target.closest(".categoria");
        if (!div) return;
        const id = div.dataset.id;
        if (e.target.classList.contains("editar")) {
            const nombre = prompt("Nuevo nombre de premio", div.querySelector("strong").textContent);
            const descripcion = prompt("Nueva descripción", div.querySelector("p").textContent);
            const categoria = prompt("Nueva categoría (Alumnos, Alumni, Carrera Profesional)", div.querySelector("h3").textContent);

            if (!nombre || !categoria) return;

            const data = await fetchPremios("editar_premio", {
                id_premio: id,
                nombre_premio: nombre,
                descripcion: descripcion,
                categoria: categoria
            });

            if (data.success) cargarPremios();
            else alert(data.message);
        }

        if (e.target.classList.contains("eliminar")) {
            if (!confirm("Eliminar premio?")) return;
            const data = await fetchPremios("borrar_premio", { id_premio: id });
            if (data.success) cargarPremios();
            else alert(data.message);
        }
    });

    cargarPremios();
});
