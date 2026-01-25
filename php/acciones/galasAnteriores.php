<?php

header('Content-Type: application/json');
require "../BBDD/conecta.php";

if (isset($_POST['funcion']) && $_POST['funcion'] === 'mostrarContenido') {
    mostrarContenido($conn);
}

function mostrarContenido($conn)
{
    global $conn;
    $sql = "SELECT nombre, resumen, imagen FROM galasAnteriores";
    $resultado = $conn->query($sql);

    $galas = [];

    while ($fila = $resultado->fetch_assoc()) {
        $galas[] = $fila;
    }

    echo json_encode($galas);
}
