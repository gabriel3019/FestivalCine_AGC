<?php
session_start();
require_once "../bbdd/conecta.php";
header("Content-Type: application/json");

if (!isset($_SESSION['usuario'])) {
    echo json_encode(["success" => false]);
    exit;
}

$id_usuario = $_SESSION['usuario']['id'];

$categoria = $_POST['categoria'] ?? '';
$titulo = $_POST['titulo'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';

if (!$categoria || !$titulo || !$descripcion || !isset($_FILES['video'])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

/* ================= SUBIR VIDEO ================= */
$video = $_FILES['video'];
$nombreVideo = time() . "_" . basename($video['name']);
$ruta = "../../videos/" . $nombreVideo;

if (!move_uploaded_file($video['tmp_name'], $ruta)) {
    echo json_encode(["success" => false, "message" => "Error al subir el vídeo"]);
    exit;
}

/* ================= INSERTAR ================= */
$sql = "INSERT INTO candidaturas 
        (id_usuario, categoria, titulo, descripcion, archivo_video, fecha_creacion)
        VALUES (?, ?, ?, ?, ?, NOW())";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "issss",
    $id_usuario,
    $categoria,
    $titulo,
    $descripcion,
    $nombreVideo
);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al guardar candidatura"]);
}
