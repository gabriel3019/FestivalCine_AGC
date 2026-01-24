<?php
header('Content-Type: application/json');
require "../BBDD/conecta.php";

if (isset($_POST['funcion']) && $_POST['funcion'] === 'mostrarContenido') {
    mostrarContenido($conn);
}

function mostrarContenido($conn)
{
    $sql = "SELECT nombre, descripcion, fecha, imagen FROM galas";
    $resultado = $conn->query($sql);

    $galas = [];

    while ($fila = $resultado->fetch_assoc()) {
        $galas[] = [
            "nombre" => $fila["nombre"],
            "descripcion" => $fila["descripcion"],
            "fecha" => $fila["fecha"],
            "imagenes" => explode(",", $fila["imagen"])
        ];
    }

    echo json_encode($galas);
}