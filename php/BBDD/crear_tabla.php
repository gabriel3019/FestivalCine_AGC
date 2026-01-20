<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Crear BBDD Festival Cine</title>
</head>

<body>

    <?php
    $conexion = new mysqli("localhost", "root", "");
    if ($conexion->connect_error) {
        die("Error de conexión");
    }

    /* ================= CREAR DB ================= */
    $conexion->query("CREATE DATABASE IF NOT EXISTS FestivalCine");
    $conexion->select_db("FestivalCine");

    /* ================= HASH ================= */
    $hash = password_hash("1234", PASSWORD_DEFAULT);

    /* ================= TABLAS ================= */
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
    nombre VARCHAR(100) NOT NULL,
    logo VARCHAR(255) NOT NULL
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

CREATE TABLE ediciones_anteriores (
    id_edicion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_gala VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    lugar VARCHAR(100),
    imagen VARCHAR(255),
    nombre_evento VARCHAR(100),
    fecha_archivo DATETIME DEFAULT CURRENT_TIMESTAMP
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
    FOREIGN KEY (id_corto) REFERENCES cortometrajes(id_corto)
    ON DELETE CASCADE,
    FOREIGN KEY (id_premio) REFERENCES premios(id_premio)
    ON DELETE CASCADE
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

CREATE TABLE noticias (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
    id_organizador INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    imagen VARCHAR(255),
    estado ENUM('publicada','editada','eliminada') DEFAULT 'publicada',
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador)
    ON DELETE CASCADE
);

CREATE TABLE secciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    hora TIME,
    lugar VARCHAR(100)
    );
";

    $conexion->multi_query($sql);
    while ($conexion->more_results() && $conexion->next_result()) {
    }

    /* ================= DATOS DE PRUEBA ================= */
    $datos = "

INSERT INTO usuarios VALUES
(NULL,'Juan','Pérez','juan@mail.com','$hash','usuario',NOW()),
(NULL,'Ana','Gómez','ana@mail.com','$hash','alumni',NOW());

INSERT INTO organizador VALUES
(NULL,'Festival Cine Madrid','organizador@festival.com','$hash');

INSERT INTO eventos VALUES
(NULL,1,'Festival de Cine 2026','Evento principal','2026-06-15','Madrid','Festival');

INSERT INTO galas VALUES
(NULL,1,'Gala Inaugural','Inicio del festival','2026-06-15','Teatro Principal','gala.jpg');


INSERT INTO premios (nombre_premio, descripcion, categoria) VALUES
('Primer premio Mejor cortometraje UE', '600€ + premio patrocinador', 'Alumnos'),
('Segundo premio Mejor cortometraje UE', '300€', 'Alumnos'),
('Tercer premio Mejor cortometraje UE', '100€', 'Alumnos'),
('Primer premio Mejor cortometraje Alumni', '700€', 'Alumni'),
('Segundo premio Mejor cortometraje Alumni', '300€', 'Alumni'),
('Premio Honorífico', 'Reconocimiento sobre un profesional del sector audiovisual de gran trayectoria que será el padrino del concurso', 'Honorífico');

INSERT INTO noticias (id_organizador, titulo, contenido, imagen, estado, fecha_publicacion) VALUES
(1, 'Bienvenidos al Festival de Cine', 'Nos complace anunciar la apertura del Festival de Cine 2026. ¡Esperamos veros a todos allí!', 'noticia1.jpg', 'publicada', NOW()),
(1, 'Convocatoria de cortometrajes abierta', 'Invitamos a todos los cineastas a enviar sus cortometrajes para participar en nuestro festival. ¡No pierdas la oportunidad!', 'noticia2.jpg', 'publicada', NOW());
";

    $conexion->multi_query($datos);
    while ($conexion->more_results() && $conexion->next_result()) {
    }

    echo "<h3>BBDD creada correctamente</h3>";
    $conexion->close();
    ?>

</body>

</html>