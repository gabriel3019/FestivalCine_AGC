<?php
session_start();
header("Content-Type: application/json");
require "../BBDD/conecta.php";

if (!isset($_SESSION['usuario'])) {
    echo json_encode([]);
    exit;
}

$sql = "
SELECT
    c.id_candidatura,
    c.memoria_pdf,
    c.estado_candidatura,
    co.titulo,
    co.categoria,
    co.archivo_video,
    u.nombre,
    u.apellidos,
    u.numero_expediente
FROM candidaturas c
JOIN cortometrajes co ON c.id_corto = co.id_corto
JOIN usuarios u ON co.id_usuario = u.id_usuario
ORDER BY co.categoria, c.fecha_envio
";

$result = $conn->query($sql);
echo json_encode($result->fetch_all(MYSQLI_ASSOC));
