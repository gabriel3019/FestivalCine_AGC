<?php
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
header('Content-Type: application/json');

session_start();
require "../BBDD/conecta.php";

if (!isset($_SESSION['id_organizador'])) {
    $_SESSION['id_organizador'] = 1; // ID de organizador de prueba
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

            $idOrganizador = $_SESSION['id_organizador'] ?? 0;
            error_log("ID organizador en sesión: $idOrganizador");

            // Validar que el ID exista en la base de datos
            $stmtCheck = $conn->prepare("SELECT COUNT(*) FROM organizador WHERE id_organizador = ?");
            $stmtCheck->bind_param("i", $idOrganizador);
            $stmtCheck->execute();
            $stmtCheck->bind_result($count);
            $stmtCheck->fetch();
            $stmtCheck->close();

            if ($count == 0) {
                echo json_encode([
                    "success" => false,
                    "message" => "El organizador con ID $idOrganizador no existe en la base de datos."
                ]);
                exit;
            }

            $nombre = $_POST['nombre'] ?? '';
            $descripcion = $_POST['descripcion'] ?? '';
            $fecha = $_POST['fecha'] ?? '';
            $lugar = $_POST['lugar'] ?? '';
            $tipo_evento = $_POST['tipo_evento'] ?? '';

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
            $id =  intval($_POST['id'] ?? 0);
            $nombre = $_POST['nombre'] ?? '';
            $descripcion = $_POST['descripcion'] ?? '';
            $fecha = $_POST['fecha'] ?? '';
            $lugar = $_POST['lugar'] ?? '';
            $tipo_evento = $_POST['tipo_evento'] ?? '';

            if ($id <= 0) {
                throw new Exception("ID inválido");
            }

            $stmt = $conn->prepare(
                "UPDATE eventos 
             SET nombre=?, descripcion=?, fecha=?, lugar=?, tipo_evento=?
             WHERE id_evento=?"
            );

            $stmt->bind_param("sssssi", $nombre, $descripcion, $fecha, $lugar, $tipo_evento, $id);


            if ($stmt->execute()) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => $stmt->error
                ]);
            }
            break;

        case "borrar":
            $id = intval($_POST['id'] ?? 0);

            if ($id == 0) {
                echo json_encode([
                    "success" => false,
                    "message" => "ID no recibido"
                ]);
                exit;
            }

            $sql = "DELETE FROM eventos WHERE id_evento = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo json_encode([
                    "success" => true,
                    "message" => "Evento eliminado correctamente"
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "No se pudo eliminar el evento"
                ]);
            }
            exit;
    }
} catch (Throwable $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
