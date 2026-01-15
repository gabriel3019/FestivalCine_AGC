window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const contenido = document.getElementById("contenido");

  if (!loader) return;

  const TIEMPO_MINIMO = 1000;

  setTimeout(() => {
    loader.classList.add("oculto");

    setTimeout(() => {
      loader.remove();
      if (contenido) contenido.hidden = false;
    }, 600);
  }, TIEMPO_MINIMO);
});
