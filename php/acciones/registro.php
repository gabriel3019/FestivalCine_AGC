<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "";
$db   = "festivalcine";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["success"=>false,"message"=>"Error de conexión"]);
    exit;
}

// Recibir campos
$nombre    = $_POST['nombre'] ?? '';
$apellidos = $_POST['apellidos'] ?? '';
$email     = $_POST['email'] ?? '';
$password  = $_POST['password'] ?? '';

// Validar campos
if (!$nombre || !$apellidos || !$email || !$password) {
    echo json_encode(["success"=>false,"message"=>"Todos los campos son obligatorios"]);
    exit;
}

// Verificar si el correo ya existe
$check = $conn->prepare("SELECT id_usuario FROM usuarios WHERE correo = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();
if ($check->num_rows > 0) {
    echo json_encode(["success"=>false,"message"=>"El correo ya está registrado"]);
    exit;
}
$check->close();

// Hash de la contraseña
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insertar usuario con rol "usuario" y fecha actual
$fecha = date('Y-m-d');
$stmt = $conn->prepare(
    "INSERT INTO usuarios (nombre, apellidos, correo, contrasena, rol, fecha_registro) 
     VALUES (?, ?, ?, ?, 'usuario', ?)"
);
$stmt->bind_param("sssss", $nombre, $apellidos, $email, $hashedPassword, $fecha);

if ($stmt->execute()) {
    echo json_encode(["success"=>true]);
} else {
    echo json_encode(["success"=>false,"message"=>"Error al registrar usuario"]);
}

$stmt->close();
$conn->close();
