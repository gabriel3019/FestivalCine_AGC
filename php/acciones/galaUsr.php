<?php
header('Content-Type: application/json');
require "../BBDD/conecta.php";

if (isset($_POST['funcion']) && $_POST['funcion'] === 'mostrarContenido') {
    mostrarContenido($conn);
}

function mostrarContenido($conn)
{
    $sql = "SELECT nombre, descripcion, fecha, imagen, resumen, estado FROM galas";
    $resultado = $conn->query($sql);

    $galas = [];

    while ($fila = $resultado->fetch_assoc()) {
        if ($fila["estado"] == "pre") {
            $texto = $fila["descripcion"];
        } else {
            $texto = $fila["resumen"];
        }


        $galas[] = [
            "nombre" => $fila["nombre"],
            "fecha" => $fila["fecha"],
            "texto" => $texto,
            "imagenes" => explode(",", $fila["imagen"])
        ];
    }

    echo json_encode($galas);
}