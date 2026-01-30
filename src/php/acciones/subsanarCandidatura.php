<?php

session_start();
header("Content-Type: application/json");
require "../BBDD/conecta.php";


$idUsuario = $_SESSION['usuario']['id'];
$idCandidatura = $_POST['id_candidatura'] ?? null;
$mensaje = trim($_POST['mensaje'] ?? "");

if (!$idCandidatura || $mensaje === "") {
    echo json_encode([
        "success" => false,
        "message" => "Datos incompletos"
    ]);
    exit;
}

/* ===================== VERIFICAR PROPIEDAD ===================== */
$stmt = $conn->prepare("
    SELECT c.id_candidatura
    FROM candidaturas c
    JOIN cortometrajes co ON c.id_corto = co.id_corto
    WHERE c.id_candidatura = ?
      AND co.id_usuario = ?
      AND c.estado_candidatura = 'rechazada'
");
$stmt->bind_param("ii", $idCandidatura, $idUsuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "No autorizado"
    ]);
    exit;
}

/* ===================== SUBSANAR ===================== */
$stmt = $conn->prepare("
    UPDATE candidaturas
    SET
        estado_candidatura = 'pendiente',
        mensaje_subsanacion = ?,
        motivo_rechazo = NULL,
        fecha_envio = NOW(),
        fecha_resolucion = NULL
    WHERE id_candidatura = ?
");

$stmt->bind_param("si", $mensaje, $idCandidatura);
$stmt->execute();

echo json_encode(["success" => true]);
