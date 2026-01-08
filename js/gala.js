document.getElementById("home-btn").addEventListener("click", () => {
    window.location.href = "../html/home.html";
});

// Recojo los dos divs que contienen la info de la pre y post gala
preGala = document.getElementById("pre");
posGala = document.getElementById("pos");

// Una vez se pulse el boton si la pre es la opcion visibe se esconde y se muestra la pos y viceversa
document.getElementById("cambio").addEventListener("click", () => {
    if(preGala.style.display === "block"){
        preGala.style.display = "none";
        posGala.style.display = "block";
    }else{
        preGala.style.display = "block";
        posGala.style.display = "none";
    }
});