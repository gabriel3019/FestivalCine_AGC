<?php
// ---------------------- CONEXIÓN ----------------------
// Asegúrate de requerir conecta.php antes si no lo haces aquí
if (!isset($conn)) {
    $conn = new mysqli("localhost", "root", "", "FestivalCine");
    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }
}

// ---------------------- CREACIÓN DE TABLAS ----------------------

$tablas = [

"usuarios" => "
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('usuario','alumni','organizador') NOT NULL,
    fecha_registro DATE NOT NULL
) ENGINE=InnoDB;",

"organizador" => "
CREATE TABLE IF NOT EXISTS organizador (
    id_organizador INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
) ENGINE=InnoDB;",

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

"secciones" => "
CREATE TABLE IF NOT EXISTS secciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    hora TIME,
    lugar VARCHAR(100)
) ENGINE=InnoDB;",

"premios" => "
CREATE TABLE IF NOT EXISTS premios (
    id_premio INT AUTO_INCREMENT PRIMARY KEY,
    nombre_premio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50)
) ENGINE=InnoDB;",

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

"cortometrajes" => "
CREATE TABLE IF NOT EXISTS cortometrajes (
    id_corto INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    archivo_video VARCHAR(255),
    duracion INT,
    categoria VARCHAR(50),
    estado VARCHAR(50),
    fecha_subida DATE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;",

"candidaturas" => "
CREATE TABLE IF NOT EXISTS candidaturas (
    id_candidatura INT AUTO_INCREMENT PRIMARY KEY,
    id_corto INT NOT NULL,
    id_premio INT NOT NULL,
    estado_candidatura VARCHAR(50),
    FOREIGN KEY (id_corto) REFERENCES cortometrajes(id_corto) ON DELETE CASCADE,
    FOREIGN KEY (id_premio) REFERENCES premios(id_premio) ON DELETE CASCADE
) ENGINE=InnoDB;",

"premios_otorgados" => "
CREATE TABLE IF NOT EXISTS premios_otorgados (
    id_premio_otorgado INT AUTO_INCREMENT PRIMARY KEY,
    id_premio INT NOT NULL,
    id_corto INT NOT NULL,
    id_gala INT NOT NULL,
    fecha_otorgado DATE,
    FOREIGN KEY (id_premio) REFERENCES premios(id_premio),
    FOREIGN KEY (id_corto) REFERENCES cortometrajes(id_corto),
    FOREIGN KEY (id_gala) REFERENCES galas(id_gala)
) ENGINE=InnoDB;"
];

// Ejecutar todas las queries de creación
foreach ($tablas as $tabla => $sql) {
    if (!$conn->query($sql)) {
        echo "Error creando tabla $tabla: " . $conn->error . "<br>";
    }
}

// ---------------------- DATOS INICIALES ----------------------
$hash = password_hash("1234", PASSWORD_DEFAULT);

// Usuarios
$res = $conn->query("SELECT COUNT(*) AS total FROM usuarios");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO usuarios (nombre, apellidos, correo, contrasena, rol, fecha_registro) VALUES
        ('Juan','Pérez','juan@mail.com','$hash','usuario',CURDATE()),
        ('Ana','Gómez','ana@mail.com','$hash','alumni',CURDATE())
    ");
}

// Organizadores
$res = $conn->query("SELECT COUNT(*) AS total FROM organizador");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO organizador (nombre, correo, contrasena) VALUES
        ('Festival Cine Madrid','organizador@festival.com','$hash')
    ");
}

// Eventos
$res = $conn->query("SELECT COUNT(*) AS total FROM eventos");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO eventos (id_organizador, nombre, descripcion, fecha, lugar, tipo_evento) VALUES
        (1,'Festival de Cine 2026','Evento principal','2026-06-15','Madrid','Festival')
    ");
}

// Galas
$res = $conn->query("SELECT COUNT(*) AS total FROM galas");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO galas (id_evento, nombre, descripcion, fecha, lugar, imagen) VALUES
        (1,'Gala Inaugural','Inicio del festival','2026-06-15','Teatro Principal','gala.jpg')
    ");
}

// Patrocinadores
$res = $conn->query("SELECT COUNT(*) AS total FROM patrocinadores");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO patrocinadores (nombre, logo) VALUES
        ('Patrocinador Principal','logo1.png'),
        ('Patrocinador Secundario','logo2.png')
    ");
}

// Secciones
$res = $conn->query("SELECT COUNT(*) AS total FROM secciones");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO secciones (nombre, hora, lugar) VALUES
        ('Apertura','18:00:00','Sala Principal'),
        ('Proyección','19:00:00','Sala 2')
    ");
}

// Premios
$res = $conn->query("SELECT COUNT(*) AS total FROM premios");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO premios (nombre_premio, descripcion, categoria) VALUES
        ('Primer premio Mejor cortometraje UE', '600€ + premio patrocinador', 'Alumnos'),
        ('Segundo premio Mejor cortometraje UE', '300€', 'Alumnos'),
        ('Tercer premio Mejor cortometraje UE', '100€', 'Alumnos'),
        ('Primer premio Mejor cortometraje Alumni', '700€', 'Alumni'),
        ('Segundo premio Mejor cortometraje Alumni', '300€', 'Alumni'),
        ('Premio Honorífico', 'Reconocimiento profesional', 'Honorífico')
    ");
}

// Noticias
$res = $conn->query("SELECT COUNT(*) AS total FROM noticias");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO noticias (id_organizador, titulo, contenido, imagen, estado, fecha_publicacion) VALUES
        (1,'Bienvenidos al Festival','Arranca el festival de cine','noticia1.jpg','publicada',NOW()),
        (1,'Convocatoria abierta','Envía tu cortometraje','noticia2.jpg','publicada',NOW())
    ");
}

// Cortometrajes
$res = $conn->query("SELECT COUNT(*) AS total FROM cortometrajes");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO cortometrajes (id_usuario, titulo, descripcion, duracion, categoria, estado, fecha_subida) VALUES
        (1,'Corto Demo','Cortometraje de ejemplo',12,'Ficción','enviado',CURDATE())
    ");
}

// Candidaturas
$res = $conn->query("SELECT COUNT(*) AS total FROM candidaturas");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO candidaturas (id_corto, id_premio, estado_candidatura) VALUES
        (1,1,'pendiente')
    ");
}

// Premios otorgados
$res = $conn->query("SELECT COUNT(*) AS total FROM premios_otorgados");
if ($res->fetch_assoc()['total'] == 0) {
    $conn->query("
        INSERT INTO premios_otorgados (id_premio, id_corto, id_gala, fecha_otorgado) VALUES
        (1,1,1,CURDATE())
    ");
}
