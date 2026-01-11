<?php
session_start();
header('Content-Type: application/json');
require "../BBDD/conecta.php";

// Comprobar sesión
if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] !== 'organizador') {
    echo json_encode(["success" => false, "message" => "No autorizado"]);
    exit;
}

$action = $_POST['action'] ?? '';

try {
    switch ($action) {

        // ------------------ LISTAR PREMIOS ------------------
        case "listar":
            $premios = [];
            $res = $conn->query("SELECT * FROM premios ORDER BY id_premio ASC");
            while ($row = $res->fetch_assoc()) {

                // Traer ganadores de este premio
                $ganadores = [];
                $stmt = $conn->prepare("
                    SELECT po.id_premio_otorgado, c.titulo AS cortometraje, g.nombre AS gala
                    FROM premios_otorgados po
                    INNER JOIN cortometrajes c ON c.id_corto = po.id_corto
                    INNER JOIN galas g ON g.id_gala = po.id_gala
                    WHERE po.id_premio = ?
                ");
                $stmt->bind_param("i", $row['id_premio']);
                $stmt->execute();
                $resultado = $stmt->get_result();
                while ($g = $resultado->fetch_assoc()) {
                    $ganadores[] = $g;
                }

                $premios[] = [
                    "id_premio" => $row['id_premio'],
                    "nombre_premio" => $row['nombre_premio'],
                    "categoria" => $row['categoria'],
                    "descripcion" => $row['descripcion'],
                    "ganadores" => $ganadores
                ];
            }

            echo json_encode(["success" => true, "premios" => $premios]);
            break;

        // ------------------ AÑADIR PREMIO ------------------
        case "anadir_premio":
            $nombre = $_POST['nombre_premio'] ?? '';
            $categoria = $_POST['categoria'] ?? '';
            $descripcion = $_POST['descripcion'] ?? '';
            if (!$nombre) throw new Exception("Nombre de premio requerido");

            $stmt = $conn->prepare("INSERT INTO premios (nombre_premio, categoria, descripcion) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $nombre, $categoria, $descripcion);
            if ($stmt->execute()) echo json_encode(["success" => true, "id_premio" => $stmt->insert_id]);
            else throw new Exception($stmt->error);
            break;

        // ------------------ EDITAR PREMIO ------------------
        case "editar_premio":
            $id = intval($_POST['id_premio'] ?? 0);
            $nombre = $_POST['nombre_premio'] ?? '';
            $categoria = $_POST['categoria'] ?? '';
            $descripcion = $_POST['descripcion'] ?? '';
            if (!$id || !$nombre) throw new Exception("Datos inválidos");

            $stmt = $conn->prepare("UPDATE premios SET nombre_premio = ?, categoria = ?, descripcion = ? WHERE id_premio = ?");
            $stmt->bind_param("sssi", $nombre, $categoria, $descripcion, $id);
            if ($stmt->execute()) echo json_encode(["success" => true]);
            else throw new Exception($stmt->error);
            break;

        // ------------------ ELIMINAR PREMIO ------------------
        case "borrar_premio":
            $id = intval($_POST['id_premio'] ?? 0);
            if (!$id) throw new Exception("ID inválido");

            $stmt = $conn->prepare("DELETE FROM premios WHERE id_premio = ?");
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) echo json_encode(["success" => true]);
            else throw new Exception($stmt->error);
            break;

        // ------------------ ASIGNAR GANADOR ------------------
        case "asignar_ganador":
            $id_premio = intval($_POST['id_premio'] ?? 0);
            $id_corto = intval($_POST['id_corto'] ?? 0);
            $id_gala = intval($_POST['id_gala'] ?? 0);
            $fecha = $_POST['fecha_otorgado'] ?? date('Y-m-d');

            if (!$id_premio || !$id_corto || !$id_gala) throw new Exception("Datos incompletos");

            $stmt = $conn->prepare("
                INSERT INTO premios_otorgados (id_premio, id_corto, id_gala, fecha_otorgado)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->bind_param("iiis", $id_premio, $id_corto, $id_gala, $fecha);

            if ($stmt->execute()) echo json_encode(["success" => true]);
            else throw new Exception($stmt->error);
            break;

        default:
            echo json_encode(["success" => false, "message" => "Acción no reconocida"]);
            break;
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
