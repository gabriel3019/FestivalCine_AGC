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

        // ------------------ HASH DE CONTRASEÑAS ------------------
        $hashUsuario = password_hash("1234", PASSWORD_DEFAULT);
        $hashAlumni  = password_hash("1234", PASSWORD_DEFAULT);
        $hashOrganizador = password_hash("1234", PASSWORD_DEFAULT);

        // ------------------ SQL ------------------
        $sql = "
    CREATE TABLE usuarios (
        id_usuario INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        correo VARCHAR(100) NOT NULL UNIQUE,
        contrasena VARCHAR(255) NOT NULL,
        rol ENUM('usuario','alumni','organizador') NOT NULL,
        fecha_registro DATE NOT NULL
    );

    CREATE TABLE organizador (
        id_organizador INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(100) NOT NULL UNIQUE,
        contrasena VARCHAR(255) NOT NULL
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
        ON DELETE CASCADE
    );

    CREATE TABLE patrocinadores (
    id_patrocinador INT AUTO_INCREMENT PRIMARY KEY,
    logo VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL
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
        ON DELETE CASCADE
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
        ON DELETE CASCADE
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
        ON DELETE CASCADE
    );

    CREATE TABLE premios_otorgados (
        id_premio_otorgado INT AUTO_INCREMENT PRIMARY KEY,
        id_premio INT NOT NULL,
        id_corto INT NOT NULL,
        id_gala INT NOT NULL,
        fecha_otorgado DATE,
        FOREIGN KEY (id_premio) REFERENCES premios(id_premio)
        ON DELETE CASCADE,
        FOREIGN KEY (id_corto) REFERENCES cortometrajes(id_corto)
        ON DELETE CASCADE,
        FOREIGN KEY (id_gala) REFERENCES galas(id_gala)
        ON DELETE CASCADE
    );

    CREATE TABLE votos (
        id_voto INT AUTO_INCREMENT PRIMARY KEY,
        id_organizador INT NOT NULL,
        id_corto INT NOT NULL,
        puntuacion INT NOT NULL,
        fecha_voto DATE,
        FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador)
        ON DELETE CASCADE,
        FOREIGN KEY (id_corto) REFERENCES cortometrajes(id_corto)
        ON DELETE CASCADE
    );

    CREATE TABLE noticias (
        id_noticia INT AUTO_INCREMENT PRIMARY KEY,
        id_organizador INT NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        contenido TEXT NOT NULL,
        fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador)
        ON DELETE CASCADE 
    );
    "; // ON DELETE CASCADE -> Si borras al organizador se borran sus noticias

        if ($conexion->multi_query($sql)) {
            do {
            } while ($conexion->more_results() && $conexion->next_result());
            echo "<p>Tablas creadas correctamente.</p>";
        } else {
            echo "<p>Error al crear las tablas: {$conexion->error}</p>";
        }

        // ------------------ INSERTS ------------------
        $inserts = "
    INSERT INTO usuarios (nombre, apellidos, correo, contrasena, rol, fecha_registro) VALUES
    ('Juan', 'Pérez', 'juan@mail.com', '$hashUsuario', 'usuario', now()),
    ('Ana', 'Gómez', 'ana@mail.com', '$hashAlumni', 'alumni', now());

    INSERT INTO organizador (nombre, correo, contrasena) VALUES
    ('Festival Cine Madrid', 'organizador@festival.com', '$hashOrganizador');

    INSERT INTO eventos (id_organizador, nombre, descripcion, fecha, lugar, tipo_evento) VALUES
    (1, 'Festival de Cine 2026', 'Evento principal del festival', '2026-06-15', 'Madrid', 'Festival');

    INSERT INTO patrocinadores (nombre, logo) VALUES
    ( 'Canon', 'canon.png');

    INSERT INTO galas (id_evento, nombre, descripcion, fecha, lugar, imagen) VALUES
    (1, 'Gala Inaugural', 'Inicio del festival', '2026-06-15', 'Teatro Principal', 'gala1.jpg');

    INSERT INTO cortometrajes (id_usuario, titulo, descripcion, archivo_video, duracion, categoria, estado, fecha_subida) VALUES
    (1, 'La Última Escena', 'Drama intenso', 'ultima_escena.mp4', 15, 'Drama', 'Aceptado', now());

    INSERT INTO premios (nombre_premio, descripcion, categoria) VALUES
    ('Mejor Corto', 'Premio al mejor cortometraje', 'General');

    INSERT INTO candidaturas (id_corto, id_premio, estado_candidatura) VALUES
    (1, 1, 'Pendiente');

    INSERT INTO premios_otorgados (id_premio, id_corto, id_gala, fecha_otorgado) VALUES
    (1, 1, 1, now());

    INSERT INTO votos (id_organizador, id_corto, puntuacion, fecha_voto) VALUES
    (1, 1, 9, now());

    INSERT INTO noticias (id_organizador, titulo, contenido, fecha_publicacion) VALUES
    (1, 'Arranca el Festival de Cine 2026', 'Ya está todo preparado para el festival.', now());
    ";

        if ($conexion->multi_query($inserts)) {
            do {
            } while ($conexion->more_results() && $conexion->next_result());
            echo "<p>Datos insertados correctamente con contraseñas hasheadas.</p>";
        } else {
            echo "<p>Error al insertar los datos: {$conexion->error}</p>";
        }
    } else {
        echo "<p>La tabla 'usuarios' ya existe.</p>";
    }

    $conexion->close();
    ?>

</body>

</html>