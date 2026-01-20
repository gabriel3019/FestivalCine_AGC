<?php
header('Content-Type: application/json');
require "../BBDD/conecta.php";

$sql = "SELECT titulo, contenido, fecha_publicacion FROM noticias 
        ORDER BY fecha_publicacion DESC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => $conn->error]);
    exit;
}

$noticias = [];
while ($fila = $result->fetch_assoc()) {
    $noticias[] = $fila;
}

echo json_encode($noticias);
