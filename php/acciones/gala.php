<?php

header('Content-Type: application/json');
require "../BBDD/conecta.php";

//Conexion con la base de datos
$conexion = new mysqli("localhost", "root", "", "FestivalCine");
if ($conexion->connect_error) {
    die("Error de conexión");
}

// Utilizo isset para que se puedan llamar a las funciones de este php desde javascript
if (isset($_POST['funcion']) && $_POST['funcion'] == 'listarGanadoresGala') {
    listarGanadoresGala();
}
if (isset($_POST['funcion']) && $_POST['funcion'] == 'nuevoResumen') {
    nuevoResumen();
}


//Parte pre de la gala



// Parte pos de la gala
function listarGanadoresGala(){
    global $conexion;
    $sql = "SELECT id_premio_otorgado, id_premio, id_corto, id_gala, fecha_otorgado FROM premios_otorgados";
    $resultado = $conexion->query($sql) or die("Error al comprobar los datos");

    $ganadores = [];
    while ($fila = $resultado->fetch_assoc()) {
        $ganadores[] = $fila;
    }

    //Devuelvo la lista con todos los alumnos de la base al js
    echo json_encode($ganadores);
}

function nuevoResumen(){
    global $conexion;

    $resumen = $_POST['resumen'];

    $sql = "INSERT INTO galas (descripcion) VALUES ($resumen)";
    $conexion->query($sql) or die("Error al comprobar los datos");
}
