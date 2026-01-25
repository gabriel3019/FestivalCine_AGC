<?php
session_start();
require "../BBDD/conecta.php";

// Seguridad básica
if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['tipo'] !== 'organizador') {
    http_response_code(403);
    exit;
}

$id = $_POST['id'] ?? null;
$estado = $_POST['estado'] ?? null;
$motivo = $_POST['motivo'] ?? null;

if (!$id || !$estado) {
    http_response_code(400);
    exit;
}

/* ===================== ACTUALIZAR CANDIDATURA ===================== */
if ($estado === 'aceptada') {

    $stmt = $conn->prepare("
        UPDATE candidaturas
        SET 
            estado_candidatura = 'aceptada',
            motivo_rechazo = NULL,
            fecha_resolucion = NOW()
        WHERE id_candidatura = ?
    ");

    $stmt->bind_param("i", $id);
    $stmt->execute();
}

if ($estado === 'rechazada') {

    $stmt = $conn->prepare("
        UPDATE candidaturas
        SET 
            estado_candidatura = 'rechazada',
            motivo_rechazo = ?,
            fecha_resolucion = NOW()
        WHERE id_candidatura = ?
    ");

    $stmt->bind_param("si", $motivo, $id);
    $stmt->execute();
}

echo json_encode(["success" => true]);
