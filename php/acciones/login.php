<?php
header('Content-Type: application/json');
session_start();
require "../BBDD/conecta.php";
require "../BBDD/crear_tabla.php";

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode([
        "success" => false,
        "message" => "Completa todos los campos"
    ]);
    exit;
}

// Buscar usuario
$stmt = $conn->prepare("SELECT id_usuario AS id, nombre, contrasena, rol FROM usuarios WHERE correo=?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Buscar organizador
    $stmt = $conn->prepare("SELECT id_organizador AS id, nombre, contrasena, 'organizador' AS rol FROM organizador WHERE correo=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos"]);
        exit;
    }
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['contrasena'])) {
    echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos"]);
    exit;
}

$_SESSION['usuario'] = [
    "id" => $user['id'],
    "nombre" => $user['nombre'],
    "rol" => strtolower($user['rol'])
];

echo json_encode([
    "success" => true,
    "rol" => strtolower($user['rol'])
]);

$stmt->close();
$conn->close();
