<?php 

ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require "../BBDD/conecta.php"; 
$data = [];

// Total cortos 
$result = $conn->query("SELECT COUNT(*) AS total_cortos FROM cortos");
$data['total_cortos'] = $result->fetch_assoc()['total_cortos'];

// Cortos pendientes 
$result = $conn->query("SELECT COUNT(*) AS cortos_pendientes FROM cortos WHERE estado='pendiente'");
$data['cortos_pendientes'] = $result->fetch_assoc()['cortos_pendientes'];

// Votos totales 
$result = $conn->query("SELECT COUNT(*) AS votos_totales FROM votos");
$data['votos_totales'] = $result->fetch_assoc()['votos_totales'];

// Participantes 
$result = $conn->query("SELECT COUNT(*) AS total_participantes FROM participantes");
$data['total_participantes'] = $result->fetch_assoc()['total_participantes'];


$result = $conn->query("SELECT descripcion FROM actividad ORDER BY fecha DESC LIMIT 5");
$actividad = [];
while ($row = $result->fetch_assoc()) {
    $actividad[] = $row['descripcion'];
}
$data['actividad_reciente'] = $actividad;
echo json_encode($data);
