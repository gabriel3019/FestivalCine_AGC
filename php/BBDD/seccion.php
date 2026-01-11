<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "festivalcine";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$comprobar_tabla = "SHOW TABLES LIKE 'secciones'";
$comprobar = $conn->query($comprobar_tabla);

if ($comprobar->num_rows <= 0) {

    $sql = "
    CREATE TABLE secciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    hora TIME,
    lugar VARCHAR(100)
    );
    ";

    if ($conn->multi_query($sql)) {
        do {
            // Limpiar resultados para la siguiente consulta
        } while ($conn->more_results() && $conn->next_result());
        echo "<p>Tabla creada correctamente.</p>";
    } else {
        echo "<p>Error al crear las tablas: {$conn->error}</p>";
    }
} else {
    echo "<p>La tabla 'secciones' ya existe.</p>";
}

$conn->close();
