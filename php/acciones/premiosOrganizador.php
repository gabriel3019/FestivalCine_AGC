<?php
session_start();
header('Content-Type: application/json');
require "../BBDD/conecta.php";

// Comprobar sesión (CORREGIDO)
if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['tipo'] !== 'organizador') {
    echo json_encode([
        "success" => false,
        "message" => "No autorizado"
    ]);
    exit;
}


$action = $_POST['action'] ?? '';

try {

    switch ($action) {

        /* ===================== */
        /* LISTAR PREMIOS */
        /* ===================== */
        case "listar":
            $premios = [];
            $res = $conn->query("SELECT * FROM premios ORDER BY id_premio");
            while ($row = $res->fetch_assoc()) {
                $premios[] = $row;
            }
            echo json_encode(["success" => true, "premios" => $premios]);
            break;

        /* ===================== */
        /* AÑADIR PREMIO */
        /* ===================== */
        case "anadir_premio":
            $stmt = $conn->prepare(
                "INSERT INTO premios (nombre_premio, categoria, descripcion)
                 VALUES (?, ?, ?)"
            );
            $stmt->bind_param(
                "sss",
                $_POST['nombre_premio'],
                $_POST['categoria'],
                $_POST['descripcion']
            );
            $stmt->execute();
            echo json_encode(["success" => true]);
            break;

        /* ===================== */
        /* EDITAR PREMIO */
        /* ===================== */
        case "editar_premio":
            $stmt = $conn->prepare(
                "UPDATE premios SET nombre_premio=?, categoria=?, descripcion=?
                 WHERE id_premio=?"
            );
            $stmt->bind_param(
                "sssi",
                $_POST['nombre_premio'],
                $_POST['categoria'],
                $_POST['descripcion'],
                $_POST['id_premio']
            );
            $stmt->execute();
            echo json_encode(["success" => true]);
            break;

        /* ===================== */
        /* BORRAR PREMIO */
        /* ===================== */
        case "borrar_premio":
            $stmt = $conn->prepare("DELETE FROM premios WHERE id_premio=?");
            $stmt->bind_param("i", $_POST['id_premio']);
            $stmt->execute();
            echo json_encode(["success" => true]);
            break;

        /* ===================== */
        /* LISTAR CANDIDATOS */
        /* ===================== */
        case "listar_candidatos":
            $stmt = $conn->prepare("
                SELECT u.nombre, u.apellidos, u.numero_expediente,
                       c.id_corto, c.titulo
                FROM cortometrajes c
                JOIN usuarios u ON u.id_usuario = c.id_usuario
                WHERE c.categoria = ?
            ");
            $stmt->bind_param("s", $_POST['categoria']);
            $stmt->execute();

            $res = $stmt->get_result();
            $candidatos = [];
            while ($row = $res->fetch_assoc()) {
                $candidatos[] = $row;
            }

            echo json_encode(["success" => true, "candidatos" => $candidatos]);
            break;

        /* ===================== */
        /* ASIGNAR GANADOR */
        /* ===================== */
        case "asignar_ganador":
            $stmt = $conn->prepare("
                INSERT INTO premios_otorgados
                (id_premio, id_corto, id_gala, fecha_otorgado)
                VALUES (?, ?, ?, CURDATE())
            ");
            $stmt->bind_param(
                "iii",
                $_POST['id_premio'],
                $_POST['id_corto'],
                $_POST['id_gala']
            );
            $stmt->execute();
            echo json_encode(["success" => true]);
            break;

        default:
            echo json_encode(["success" => false, "message" => "Acción no válida"]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
