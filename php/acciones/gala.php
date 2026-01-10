<?php

header('Content-Type: application/json');
require "../BBDD/conecta.php";

//Conexion con la base de datos
$conexion = new mysqli("localhost", "root", "", "FestivalCine");
if ($conexion->connect_error) {
    die("Error de conexión");
}

// Utilizo isset para que se puedan llamar a las funciones de este php desde javascript
if (isset($_POST['funcion']) && $_POST['funcion'] == 'listarGala') {
    listarGala();
}


function listarGala(){
    global $conexion;
    $sql = "SELECT nombre, descripcion, fecha, lugar, imagen FROM `galas`";
    $resultado = $conexion->query($sql) or die("Error al comprobar los datos");

    $galas = [];
    while ($fila = $resultado->fetch_assoc()) {
        $galas[] = $fila;
    }

    //Devuelvo la lista con todos los alumnos de la base al js
    echo json_encode($galas);
}

//Parte pre de la gala

// Parte pos de la gala
function listarSeccionesPos()
{
    global $conexion;
    $sql = "SELECT ";
    $resultado = $conexion->query($sql) or die("Error al comprobar los datos");

    $secciones = [];
    while ($seccion = $resultado->fetch_assoc()) {
        $secciones[] = $seccion;
    }

    //Devuelvo una lista con todas las amenazas
    echo json_encode($secciones);
}
