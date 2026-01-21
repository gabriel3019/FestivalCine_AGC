<?php
header('Content-Type: application/json');

// Configuración
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "festivalcine";

// Crear conexión
$conn = new mysqli($servername, $username, $password);

if ($conn->connect_error) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error de conexión con la base de datos'
    ]);
    exit;
}

// Seleccionar base de datos
$conn->select_db($dbname);
