<?php
header('Content-Type: application/json');
require "../BBDD/conecta.php";

$sql = "SELECT nombre, descripcion, fecha, lugar, tipo_evento FROM eventos 
        ORDER BY fecha DESC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => $conn->error]);
    exit;
}

$eventos = [];
while ($fila = $result->fetch_assoc()) {
    $eventos[] = $fila;
}

echo json_encode($eventos);
