<?php
header('Content-Type: application/json');
require "../BBDD/conecta.php";

// Consulta para obtener todos los eventos
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

if ($result) {
    $eventos = [];

    while ($row = $result->fetch_assoc()) {
        $eventos[] = [
            'id' => $row['id_evento'],
            'nombre' => $row['nombre'],
            'descripcion' => $row['descripcion'],
            'fecha' => $row['fecha'],
            'fecha_formateada' => $row['fecha_formateada'],
            'hora_inicio' => $row['hora_inicio'],
            'hora_inicio_formateada' => $row['hora_inicio_formateada'],
            'hora_fin' => $row['hora_fin'],
            'hora_fin_formateada' => $row['hora_fin_formateada'],
            'lugar' => $row['lugar'],
            'tipo_evento' => $row['tipo_evento'],
            'imagen' => $row['imagen'] ? '../img/' . $row['imagen'] : null
        ];
    }

    echo json_encode([
        'success' => true,
        'eventos' => $eventos,
        'total' => count($eventos)
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error en la consulta: ' . $conn->error,
        'eventos' => []
    ]);
}

$conn->close();
