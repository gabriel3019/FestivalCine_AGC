<?php
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
header('Content-Type: application/json');

session_start();
require "../BBDD/conecta.php";

if (!isset($_SESSION['id_organizador'])) {
    $_SESSION['id_organizador'] = 2; // ID de organizador de prueba
}

$idOrganizador = $_SESSION['id_organizador'];

$action = $_POST['action'] ?? '';
try {
    switch ($action) {

        case "listar":
            $result = $conn->query(
                "SELECT id_evento, nombre, descripcion, fecha, lugar, tipo_evento
         FROM eventos 
         ORDER BY fecha DESC"
            );

            $eventos = [];
            while ($row = $result->fetch_assoc()) {
                $eventos[] = $row;
            }

            echo json_encode([
                "success" => true,
                "eventos" => $eventos
            ]);
            break;

        case "anadir":
            $nombre = $_POST['nombre'] ?? '';
            $descripcion = $_POST['descripcion'] ?? '';
            $fecha = $_POST['fecha'] ?? '';
            $lugar = $_POST['lugar'] ?? '';
            $tipo_evento = $_POST['tipo_evento'] ?? '';

            if ($idOrganizador === 0) {
                echo json_encode([
                    "success" => false,
                    "message" => "Organizador no válido"
                ]);
                exit;
            }

            // Validar fecha
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
                $fecha = date('Y-m-d'); // fecha actual si no es válida
            }

            $stmt = $conn->prepare(
                "INSERT INTO eventos (id_organizador, nombre, descripcion, fecha, lugar, tipo_evento) 
         VALUES (?, ?, ?, ?, ?, ?)"
            );

            if (!$stmt) {
                echo json_encode([
                    "success" => false,
                    "message" => $conn->error
                ]);
                exit;
            }

            $stmt->bind_param("isssss", $idOrganizador, $nombre, $descripcion, $fecha, $lugar, $tipo_evento);

            if ($stmt->execute()) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => $stmt->error
                ]);
            }
            break;

        case "editar":
            $id =  $_POST['id'] ?? 0;
            $nombre = $_POST['nombre'] ?? '';
            $descripcion = $_POST['descripcion'] ?? '';
            $fecha = $_POST['fecha'] ?? '';
            $lugar = $_POST['lugar'] ?? '';
            $tipo_evento = $_POST['tipo_evento'] ?? '';

            if ($id === 0) {
                throw new Exception("ID inválido");
            }

            $stmt = $conn->prepare(
                "UPDATE eventos 
             SET nombre=?, descripcion=?, fecha=?, lugar=?, tipo_evento=?
             WHERE id_evento=?"
            );

            $stmt->bind_param("sssssi", $nombre, $descripcion, $fecha, $lugar, $tipo_evento, $id);
            $stmt->execute();

            echo json_encode(["success" => true]);
            break;

        case "borrar":
            $id = $_POST['id'] ?? 0;

            if ($id === 0) {
                throw new Exception("ID inválido");
            }

            $stmt = $conn->prepare("DELETE FROM galas WHERE id_evento=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();


            $stmt = $conn->prepare(
                "DELETE FROM eventos WHERE id_evento=?"
            );
            $stmt->bind_param("i", $id);

            $stmt->execute();

            echo json_encode(["success" => $stmt->execute()]);
            break;

        default:
            echo json_encode([
                "success" => false,
                "message" => "Acción no válida"
            ]);
    }
} catch (Throwable $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
