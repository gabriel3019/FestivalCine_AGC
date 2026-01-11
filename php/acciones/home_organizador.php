<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");

require "../BBDD/conecta.php";

$data = [];

//Noticias
$r = $conn->query("SELECT * FROM noticias");
while ($f = $r->fetch_assoc()) $data["noticias"][] = $f;


//Eventos
$r = $conn->query("SELECT * FROM eventos");
while ($f = $r->fetch_assoc()) $data["eventos"][] = $f;


//Premios
$r = $conn->query("SELECT * FROM premios");
while ($f = $r->fetch_assoc()) $data["premios"][] = $f;


//Patrocinadores
$r = $conn->query("SELECT * FROM patrocinadores");
while ($f = $r->fetch_assoc()) $data["patrocinadores"][] = $f;


//Gala
$r = $conn->query("SELECT * FROM galas");
while ($f = $r->fetch_assoc()) $data["galas"][] = $f;


echo json_encode($data, JSON_UNESCAPED_UNICODE);

$conn->close();

?>