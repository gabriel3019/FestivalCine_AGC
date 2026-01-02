<?php

$host = "localhost";
$user = "root";
$pass = "";
$db   = "festivalcine";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    // Si falla la conexión, devolvemos JSON y detenemos todo
    header('Content-Type: application/json');
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión con la base de datos"
    ]);
    exit;
}
