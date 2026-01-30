<?php
header('Content-Type: application/json');
require "../BBDD/conecta.php";

$query = "SELECT id_noticia, titulo, contenido, fecha_publicacion, imagen,
          DATE_FORMAT(fecha_publicacion, '%d %b %Y') as fecha,
          DATE_FORMAT(fecha_publicacion, '%H:%i') as hora
          FROM noticias
          ORDER BY fecha_publicacion DESC";

$result = $conn->query($query);
$noticias = [];
$rutaWeb = "../uploads/";

while ($row = $result->fetch_assoc()) {
    if ($row['imagen']) {
        $row['imagen'] = $rutaWeb . $row['imagen'];
    }
    $noticias[] = $row;
}

echo json_encode(["success" => true, "noticias" => $noticias]);
?>