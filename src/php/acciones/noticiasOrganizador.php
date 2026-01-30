<?php
header('Content-Type: application/json');
session_start();
require "../BBDD/conecta.php";

$idOrganizador = $_SESSION['usuario']['id'] ?? 0;
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
                "SELECT id_noticia, titulo, contenido, fecha_publicacion, imagen,
                DATE_FORMAT(fecha_publicacion, '%d %b %Y') as fecha,
                DATE_FORMAT(fecha_publicacion, '%H:%i') as hora
                FROM noticias
                ORDER BY fecha_publicacion DESC" // Esto ya hace el filtro de más actual primero
            );

            $noticias = [];
            $rutaWeb = "../uploads/";

            while ($row = $result->fetch_assoc()) {
                if ($row['imagen']) {
                    $row['imagen'] =  $rutaWeb . $row['imagen'];
                }
                $noticias[] = $row;
            }

            echo json_encode(["success" => true, "noticias" => $noticias]);
            break;

        case "anadir":
            $titulo = $_POST['titulo'] ?? '';
            $contenido = $_POST['contenido'] ?? '';
            $nombreArchivo = null;

            // Solo procesamos si realmente hay un archivo subido sin errores
            if (isset($_FILES["imagen"]) && $_FILES["imagen"]["error"] === UPLOAD_ERR_OK) {
                // Recomendación: Añade un timestamp al nombre para evitar duplicados
                $nombreArchivo = basename($_FILES["imagen"]["name"]);
                $rutaCompleta = $carpeta . $nombreArchivo;

                if (!move_uploaded_file($_FILES["imagen"]["tmp_name"], $rutaCompleta)) {
                    // Error al mover el archivo
                    echo json_encode(["success" => false, "message" => "Error al guardar el archivo físico"]);
                    exit;
                }
            }

            $stmt = $conn->prepare("INSERT INTO noticias (id_organizador, titulo, contenido, fecha_publicacion, imagen) VALUES (?, ?, ?, NOW(), ?)");
            $stmt->bind_param("isss", $idOrganizador, $titulo, $contenido, $nombreArchivo);
            $stmt->execute();

            echo json_encode(["success" => $stmt->affected_rows > 0]);
            break;

        case "editar":
            $id = intval($_POST['id'] ?? 0);
            $titulo = $_POST['titulo'] ?? '';
            $contenido = $_POST['contenido'] ?? '';

            // Si hay una nueva imagen
            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {

                $nombreArchivo = basename($_FILES["imagen"]["name"]);
                $rutaCompleta = $carpeta . $nombreArchivo;

                // Movemos el archivo físico
                move_uploaded_file($_FILES["imagen"]["tmp_name"], $rutaCompleta);

                // Actualizamos incluyendo el nuevo nombre de la imagen
                $stmt = $conn->prepare("UPDATE noticias SET titulo=?, contenido=?, imagen=? WHERE id_noticia=?");
                $stmt->bind_param("sssi", $titulo, $contenido, $nombreArchivo, $id);
            } else {
                // Si no se subió imagen nueva, solo actualizamos texto
                $stmt = $conn->prepare("UPDATE noticias SET titulo=?, contenido=? WHERE id_noticia=?");
                $stmt->bind_param("ssi", $titulo, $contenido, $id);
            }

            $stmt->execute();
            echo json_encode(["success" => $stmt->affected_rows >= 0]); // >= 0 porque si no cambias nada, affected_rows es 0
            break;

        case "borrar":
            $id = intval($_POST['id'] ?? 0);
            $stmt = $conn->prepare("DELETE FROM noticias WHERE id_noticia=?");
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
