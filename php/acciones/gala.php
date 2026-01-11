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
if (isset($_POST['funcion']) && $_POST['funcion'] == 'cargarSecciones') {
    cargarSecciones();
}
if (isset($_POST['funcion']) && $_POST['funcion'] == 'editarSeccion') {
    editarSeccion();
}
if (isset($_POST['funcion']) && $_POST['funcion'] == 'borrarSeccion') {
    borrarSeccion();
}
if (isset($_POST['funcion']) && $_POST['funcion'] == 'nuevaSeccion') {
    nuevaSeccion();
}


//Parte pre de la gala
function cargarSecciones()
{
    global $conexion;
    $sql = "SELECT id, nombre, hora, lugar FROM secciones";
    $resultado = $conexion->query($sql) or die("Error al comprobar los datos");

    $secciones = [];
    while ($fila = $resultado->fetch_assoc()) {
        $secciones[] = $fila;
    }

    //Devuelvo la lista con todos los alumnos de la base al js
    echo json_encode($secciones);
}

function editarSeccion()
{
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $hora = $_POST['hora'];
    $lugar = $_POST['lugar'];

    global $conexion;
    $sql = "UPDATE secciones SET nombre = '$nombre', hora = '$hora', lugar = '$lugar' WHERE id = '$id'";
    $resultado = $conexion->query($sql) or die("Error al editar los datos");
}

function borrarSeccion()
{
    $id = $_POST['id'];

    global $conexion;
    $sql = "DELETE FROM secciones WHERE id = '$id'";
    $resultado = $conexion->query($sql) or die("Error al borrar los datos");

    echo $resultado;
}

function nuevaSeccion()
{
    $nombre = $_POST['nombre'];
    $hora = $_POST['hora'];
    $lugar = $_POST['lugar'];

    global $conexion;
    $sql = "INSERT INTO secciones (nombre, hora, lugar) VALUES ('$nombre', '$hora', '$lugar')";
    $resultado = $conexion->query($sql) or die("Error al crear nueva sección");

    echo $resultado;
}

// Parte pos de la gala
function listarGanadoresGala()
{
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

function nuevoResumen()
{
    global $conexion;

    $resumen = $_POST['resumen'];

    $sql = "INSERT INTO galas (descripcion) VALUES ($resumen)";
    $conexion->query($sql) or die("Error al comprobar los datos");
}
