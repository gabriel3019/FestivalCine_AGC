<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

session_start();
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

// Consulta
$stmt = $conn->prepare(
    "SELECT id_usuario AS id, nombre, contrasena, rol 
     FROM usuarios 
     WHERE correo = ?"
);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Si no está, buscar en organizadores
    $stmt = $conn->prepare(
        "SELECT id_organizador AS id, nombre, contrasena, 'organizador' AS rol 
        FROM organizador 
        WHERE correo = ?"
    );
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos"]);
        exit;
    }
}

$user = $result->fetch_assoc();

// Verificar contraseña
if (!password_verify($password, $user['contrasena'])) {
    echo json_encode([
        "success" => false,
        "message" => "Correo o contraseña incorrectos"
    ]);
    exit;
}

// Crear sesión correctamente
$_SESSION['usuario'] = [
    "id" => $user['id'],
    "nombre" => $user['nombre'],
    "rol" => $user['rol']
];

// Respuesta
echo json_encode([
    "success" => true,
    "rol" => $user['rol']
]);

$stmt->close();
$conn->close();

?>