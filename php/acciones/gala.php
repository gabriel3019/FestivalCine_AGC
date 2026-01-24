<?php

header('Content-Type: application/json');
require "../BBDD/conecta.php";



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
    global $conn;
    $sql = "SELECT id, nombre, hora, lugar FROM secciones";
    $resultado = $conn->query($sql) or die("Error al comprobar los datos");

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

    global $conn;
    $sql = "UPDATE secciones SET nombre = '$nombre', hora = '$hora', lugar = '$lugar' WHERE id = '$id'";
    $resultado = $conn->query($sql) or die("Error al editar los datos");
}

function borrarSeccion()
{
    $id = $_POST['id'];

    global $conn;
    $sql = "DELETE FROM secciones WHERE id = '$id'";
    $resultado = $conn->query($sql) or die("Error al borrar los datos");

    echo $resultado;
}

function nuevaSeccion()
{
    $nombre = $_POST['nombre'];
    $hora = $_POST['hora'];
    $lugar = $_POST['lugar'];

    global $conn;
    if ($nombre == "" || $hora == "" || $lugar == "") {
        echo json_encode([
            "status"=> "error",
            "message" => "Se deben rellenar todos los campos"
        ]);
        exit;
    } else {
        $sql = "INSERT INTO secciones (nombre, hora, lugar) VALUES ('$nombre', '$hora', '$lugar')";
        $resultado = $conn->query($sql) or die("Error al crear nueva sección");
        echo json_encode([
            "status"=> "error",
            "data" => $resultado
        ]);
        echo json_encode([
            "resultado"=> $resultado
        ]);
    }
}

// Parte pos de la gala
function listarGanadoresGala()
{
    global $conn;
    $sql = "SELECT id_premio_otorgado, id_premio, id_corto, id_gala, fecha_otorgado FROM premios_otorgados";
    $resultado = $conn->query($sql) or die("Error al comprobar los datos");

    $ganadores = [];
    while ($fila = $resultado->fetch_assoc()) {
        $ganadores[] = $fila;
    }

    //Devuelvo la lista con todos los alumnos de la base al js
    echo json_encode($ganadores);
}

function nuevoResumen()
{
    global $conn;

    $resumen = $_POST['resumen'];

    $sql = "INSERT INTO galas (descripcion) VALUES ($resumen)";
    $conn->query($sql) or die("Error al comprobar los datos");
}
