<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "festivalCine");
if ($conn->connect_error) {
    die(json_encode(["error" => $conn->connect_error]));
}

$sql = "SELECT id_noticia, titulo, contenido, imagen, fecha_publicacion 
        FROM noticias 
        WHERE estado='publicada' 
        ORDER BY fecha_publicacion DESC 
        LIMIT 1";

$result = $conn->query($sql);

$noticia = $result->fetch_assoc() ?: [];

echo json_encode($noticia);
?>
