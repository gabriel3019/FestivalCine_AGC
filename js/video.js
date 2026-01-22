const openVideo = document.getElementById("openVideo");
const modal = document.getElementById("videoModal");
const closeVideo = document.getElementById("closeVideo");

openVideo.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeVideo.addEventListener("click", () => {
    modal.style.display = "none";
    const iframe = modal.querySelector("iframe");
    iframe.src = iframe.src;
});