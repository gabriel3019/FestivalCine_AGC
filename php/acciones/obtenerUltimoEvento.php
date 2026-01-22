<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "festivalCine");
if ($conn->connect_error) {
    die(json_encode(["error" => $conn->connect_error]));
}

$sql = "SELECT id_evento, nombre, descripcion, fecha, lugar 
        FROM eventos 
        ORDER BY fecha DESC 
        LIMIT 1";

$result = $conn->query($sql);

$evento = $result->fetch_assoc() ?: [];

echo json_encode($evento);
?>
