<?php
$servidor = "localhost";
$usuario = "root";
$password = "";
$db = "FestivalCine"; 

// Crear conexión
$conexion = new mysqli($servidor, $usuario, $password, $db);

// Comprobar conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
?>
