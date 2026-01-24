<?php
header('Content-Type: application/json');
require "../BBDD/conecta.php";

//Conexion con la base de datos
$conexion = new mysqli("localhost", "root", "", "FestivalCine");
if ($conexion->connect_error) {
    die("Error de conexión");
}

// Utilizo isset para que se puedan llamar a las funciones de este php desde javascript
if (isset($_POST['funcion']) && $_POST['funcion'] == 'mostrarContenido') {
    mostrarContenido();
}
if (isset($_POST['funcion']) && $_POST['funcion'] == 'nuevoResumen') {
    nuevoResumen();
}

function mostrarContenido()
{
    global $conexion;
    $sql = "SELECT * FROM galas";
    $resultado = $conexion->query($sql) or die("Error al comprobar los datos");

    $contenido = [];
    while ($fila = $resultado->fetch_assoc()) {
        $contenido[] = $fila;
    }

    //Devuelvo la lista con todos los alumnos de la base al js
    echo json_encode($contenido);
};

function mostrarImagenes()
{
    global $conexion;
    $sql = "SELECT imagenes FROM galas";
    $resultado = $conexion->query($sql) or die("Error al comprobar los datos");

    $imagenes = [];
    while ($fila = $resultado->fetch_assoc()) {
        $imagenes[] = $fila;
    }

    //Devuelvo la lista con todos los alumnos de la base al js
    echo json_encode($imagenes);
};
