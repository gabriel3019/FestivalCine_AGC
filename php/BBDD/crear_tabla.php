<?php
// ---------------------- CONEXIÓN Y CREACIÓN DE BD ----------------------
if (!isset($conn)) {
    $conn = new mysqli("localhost", "root", "");

    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }

    $sqlCreate = "CREATE DATABASE IF NOT EXISTS festivalCine 
                  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    if (!$conn->query($sqlCreate)) {
        die("Error creando la base de datos: " . $conn->error);
    }

    $conn->select_db("festivalCine");
}

// ---------------------- CREACIÓN DE TABLAS ----------------------

$tablas = [

/* ===================== USUARIOS ===================== */
"usuarios" => "
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    numero_expediente VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro DATE NOT NULL
) ENGINE=InnoDB;",

/* ===================== ORGANIZADOR ===================== */
"organizador" => "
CREATE TABLE IF NOT EXISTS organizador (
    id_organizador INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
) ENGINE=InnoDB;",

/* ===================== EVENTOS ===================== */
"eventos" => "
CREATE TABLE IF NOT EXISTS eventos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_organizador INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    lugar VARCHAR(100),
    tipo_evento VARCHAR(50),
    FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador) ON DELETE CASCADE
) ENGINE=InnoDB;",

/* ===================== GALAS ===================== */
"galas" => "
CREATE TABLE IF NOT EXISTS galas (
    id_gala INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    lugar VARCHAR(100),
    imagen VARCHAR(255),
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE
) ENGINE=InnoDB;",

"patrocinadores" => "
CREATE TABLE IF NOT EXISTS patrocinadores (
    id_patrocinador INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    logo VARCHAR(255) NOT NULL
) ENGINE=InnoDB;",


/* ===================== PREMIOS ===================== */
"premios" => "
CREATE TABLE IF NOT EXISTS premios (
    id_premio INT AUTO_INCREMENT PRIMARY KEY,
    nombre_premio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria ENUM('alumno','alumni','honorifico') NOT NULL
) ENGINE=InnoDB;",

/* ===================== NOTICIAS ===================== */
"noticias" => "
CREATE TABLE IF NOT EXISTS noticias (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
    id_organizador INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    imagen VARCHAR(255),
    estado ENUM('publicada','editada','eliminada') DEFAULT 'publicada',
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador) ON DELETE CASCADE
) ENGINE=InnoDB;",

/* ===================== CORTOMETRAJES ===================== */
"cortometrajes" => "
CREATE TABLE IF NOT EXISTS cortometrajes (
    id_corto INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    imagen_portada VARCHAR(255) NOT NULL,
    archivo_video VARCHAR(255) NOT NULL,
    duracion INT,
    categoria ENUM('alumno','alumni') NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_subida DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;",

/* ===================== CANDIDATURAS ===================== */
"candidaturas" => "
CREATE TABLE IF NOT EXISTS candidaturas (
    id_candidatura INT AUTO_INCREMENT PRIMARY KEY,
    id_corto INT NOT NULL,
    id_premio INT NULL,
    memoria_pdf VARCHAR(255) NOT NULL,
    estado_candidatura VARCHAR(50) DEFAULT 'pendiente',
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_corto) REFERENCES cortometrajes(id_corto) ON DELETE CASCADE,
    FOREIGN KEY (id_premio) REFERENCES premios(id_premio) ON DELETE SET NULL
) ENGINE=InnoDB;",

"secciones" => "
CREATE TABLE IF NOT EXISTS secciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    hora TIME NOT NULL,
    lugar VARCHAR(100) NOT NULL
) ENGINE=InnoDB;",



];

// ---------------------- EJECUCIÓN ----------------------
foreach ($tablas as $tabla => $sql) {
    if (!$conn->query($sql)) {
        echo "Error creando tabla $tabla: " . $conn->error . "<br>";
    }
}

// ---------------------- DATOS INICIALES ----------------------
$hash = password_hash("1234", PASSWORD_DEFAULT);

/* ===================== USUARIOS ===================== */
$res = $conn->query("SELECT COUNT(*) AS total FROM usuarios");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO usuarios 
        (nombre, apellidos, correo, telefono, numero_expediente, contrasena, fecha_registro) VALUES
        ('Juan','Pérez','juan@mail.com','600111222','EXP001','$hash',CURDATE()),
        ('Ana','Gómez','ana@mail.com','600333444','EXP002','$hash',CURDATE())
    ");
}

/* ===================== ORGANIZADOR ===================== */
$res = $conn->query("SELECT COUNT(*) AS total FROM organizador");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO organizador (nombre, correo, contrasena) VALUES
        ('Festival Cine Madrid','organizador@festival.com','$hash')
    ");
}

/* ===================== EVENTOS ===================== */
$res = $conn->query("SELECT COUNT(*) AS total FROM eventos");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO eventos 
        (id_organizador, nombre, descripcion, fecha, lugar, tipo_evento) VALUES
        (1,'Festival de Cine 2026','Evento principal','2026-06-15','Madrid','Festival')
    ");
}

/* ===================== GALAS ===================== */
$res = $conn->query("SELECT COUNT(*) AS total FROM galas");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO galas 
        (id_evento, nombre, descripcion, fecha, lugar, imagen) VALUES
        (1,'Gala Inaugural','Inicio del festival','2026-06-15','Teatro Principal','gala.jpg')
    ");
}

/* ===================== PATROCINADORES ===================== */
$res = $conn->query("SELECT COUNT(*) AS total FROM patrocinadores");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO patrocinadores (nombre, logo) VALUES
        ('Patrocinador Principal','logo1.png'),
        ('Patrocinador Secundario','logo2.png')
    ");
}

/* ===================== SECCIONES ===================== */
$res = $conn->query("SELECT COUNT(*) AS total FROM secciones");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO secciones (nombre, hora, lugar) VALUES
        ('Apertura','18:00:00','Sala Principal'),
        ('Proyección','19:00:00','Sala 2')
    ");
}

/* ===================== PREMIOS ===================== */
$res = $conn->query("SELECT COUNT(*) AS total FROM premios");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO premios (nombre_premio, descripcion, categoria) VALUES
        ('Primer premio Mejor cortometraje Alumno','600€','alumno'),
        ('Segundo premio Mejor cortometraje Alumno','300€','alumno'),
        ('Primer premio Mejor cortometraje Alumni','700€','alumni'),
        ('Segundo premio Mejor cortometraje Alumni','300€','alumni'),
        ('Premio Honorífico','Reconocimiento profesional','honorifico')
    ");
}

/* ===================== NOTICIAS ===================== */
$res = $conn->query("SELECT COUNT(*) AS total FROM noticias");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO noticias 
        (id_organizador, titulo, contenido, imagen, estado, fecha_publicacion) VALUES
        (1,'Bienvenidos al Festival','Arranca el festival de cine','noticia1.jpg','publicada',NOW()),
        (1,'Convocatoria abierta','Envía tu cortometraje','noticia2.jpg','publicada',NOW())
    ");
}

/* ===================== CORTOMETRAJES ===================== */
$res = $conn->query("SELECT COUNT(*) AS total FROM cortometrajes");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO cortometrajes 
        (id_usuario, titulo, descripcion, imagen_portada, archivo_video, duracion, categoria, estado, fecha_subida) VALUES
        (1,'Corto Demo Alumno','Corto de ejemplo','portada1.jpg','video1.mp4',12,'alumno','pendiente',NOW()),
        (2,'Corto Demo Alumni','Otro ejemplo','portada2.jpg','video2.mp4',15,'alumni','pendiente',NOW())
    ");
}

/* ===================== CANDIDATURAS ===================== */
$res = $conn->query("SELECT COUNT(*) AS total FROM candidaturas");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO candidaturas 
        (id_corto, id_premio, memoria_pdf, estado_candidatura) VALUES
        (1,1,'memoria_corto1.pdf','pendiente'),
        (2,3,'memoria_corto2.pdf','pendiente')
    ");
}

