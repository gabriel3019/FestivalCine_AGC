<?php
header('Content-Type: application/json');
require "../BBDD/conecta.php";

$sql = "SELECT id_evento, nombre, descripcion,
        DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
        DATE_FORMAT(fecha, '%d/%m/%Y') AS fecha_formateada,
        TIME_FORMAT(hora_inicio, '%H:%i') AS hora_inicio_formateada,
        TIME_FORMAT(hora_fin, '%H:%i') AS hora_fin_formateada,
        lugar,
        tipo_evento,
        imagen
    FROM eventos
    ORDER BY fecha ASC, hora_inicio ASC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "error" => $conn->error,
        "eventos" => []
    ]);
    exit;
}

$eventos = [];
$rutaWeb = "../uploads/";

while ($row = $result->fetch_assoc()) {
    $row['imagen'] = $row['imagen'] ? $rutaWeb . $row['imagen'] : null;
    $eventos[] = $row;
}

echo json_encode([
    "success" => true,
    "eventos" => $eventos
]);
