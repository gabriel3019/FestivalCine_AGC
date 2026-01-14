<?php
header("Content-Type: application/json");
session_start();
$idOrganizador = $_SESSION['usuario']['id'];


require "../BBDD/conecta.php";

// Inicializamos arrays
$data = [
    "noticias" => [],
    "eventos" => [],
    "premios" => [],
    "patrocinadores" => [],
    "galas" => []
];

// NOTICIAS
$r = $conn->query("SELECT * FROM noticias");
while ($f = $r->fetch_assoc()) $data["noticias"][] = $f;

// EVENTOS
$r = $conn->query("SELECT * FROM eventos");
while ($f = $r->fetch_assoc()) $data["eventos"][] = $f;

// PREMIOS
$r = $conn->query("SELECT * FROM premios");
while ($f = $r->fetch_assoc()) $data["premios"][] = $f;

// PATROCINADORES
$r = $conn->query("SELECT * FROM patrocinadores");
while ($f = $r->fetch_assoc()) $data["patrocinadores"][] = $f;

// GALAS
$r = $conn->query("SELECT * FROM galas");
while ($f = $r->fetch_assoc()) $data["galas"][] = $f;

// Devolvemos JSON
echo json_encode($data, JSON_UNESCAPED_UNICODE);

$conn->close();
?>
