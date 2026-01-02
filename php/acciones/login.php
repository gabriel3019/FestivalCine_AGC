<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require "../BBDD/conecta.php";

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode([
        "success" => false,
        "message" => "Completa todos los campos"
    ]);
    exit;
}

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Completa todos los campos"]);
    exit;
}

// Preparar y ejecutar consulta
$stmt = $conn->prepare("SELECT id_usuario, nombre, contrasena, rol FROM usuarios WHERE correo = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos"]);
    exit;
}

$user = $result->fetch_assoc();

// Verificar contraseña
if (!password_verify($password, $user['contrasena'])) {
    echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos"]);
    exit;
}

// Iniciar sesión
session_start();
$_SESSION['id_usuario'] = $user['id_usuario'];
$_SESSION['nombre'] = $user['nombre'];
$_SESSION['rol'] = $user['rol'];

// Responder JSON con éxito y rol
echo json_encode([
    "success" => true,
    "rol" => $user['rol']
]);

$stmt->close();
$conn->close();
