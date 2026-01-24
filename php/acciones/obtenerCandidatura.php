<?php
session_start();
header("Content-Type: application/json");

require_once __DIR__ . "/../bbdd/conecta.php";

if (!isset($_SESSION['usuario'])) {
    echo json_encode([]);
    exit;
}

$idUsuario = $_SESSION['usuario']['id'];

$sql = "
    SELECT 
        co.titulo,
        co.descripcion,
        co.archivo_video,
        c.estado_candidatura,
        c.fecha_envio
    FROM candidaturas c
    JOIN cortometrajes co ON c.id_corto = co.id_corto
    WHERE co.id_usuario = ?
    ORDER BY c.fecha_envio DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idUsuario);
$stmt->execute();

$result = $stmt->get_result();
$candidaturas = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($candidaturas);
