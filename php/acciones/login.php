<?php
session_start();
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "";
$db   = "festivalcine";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión"
    ]);
    exit;
}

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode([
        "success" => false,
        "message" => "Completa todos los campos"
    ]);
    exit;
}

$stmt = $conn->prepare("SELECT id, contrasena FROM usuarios WHERE correo = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Si usas password_hash()
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];

        echo json_encode([
            "success" => true
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Contraseña incorrecta"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Usuario no encontrado"
    ]);
}

$stmt->close();
$conn->close();
