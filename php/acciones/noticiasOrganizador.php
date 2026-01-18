<?php
header('Content-Type: application/json');

session_start();
require "../BBDD/conecta.php";

$idOrganizador = $_SESSION['usuario']['id'];


$action = $_POST['action'] ?? '';
try {
    switch ($action) {

        case "listar":
            $result = $conn->query(
                "SELECT id_noticia, titulo, contenido, fecha_publicacion
         FROM noticias 
         ORDER BY fecha_publicacion DESC"
            );

            $noticias = [];
            while ($row = $result->fetch_assoc()) {
                $noticias[] = $row;
            }

            echo json_encode([
                "success" => true,
                "noticias" => $noticias
            ]);
            break;

        case "anadir":

            $idOrganizador = $_SESSION['usuario']['id'];
            error_log("ID organizador en sesión: $idOrganizador");


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

            $titulo = $_POST['titulo'] ?? '';
            $contenido = $_POST['contenido'] ?? '';

            $stmt = $conn->prepare(
                "INSERT INTO noticias (id_organizador, titulo, contenido, fecha_publicacion) 
         VALUES (?, ?, ?, NOW())"
            );

            if (!$stmt) {
                echo json_encode([
                    "success" => false,
                    "message" => $conn->error
                ]);
                exit;
            }

            $stmt->bind_param("iss", $idOrganizador, $titulo, $contenido);

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
            $id = intval($_POST['id'] ?? 0);
            $titulo = $_POST['titulo'] ?? '';
            $contenido = $_POST['contenido'] ?? '';

            if ($id <= 0) {
                throw new Exception("ID inválido");
            }

            if (trim($titulo) === '' || trim($contenido) === '') {
                echo json_encode([
                    "success" => false,
                    "message" => "Título y contenido no pueden estar vacíos"
                ]);
                exit;
            }

            $stmt = $conn->prepare(
                "UPDATE noticias 
             SET titulo=?, contenido=?
             WHERE id_noticia=?"
            );

            $stmt->bind_param("ssi", $titulo, $contenido, $id);

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

            $sql = "DELETE FROM noticias WHERE id_noticia = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo json_encode([
                    "success" => true,
                    "message" => "Noticia eliminada correctamente"
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "No se pudo eliminar la noticia"
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
