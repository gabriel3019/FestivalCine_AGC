document.addEventListener("DOMContentLoaded", () => {

    const openVideo = document.getElementById("openVideo");
    const videoModal = document.getElementById("videoModal");
    const closeVideo = document.getElementById("closeVideo");
    const iframe = document.getElementById("youtubePlayer");

    let player;

    // Cargar API de YouTube
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
        player = new YT.Player("youtubePlayer", {
            events: {
                onReady: (event) => {
                    event.target.mute(); // empieza sin sonido
                }
            }
        });
    };

    // Abrir modal y reproducir
    openVideo.addEventListener("click", () => {
        videoModal.style.display = "flex";

        if (player) {
            player.playVideo();
        }
    });

    // Cerrar modal y parar vídeo
    closeVideo.addEventListener("click", () => {
        videoModal.style.display = "none";

        if (player) {
            player.stopVideo();
            player.mute();
        }
    });

});
