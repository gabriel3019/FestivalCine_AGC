<?php
header('Content-Type: application/json');
session_start();
require "../BBDD/conecta.php";

$idOrganizador = $_SESSION['usuario']['id'] ?? 0;
$action = $_POST['action'] ?? '';

try {

    switch ($action) {

        case "listar":
            $result = $conn->query(
                "SELECT id_noticia, titulo, contenido, fecha_publicacion, imagen
                 FROM noticias
                 ORDER BY fecha_publicacion DESC"
            );

            $noticias = [];
            while ($row = $result->fetch_assoc()) {
                if ($row['imagen']) {
                    $row['imagen'] = 'data:image/jpeg;base64,' . base64_encode($row['imagen']);
                }
                $noticias[] = $row;
            }

            echo json_encode(["success" => true, "noticias" => $noticias]);
            break;

        case "anadir":
            $titulo = $_POST['titulo'] ?? '';
            $contenido = $_POST['contenido'] ?? '';
            $imagenBD = null;

            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                $imagenBD = file_get_contents($_FILES['imagen']['tmp_name']);
            }

            $stmt = $conn->prepare(
                "INSERT INTO noticias (id_organizador, titulo, contenido, fecha_publicacion, imagen)
                 VALUES (?, ?, ?, NOW(), ?)"
            );

            $stmt->bind_param("issb", $idOrganizador, $titulo, $contenido, $imagenBD);
            if ($imagenBD) $stmt->send_long_data(3, $imagenBD);

            $stmt->execute();
            echo json_encode(["success" => $stmt->affected_rows > 0]);
            break;

        case "editar":
            $id = intval($_POST['id'] ?? 0);
            $titulo = $_POST['titulo'] ?? '';
            $contenido = $_POST['contenido'] ?? '';

            $imagenBD = null;
            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                $imagenBD = file_get_contents($_FILES['imagen']['tmp_name']);
                $stmt = $conn->prepare("UPDATE noticias SET titulo=?, contenido=?, imagen=? WHERE id_noticia=?");
                $stmt->bind_param("ssbi", $titulo, $contenido, $imagenBD, $id);
                $stmt->send_long_data(2, $imagenBD);
            } else {
                $stmt = $conn->prepare("UPDATE noticias SET titulo=?, contenido=? WHERE id_noticia=?");
                $stmt->bind_param("ssi", $titulo, $contenido, $id);
            }

            $stmt->execute();
            echo json_encode(["success" => $stmt->affected_rows > 0]);
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
