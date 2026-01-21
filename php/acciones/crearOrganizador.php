<?php
// Conexión a la base de datos
require "../BBDD/conecta.php"; // Ajusta la ruta según tu proyecto

// Comprobar que llegaron los datos del formulario
if(isset($_POST['nombre'], $_POST['correo'], $_POST['contrasena'])){

    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $contrasena = password_hash($_POST['contrasena'], PASSWORD_DEFAULT); // Encriptar contraseña

    // PREPARED STATEMENT para seguridad
    $stmt = $conn->prepare("INSERT INTO organizador (nombre, correo, contrasena) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $nombre, $correo, $contrasena);

    if($stmt->execute()){
        echo "Cuenta creada correctamente";
    } else {
        // Si hay error, lo mostramos
        echo "Error al crear la cuenta: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Faltan datos";
}

$conn->close();
?>
