<?php
session_start();
require "../bbdd/conecta.php";
header("Content-Type: application/json");

if (!isset($_SESSION['usuario'])) {
    echo json_encode(["success" => false]);
    exit;
}

$id = $_SESSION['usuario']['id'];

$nombre = $_POST['nombre'] ?? '';
$apellidos = $_POST['apellidos'] ?? '';
$telefono = $_POST['telefono'] ?? null;
$correo = $_POST['correo'] ?? '';

$sql = "UPDATE usuarios 
        SET nombre = ?, apellidos = ?, telefono = ?, correo = ?
        WHERE id_usuario = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssi", $nombre, $apellidos, $telefono, $correo, $id);

if ($stmt->execute()) {
    // Actualizar sesión
    $_SESSION['usuario']['nombre'] = $nombre;
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar perfil"]);
}
