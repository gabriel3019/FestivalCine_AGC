<?php

$conn = new mysqli("localhost", "root", "");
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$hash = password_hash("1234", PASSWORD_DEFAULT);

$sql = "
CREATE DATABASE IF NOT EXISTS festivalCine
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE festivalCine;

/* ===================== TABLAS ===================== */

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    numero_expediente VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro DATE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS organizador (
    id_organizador INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS premios (
    id_premio INT AUTO_INCREMENT PRIMARY KEY,
    nombre_premio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    categoria ENUM('alumno','alumni','honorifico') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS patrocinadores (
    id_patrocinador INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    logo VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS secciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    hora TIME,
    lugar VARCHAR(100)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS eventos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_organizador INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    lugar VARCHAR(100),
    tipo_evento VARCHAR(50),
    imagen VARCHAR(255),
    FOREIGN KEY (id_organizador)
        REFERENCES organizador(id_organizador)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS galas (
    id_gala INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    lugar VARCHAR(100),
    imagen VARCHAR(255),
    estado VARCHAR(100),
    resumen VARCHAR(10000),
    FOREIGN KEY (id_evento)
        REFERENCES eventos(id_evento)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS galasAnteriores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    resumen TEXT,
    imagen VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS noticias (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
    id_organizador INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    imagen VARCHAR(255),
    estado ENUM('publicada','editada','eliminada') DEFAULT 'publicada',
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_organizador)
        REFERENCES organizador(id_organizador)
        ON DELETE CASCADE
) ENGINE=InnoDB;

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
    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS candidaturas (
    id_candidatura INT AUTO_INCREMENT PRIMARY KEY,
    id_corto INT NOT NULL,
    id_premio INT NULL,
    memoria_pdf VARCHAR(255) NOT NULL,
    estado_candidatura ENUM('pendiente','aceptada','rechazada') DEFAULT 'pendiente',
    motivo_rechazo TEXT NULL,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion DATETIME NULL,
    FOREIGN KEY (id_corto) REFERENCES cortometrajes(id_corto) ON DELETE CASCADE,
    FOREIGN KEY (id_premio) REFERENCES premios(id_premio) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS premios_otorgados (
    id_premio_otorgado INT AUTO_INCREMENT PRIMARY KEY,
    id_premio INT NOT NULL,
    id_corto INT NOT NULL,
    id_gala INT NOT NULL,
    fecha_otorgado DATE,
    FOREIGN KEY (id_premio) REFERENCES premios(id_premio),
    FOREIGN KEY (id_corto) REFERENCES cortometrajes(id_corto),
    FOREIGN KEY (id_gala) REFERENCES galas(id_gala)
) ENGINE=InnoDB;

/* ===================== INSERTS ===================== */

INSERT INTO usuarios
(nombre, apellidos, correo, telefono, numero_expediente, contrasena, fecha_registro)
SELECT 'Juan','Pérez','juan@mail.com','600111222','EXP001','$hash',CURDATE()
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE correo='juan@mail.com');

INSERT INTO usuarios
(nombre, apellidos, correo, telefono, numero_expediente, contrasena, fecha_registro)
SELECT 'Ana','Gómez','ana@mail.com','600333444','EXP002','$hash',CURDATE()
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE correo='ana@mail.com');

INSERT INTO organizador
(nombre, correo, contrasena)
SELECT 'Festival Cine Madrid','organizador@festival.com','$hash'
WHERE NOT EXISTS (SELECT 1 FROM organizador WHERE correo='organizador@festival.com');

INSERT INTO eventos
(id_organizador, nombre, descripcion, fecha, hora_inicio, hora_fin, lugar, tipo_evento, imagen)
SELECT 1,'Gala de Apertura Festival 2026',
'Alfombra roja y ceremonia de inauguración del festival.',
'2026-06-15','18:00:00','20:30:00',
'Palacio de la Prensa, Madrid','Gala','noticia_alumno.png'
WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE nombre='Gala de Apertura Festival 2026');

INSERT INTO eventos
(id_organizador, nombre, descripcion, fecha, hora_inicio, hora_fin, lugar, tipo_evento, imagen)
SELECT 1,'Proyección de Cortometrajes',
'Muestra de los mejores trabajos de los alumnos de este año.',
'2026-06-15','21:00:00','23:00:00',
'Cine Callao, Madrid','Proyección','noticias.avif'
WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE nombre='Proyección de Cortometrajes');

INSERT INTO galas
(id_evento, nombre, descripcion, fecha, lugar, imagen, estado, resumen)
SELECT 1,'Gala Inaugural',
'Inicio del festival en el campus de Villaviciosa',
'2026-06-15','Teatro Principal','gala.jpg','pre',
'La gala fue un éxito'
WHERE NOT EXISTS (SELECT 1 FROM galas WHERE nombre='Gala Inaugural');

INSERT INTO galasAnteriores
(nombre, resumen, imagen)
SELECT 'Gala 2023','Una noche inolvidable','gala2023.jpg'
WHERE NOT EXISTS (SELECT 1 FROM galasAnteriores WHERE nombre='Gala 2023');

INSERT INTO patrocinadores
(nombre, logo)
SELECT 'Patrocinador Principal','logo1.png'
WHERE NOT EXISTS (SELECT 1 FROM patrocinadores WHERE nombre='Patrocinador Principal');

INSERT INTO patrocinadores
(nombre, logo)
SELECT 'Patrocinador Secundario','logo2.png'
WHERE NOT EXISTS (SELECT 1 FROM patrocinadores WHERE nombre='Patrocinador Secundario');

INSERT INTO secciones
(nombre, hora, lugar)
SELECT 'Apertura','18:00:00','Sala Principal'
WHERE NOT EXISTS (SELECT 1 FROM secciones WHERE nombre='Apertura');

INSERT INTO secciones
(nombre, hora, lugar)
SELECT 'Proyección','19:00:00','Sala 2'
WHERE NOT EXISTS (SELECT 1 FROM secciones WHERE nombre='Proyección');

INSERT INTO premios
(nombre_premio, descripcion, categoria)
SELECT 'Primer premio Mejor cortometraje Alumno','600€','alumno'
WHERE NOT EXISTS (SELECT 1 FROM premios WHERE nombre_premio LIKE 'Primer premio%');

INSERT INTO premios
(nombre_premio, descripcion, categoria)
SELECT 'Segundo premio Mejor cortometraje Alumno','300€','alumno'
WHERE NOT EXISTS (SELECT 1 FROM premios WHERE nombre_premio LIKE 'Segundo premio%');

INSERT INTO premios
(nombre_premio, descripcion, categoria)
SELECT 'Primer premio Mejor cortometraje Alumni','700€','alumni'
WHERE NOT EXISTS (SELECT 1 FROM premios WHERE nombre_premio LIKE 'Primer premio Mejor cortometraje Alumni%');

INSERT INTO premios
(nombre_premio, descripcion, categoria)
SELECT 'Segundo premio Mejor cortometraje Alumni','300€','alumni'
WHERE NOT EXISTS (SELECT 1 FROM premios WHERE nombre_premio LIKE 'Segundo premio Mejor cortometraje Alumni%');

INSERT INTO premios
(nombre_premio, descripcion, categoria)
SELECT 'Premio Honorífico','Reconocimiento profesional','honorifico'
WHERE NOT EXISTS (SELECT 1 FROM premios WHERE nombre_premio LIKE 'Premio Honorífico%');

INSERT INTO noticias
(id_organizador, titulo, contenido, imagen, estado, fecha_publicacion)
SELECT 1,
'La Universidad Europea da la bienvenida a sus estudiantes',
'Organizado por la Oficina de Relaciones Internacionales',
'noticia_alumno.png','publicada',NOW()
WHERE NOT EXISTS (SELECT 1 FROM noticias WHERE titulo LIKE 'La Universidad Europea%');

INSERT INTO noticias
(id_organizador, titulo, contenido, imagen, estado, fecha_publicacion)
SELECT 1,
'La Escuela de Arquitectura celebra el Megajury',
'Jornada académica destacada',
'noticia_arquitectura.png','publicada',NOW()
WHERE NOT EXISTS (SELECT 1 FROM noticias WHERE titulo LIKE 'La Escuela de Arquitectura%');

INSERT INTO cortometrajes
(id_usuario, titulo, descripcion, imagen_portada, archivo_video, duracion, categoria, estado, fecha_subida)
SELECT 1,'Corto Demo Alumno','Corto de ejemplo',
'portada1.jpg','video1.mp4',12,'alumno','pendiente',NOW()
WHERE NOT EXISTS (SELECT 1 FROM cortometrajes WHERE titulo='Corto Demo Alumno');

INSERT INTO cortometrajes
(id_usuario, titulo, descripcion, imagen_portada, archivo_video, duracion, categoria, estado, fecha_subida)
SELECT 2,'Corto Demo Alumni','Otro ejemplo',
'portada2.jpg','video2.mp4',15,'alumni','pendiente',NOW()
WHERE NOT EXISTS (SELECT 1 FROM cortometrajes WHERE titulo='Corto Demo Alumni');

INSERT INTO candidaturas
(id_corto, id_premio, memoria_pdf, estado_candidatura, motivo_rechazo, fecha_envio, fecha_resolucion)
SELECT 1,1,'memoria_corto1.pdf','pendiente',NULL,NOW(),NULL
WHERE NOT EXISTS (SELECT 1 FROM candidaturas WHERE id_corto=1 AND id_premio=1);

INSERT INTO candidaturas
(id_corto, id_premio, memoria_pdf, estado_candidatura, motivo_rechazo, fecha_envio, fecha_resolucion)
SELECT 2,3,'memoria_corto2.pdf','pendiente',NULL,NOW(),NULL
WHERE NOT EXISTS (SELECT 1 FROM candidaturas WHERE id_corto=2 AND id_premio=3);

INSERT INTO premios_otorgados
(id_premio, id_corto, id_gala, fecha_otorgado)
SELECT 1,1,1,CURDATE()
WHERE NOT EXISTS (SELECT 1 FROM premios_otorgados WHERE id_premio=1 AND id_corto=1);
";

if (!$conn->multi_query($sql)) {
    die("Error en multi_query: " . $conn->error);
}

do {
    if ($res = $conn->store_result()) {
        $res->free();
    }
} while ($conn->next_result());

$conn->close();
