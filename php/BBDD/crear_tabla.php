<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Crear BBDD Festival Cine</title>
</head>
<body>

<?php
$servidor = "localhost";
$usuario = "root";
$password = "";
$db = "FestivalCine";

// Conectar sin seleccionar base de datos
$conexion = new mysqli($servidor, $usuario, $password);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

// Crear base de datos si no existe
$sqlDB = "CREATE DATABASE IF NOT EXISTS $db";
if ($conexion->query($sqlDB) === TRUE) {
    echo "<p>Base de datos '$db' lista.</p>";
} else {
    die("<p>Error creando la base de datos: " . $conexion->error . "</p>");
}

// Seleccionar la base de datos
$conexion->select_db($db);

// Comprobar si la tabla 'usuarios' ya existe
$comprobar_tabla = "SHOW TABLES LIKE 'usuarios'";
$comprobar = $conexion->query($comprobar_tabla);

if ($comprobar->num_rows <= 0) {

    $sql = "
    CREATE TABLE usuarios (
        id_usuario INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        correo VARCHAR(100) NOT NULL UNIQUE,
        contrasena VARCHAR(255) NOT NULL,
        rol ENUM('usuario','organizador') NOT NULL,
        fecha_registro DATE NOT NULL
    );

    CREATE TABLE organizador (
        id_organizador INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL
    );

    CREATE TABLE eventos (
        id_evento INT AUTO_INCREMENT PRIMARY KEY,
        id_organizador INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        fecha DATE NOT NULL,
        lugar VARCHAR(100),
        tipo_evento VARCHAR(50),
        FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador)
    );

    CREATE TABLE galas (
        id_gala INT AUTO_INCREMENT PRIMARY KEY,
        id_evento INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        fecha DATE NOT NULL,
        lugar VARCHAR(100),
        imagen VARCHAR(255),
        FOREIGN KEY (id_evento) REFERENCES eventos(id_evento)
    );

    CREATE TABLE cortometrajes (
        id_corto INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        titulo VARCHAR(100) NOT NULL,
        descripcion TEXT,
        archivo_video VARCHAR(255),
        duracion INT,
        categoria VARCHAR(50),
        estado VARCHAR(50),
        fecha_subida DATE,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    );

    CREATE TABLE premios (
        id_premio INT AUTO_INCREMENT PRIMARY KEY,
        nombre_premio VARCHAR(100) NOT NULL,
        descripcion TEXT,
        categoria VARCHAR(50)
    );

    CREATE TABLE candidaturas (
        id_candidatura INT AUTO_INCREMENT PRIMARY KEY,
        id_corto INT NOT NULL,
        id_premio INT NOT NULL,
        estado_candidatura VARCHAR(50),
        FOREIGN KEY (id_corto) REFERENCES cortometrajes(id_corto),
        FOREIGN KEY (id_premio) REFERENCES premios(id_premio)
    );

    CREATE TABLE premios_otorgados (
        id_premio_otorgado INT AUTO_INCREMENT PRIMARY KEY,
        id_premio INT NOT NULL,
        id_corto INT NOT NULL,
        id_gala INT NOT NULL,
        fecha_otorgado DATE,
        FOREIGN KEY (id_premio) REFERENCES premios(id_premio),
        FOREIGN KEY (id_corto) REFERENCES cortometrajes(id_corto),
        FOREIGN KEY (id_gala) REFERENCES galas(id_gala)
    );

    CREATE TABLE votos (
        id_voto INT AUTO_INCREMENT PRIMARY KEY,
        id_organizador INT NOT NULL,
        id_corto INT NOT NULL,
        puntuacion INT NOT NULL,
        fecha_voto DATE,
        FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador),
        FOREIGN KEY (id_corto) REFERENCES cortometrajes(id_corto)
    );

    CREATE TABLE noticias (
        id_noticia INT AUTO_INCREMENT PRIMARY KEY,
        id_organizador INT NOT NULL,
        titulo VARCHAR(150) NOT NULL,
        contenido TEXT,
        fecha_publicacion DATE,
        FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador)
    );
    ";

    if ($conexion->multi_query($sql)) {
        do {
            // Limpiar resultados para la siguiente consulta
        } while ($conexion->more_results() && $conexion->next_result());
        echo "<p>Tablas creadas correctamente.</p>";
    } else {
        echo "<p>Error al crear las tablas: {$conexion->error}</p>";
    }
} else {
    echo "<p>La tabla 'usuarios' ya existe.</p>";
}

$conexion->close();
?>

</body>
</html>
