<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "FestivalCine";

/* Conectar al servidor */
$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die("Error conectando a MySQL");
}

/* Crear BBDD si no existe */
$conn->query("
    CREATE DATABASE IF NOT EXISTS $db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci
");

/* Seleccionar BBDD */
$conn->select_db($db);
