<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "";
$db   = "tu_base_de_datos";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión"
    ]);
    exit;
}

$nombre    = $_POST['nombre'] ?? '';
$apellidos = $_POST['apellidos'] ?? '';
$email     = $_POST['email'] ?? '';
$password  = $_POST['password'] ?? '';

if (empty($nombre) || empty($apellidos) || empty($email) || empty($password)) {
    echo json_encode([
        "success" => false,
        "message" => "Todos los campos son obligatorios"
    ]);
    exit;
}

// Comprobar si el email ya existe
$check = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "El correo ya está registrado"
    ]);
    exit;
}

$check->close();

// Encriptar contraseña
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insertar usuario
$stmt = $conn->prepare(
    "INSERT INTO usuarios (nombre, apellidos, correo, contrasena) VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("ssss", $nombre, $apellidos, $email, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al registrar usuario"
    ]);
}

$stmt->close();
$conn->close();
