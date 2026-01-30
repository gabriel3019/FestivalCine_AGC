<?php
session_start();
require "../BBDD/conecta.php";
header("Content-Type: application/json");

if (!isset($_SESSION['usuario'])) {
    echo json_encode(["success" => false]);
    exit;
}

$id = $_SESSION['usuario']['id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $stmt = $conn->prepare("
        SELECT nombre, apellidos, telefono, correo, numero_expediente
        FROM usuarios
        WHERE id_usuario=?
    ");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $data = $stmt->get_result()->fetch_assoc();

    echo json_encode(["success" => true, "usuario" => $data]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $conn->begin_transaction();

    try {
        $stmt = $conn->prepare("
            UPDATE usuarios
            SET nombre=?, apellidos=?, telefono=?, correo=?
            WHERE id_usuario=?

        ");
        $stmt->bind_param(
            "sssssi",
            $_POST['nombre'],
            $_POST['apellidos'],
            $_POST['telefono'],
            $_POST['correo'],
            $_POST['categoria'],
            $id
        );
        $stmt->execute();

        // Vídeo nuevo (opcional)
        if (!empty($_FILES['video']['name'])) {
            $name = $_FILES['video']['name'];
            move_uploaded_file(
                $_FILES['video']['tmp_name'],
                "../../videos/" . $name
            );

            $stmt = $conn->prepare(
                "UPDATE candidaturas SET archivo_video=? WHERE id_usuario=?"
            );
            $stmt->bind_param("si", $name, $id);
            $stmt->execute();
        }

        $conn->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["success" => false]);
    }
}
