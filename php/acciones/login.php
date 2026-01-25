<?php
session_start();
header('Content-Type: application/json');
require "../BBDD/crear_tabla.php";
require "../BBDD/conecta.php";

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode([
        "success" => false,
        "message" => "Campos incompletos"
    ]);
    exit;
}

/* =====================================================
   1️⃣ INTENTAR LOGIN COMO USUARIO
===================================================== */
$stmt = $conn->prepare(
    "SELECT id_usuario, nombre, contrasena 
     FROM usuarios 
     WHERE correo = ?"
);
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 1) {
    $user = $res->fetch_assoc();

    if (!password_verify($password, $user['contrasena'])) {
        echo json_encode([
            "success" => false,
            "message" => "Contraseña incorrecta"
        ]);
        exit;
    }

    $_SESSION['usuario'] = [
        "id" => $user['id_usuario'],
        "nombre" => $user['nombre'],
        "tipo" => "usuario"
    ];

    echo json_encode([
        "success" => true,
        "tipo" => "usuario"
    ]);
    exit;
}

/* =====================================================
   2️⃣ INTENTAR LOGIN COMO ORGANIZADOR
===================================================== */
$stmt = $conn->prepare(
    "SELECT id_organizador, nombre, contrasena 
     FROM organizador 
     WHERE correo = ?"
);
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 1) {
    $org = $res->fetch_assoc();

    if (!password_verify($password, $org['contrasena'])) {
        echo json_encode([
            "success" => false,
            "message" => "Contraseña incorrecta"
        ]);
        exit;
    }

    $_SESSION['usuario'] = [
        "id" => $org['id_organizador'],
        "nombre" => $org['nombre'],
        "tipo" => "organizador"
    ];

    echo json_encode([
        "success" => true,
        "tipo" => "organizador"
    ]);
    exit;
}

/* =====================================================
   3️⃣ NO ENCONTRADO
===================================================== */
echo json_encode([
    "success" => false,
    "message" => "Usuario no encontrado"
]);
