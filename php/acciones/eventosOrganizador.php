<?php
header('Content-Type: application/json');

session_start();
require "../BBDD/conecta.php";

$idOrganizador = $_SESSION['usuario']['id'];
$action = $_POST['action'] ?? '';

$root = dirname(__DIR__, 2);
$carpeta = $root . "/uploads/";

// Crear la carpeta si no existe
if (!file_exists($carpeta)) {
    mkdir($carpeta, 0777, true);
}

try {
    switch ($action) {

        case "listar":
            $result = $conn->query(
                "SELECT id_evento, nombre, descripcion, fecha, hora_inicio, hora_fin, lugar, tipo_evento, imagen,
            DATE_FORMAT(fecha, '%d %b %Y') as fecha_formateada,
            DATE_FORMAT(hora_inicio, '%H:%i') as hora_inicio_formateada,
            DATE_FORMAT(hora_fin, '%H:%i') as hora_fin_formateada
            FROM eventos 
            ORDER BY fecha ASC, hora_inicio ASC"
            );

            $eventos = [];
            $rutaWeb = "../uploads/";

            while ($row = $result->fetch_assoc()) {
                if ($row['imagen']) {
                    $row['imagen'] =  $rutaWeb . $row['imagen'];
                }
                $eventos[] = $row;
            }

            echo json_encode(["success" => true, "eventos" => $eventos]);
            break;

        case "anadir":
            $nombre = $_POST['nombre'] ?? '';
            $descripcion = $_POST['descripcion'] ?? '';
            $fecha = $_POST['fecha'] ?? '';
            $hora_inicio = $_POST['hora_inicio'] ?? '';
            $hora_fin = $_POST['hora_fin'] ?? '';
            $lugar = $_POST['lugar'] ?? '';
            $tipo_evento = $_POST['tipo_evento'] ?? '';


            $nombreArchivo = null;
            // Solo procesamos si realmente hay un archivo subido sin errores
            if (isset($_FILES["imagen"]) && $_FILES["imagen"]["error"] === UPLOAD_ERR_OK) {
                // Recomendación: Añade un timestamp al nombre para evitar duplicados
                $nombreArchivo = time() . "_" . basename($_FILES["imagen"]["name"]);
                $rutaCompleta = $carpeta . $nombreArchivo;

                if (!move_uploaded_file($_FILES["imagen"]["tmp_name"], $rutaCompleta)) {
                    // Error al mover el archivo
                    echo json_encode(["success" => false, "message" => "Error al guardar el archivo físico"]);
                    exit;
                }
            }

            $stmt = $conn->prepare("INSERT INTO eventos (id_organizador, nombre, descripcion, fecha, hora_inicio, hora_fin, lugar, tipo_evento, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("issssssss", $idOrganizador, $nombre, $descripcion, $fecha, $hora_inicio, $hora_fin, $lugar, $tipo_evento, $nombreArchivo);
            $stmt->execute();

            echo json_encode(["success" => $stmt->affected_rows > 0]);
            break;

        case "editar":
            $id = intval($_POST['id_evento'] ?? 0);
            $nombre = $_POST['nombre'] ?? '';
            $descripcion = $_POST['descripcion'] ?? '';
            $fecha = $_POST['fecha'] ?? '';
            $hora_inicio = $_POST['hora_inicio'] ?? '';
            $hora_fin = $_POST['hora_fin'] ?? '';
            $lugar = $_POST['lugar'] ?? '';
            $tipo_evento = $_POST['tipo_evento'] ?? '';

            // Si hay una nueva imagen
            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                $nombreArchivo = time() . "_" . basename($_FILES["imagen"]["name"]);
                $rutaCompleta = $carpeta . $nombreArchivo;

                // Movemos el archivo físico
                move_uploaded_file($_FILES["imagen"]["tmp_name"], $rutaCompleta);

                // Actualizamos incluyendo el nuevo nombre de la imagen
                $stmt = $conn->prepare("UPDATE eventos SET nombre=?, descripcion=?, fecha=?, hora_inicio=?, hora_fin=?, lugar=?, tipo_evento=?, imagen=? WHERE id_evento=?");
                $stmt->bind_param("ssssssssi", $nombre, $descripcion, $fecha, $hora_inicio, $hora_fin, $lugar, $tipo_evento, $nombreArchivo, $id);
            } else {
                // CORRECCIÓN: 7 strings ("s") para los campos y 1 entero ("i") para el ID = "sssssssi"
                $stmt = $conn->prepare("UPDATE eventos SET nombre=?, descripcion=?, fecha=?, hora_inicio=?, hora_fin=?, lugar=?, tipo_evento=? WHERE id_evento=?");
                $stmt->bind_param("sssssssi", $nombre, $descripcion, $fecha, $hora_inicio, $hora_fin, $lugar, $tipo_evento, $id);
            }

            $stmt->execute();
            echo json_encode(["success" => $stmt->affected_rows >= 0]); // >= 0 porque si no cambias nada, affected_rows es 0
            break;

        case "borrar":
            $id = intval($_POST['id_evento'] ?? 0);
            $stmt = $conn->prepare("DELETE FROM eventos WHERE id_evento=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            echo json_encode(["success" => $stmt->affected_rows > 0]);
            break;

        default:
            echo json_encode(["success" => false, "message" => "Acción no reconocida"]);
    }
} catch (Throwable $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
