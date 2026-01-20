<?php
ob_start(); // limpia cualquier salida previa
header('Content-Type: application/json');
require "../BBDD/conecta.php";

$nombre    = $_POST['nombre'] ?? '';
$apellidos = $_POST['apellidos'] ?? '';
$email     = $_POST['email'] ?? '';
$password  = $_POST['password'] ?? '';
$rol       = $_POST['rol'] ?? '';

/* Validación de campos */
if (!$nombre || !$apellidos || !$email || !$password || !$rol) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios"]);
    exit;
}

/* Solo alumno o alumni */
if ($rol !== "usuario" && $rol !== "alumni") {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Rol no válido"]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

/* ---------- REGISTRO USUARIO ---------- */
$check = $conn->prepare("SELECT id_usuario FROM usuarios WHERE correo = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    $check->close();
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "El correo ya está registrado"]);
    exit;
}
$check->close();

$fecha = date('Y-m-d');
$stmt = $conn->prepare(
    "INSERT INTO usuarios (nombre, apellidos, correo, contrasena, rol, fecha_registro)
     VALUES (?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("ssssss", $nombre, $apellidos, $email, $hashedPassword, $rol, $fecha);

/* ---------- EJECUTAR ---------- */
if (!$stmt->execute()) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Error al registrar usuario"]);
    exit;
}

$id_usuario = $conn->insert_id;

if (empty($_FILES['video']) || $_FILES['video']['error'] !== 0) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Debes subir un vídeo"]);
    exit;
}

$nombreOriginal = $_FILES['video']['name'];
$tmp = $_FILES['video']['tmp_name'];
$extension = pathinfo($nombreOriginal, PATHINFO_EXTENSION);

// Crear nombre único y rutas
$nombreFinal = uniqid("video_") . "." . $extension;
$rutaServidor = "../../css/videos/" . $nombreFinal;
$rutaBD = "css/videos/" . $nombreFinal;

// Mover archivo
if (!move_uploaded_file($tmp, $rutaServidor)) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Error al subir el vídeo"]);
    exit;
}

/* ---------- DATOS CORTOMETRAJE ---------- */
$titulo = $_POST['titulo'] ?? 'Sin título';
$descripcion = $_POST['descripcion'] ?? '';
$duracion = 0;
$categoria = 'general';
$estado = 'pendiente';
$archivo_video = $rutaBD;
$fechaSubida = date('Y-m-d H:i:s');

/* ---------- INSERT CORTOMETRAJE ---------- */
$stmtVideo = $conn->prepare(
    "INSERT INTO cortometrajes 
    (id_usuario, titulo, descripcion, archivo_video, duracion, categoria, estado, fecha_subida) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmtVideo->bind_param("isssisss", $id_usuario, $titulo, $descripcion, $archivo_video, $duracion, $categoria, $estado, $fechaSubida);

if (!$stmtVideo->execute()) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Error al guardar el cortometraje"]);
    exit;
}

$stmtVideo->close();


$stmt->close();
$conn->close();

/* ---------- RESPUESTA FINAL ---------- */
ob_end_clean(); // limpia cualquier salida que haya quedado
echo json_encode([
    "success" => true,
    "message" => "Usuario y cortometraje registrados correctamente"
]);
exit;
