<?php
ob_start();
header('Content-Type: application/json');
require "../BBDD/conecta.php";

/* ===================== PASO 1: USUARIO ===================== */
$nombre = $_POST['nombre'] ?? '';
$apellidos = $_POST['apellidos'] ?? '';
$telefono = $_POST['telefono'] ?? null;
$correo = $_POST['correo'] ?? null;
$numero_expediente = $_POST['numero_expediente'] ?? '';
$password = $_POST['password'] ?? '';

if (!$nombre || !$apellidos || !$numero_expediente || !$password) {
    ob_end_clean();
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos obligatorios"
    ]);
    exit;
}

/* Comprobar correo duplicado (si existe) */
if ($correo) {
    $check = $conn->prepare("SELECT id_usuario FROM usuarios WHERE correo = ?");
    $check->bind_param("s", $correo);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        ob_end_clean();
        echo json_encode([
            "success" => false,
            "message" => "El correo ya está registrado"
        ]);
        exit;
    }
    $check->close();
}

/* Hash real de la contraseña */
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

/* Insertar usuario */
$stmt = $conn->prepare("
    INSERT INTO usuarios
    (nombre, apellidos, correo, telefono, numero_expediente, contrasena, fecha_registro)
    VALUES (?, ?, ?, ?, ?, ?, CURDATE())
");

$stmt->bind_param(
    "ssssss",
    $nombre,
    $apellidos,
    $correo,
    $telefono,
    $numero_expediente,
    $hashedPassword
);

if (!$stmt->execute()) {
    ob_end_clean();
    echo json_encode([
        "success" => false,
        "message" => "Error al crear el usuario"
    ]);
    exit;
}

$id_usuario = $conn->insert_id;
$stmt->close();

/* ===================== PASO 2: CORTOMETRAJE ===================== */
$categoria = $_POST['categoria'] ?? '';
$titulo = $_POST['titulo'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';


if (!in_array($categoria, ['alumno', 'alumni'])) {
    ob_end_clean();
    echo json_encode([
        "success" => false,
        "message" => "Categoría no válida"
    ]);
    exit;
}

/* Portada */
if (!isset($_FILES['portada']) || $_FILES['portada']['error'] !== 0) {
    ob_end_clean();
    echo json_encode([
        "success" => false,
        "message" => "Debes subir una imagen de portada"
    ]);
    exit;
}

$portadaNombre = uniqid("portada_") . "." . pathinfo($_FILES['portada']['name'], PATHINFO_EXTENSION);
$rutaPortadaServidor = "../../uploads/portadas/" . $portadaNombre;
$rutaPortadaBD = "uploads/portadas/" . $portadaNombre;

move_uploaded_file($_FILES['portada']['tmp_name'], $rutaPortadaServidor);

/* Vídeo */
if (!isset($_FILES['video']) || $_FILES['video']['error'] !== 0) {
    ob_end_clean();
    echo json_encode([
        "success" => false,
        "message" => "Debes subir el vídeo"
    ]);
    exit;
}

$videoNombre = uniqid("video_") . "." . pathinfo($_FILES['video']['name'], PATHINFO_EXTENSION);
$rutaVideoServidor = "../../uploads/videos/" . $videoNombre;
$rutaVideoBD = "uploads/videos/" . $videoNombre;

move_uploaded_file($_FILES['video']['tmp_name'], $rutaVideoServidor);

/* Insert cortometraje */
$stmt = $conn->prepare("
    INSERT INTO cortometrajes
    (id_usuario, titulo, descripcion, imagen_portada, archivo_video, categoria, estado, fecha_subida)
    VALUES (?, ?, ?, ?, ?, ?, 'pendiente', NOW())
");

$stmt->bind_param(
    "isssss",
    $id_usuario,
    $titulo,
    $descripcion,
    $rutaPortadaBD,
    $rutaVideoBD,
    $categoria
);

$stmt->execute();
$id_corto = $conn->insert_id;
$stmt->close();

/* ===================== PASO 3: CANDIDATURA ===================== */
if (!isset($_FILES['memoria_pdf']) || $_FILES['memoria_pdf']['error'] !== 0) {
    ob_end_clean();
    echo json_encode([
        "success" => false,
        "message" => "Debes subir la memoria en PDF"
    ]);
    exit;
}

$pdfNombre = uniqid("memoria_") . ".pdf";
$rutaPdfServidor = "../../uploads/memorias/" . $pdfNombre;
$rutaPdfBD = "uploads/memorias/" . $pdfNombre;

move_uploaded_file($_FILES['memoria_pdf']['tmp_name'], $rutaPdfServidor);

/* Insert candidatura */
$stmt = $conn->prepare("
    INSERT INTO candidaturas
    (id_corto, memoria_pdf, estado_candidatura, fecha_envio)
    VALUES (?, ?, 'pendiente', NOW())
");

$stmt->bind_param("is", $id_corto, $rutaPdfBD);
$stmt->execute();

$stmt->close();
$conn->close();

/* ===================== RESPUESTA FINAL ===================== */
ob_end_clean();
echo json_encode(["success" => true]);
exit;
