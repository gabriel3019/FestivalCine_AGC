<?php
header('Content-Type: application/json');
require "../BBDD/conecta.php"; 

$nombre    = $_POST['nombre'] ?? '';
$apellidos = $_POST['apellidos'] ?? '';
$email     = $_POST['email'] ?? '';
$password  = $_POST['password'] ?? '';
$rol       = $_POST['rol'] ?? '';

if (!$nombre || !$email || !$password || !$rol || ($rol != "organizador" && !$apellidos)) {
    echo json_encode(["success"=>false,"message"=>"Todos los campos son obligatorios"]);
    exit;
}


$hashedPassword = password_hash($password, PASSWORD_DEFAULT);


if ($rol === "usuario" || $rol === "alumni") {
    $check = $conn->prepare("SELECT id_usuario FROM usuarios WHERE correo = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        echo json_encode(["success"=>false,"message"=>"El correo ya está registrado"]);
        exit;
    }
    $check->close();

    $fecha = date('Y-m-d');
    $stmt = $conn->prepare(
        "INSERT INTO usuarios (nombre, apellidos, correo, contrasena, rol, fecha_registro)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("ssssss", $nombre, $apellidos, $email, $hashedPassword, $rol, $fecha);

} elseif ($rol === "organizador") {
    $check = $conn->prepare("SELECT id_organizador FROM organizador WHERE correo = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        echo json_encode(["success"=>false,"message"=>"El correo ya está registrado"]);
        exit;
    }
    $check->close();

    $stmt = $conn->prepare(
        "INSERT INTO organizador (nombre, correo, contrasena)
         VALUES (?, ?, ?)"
    );
    $stmt->bind_param("sss", $nombre, $email, $hashedPassword);

} else {
    echo json_encode(["success"=>false,"message"=>"Rol no válido"]);
    exit;
}

if ($stmt->execute()) {
    echo json_encode(["success"=>true]);
} else {
    echo json_encode(["success"=>false,"message"=>"Error al registrar usuario"]);
}

$stmt->close();
$conn->close();
