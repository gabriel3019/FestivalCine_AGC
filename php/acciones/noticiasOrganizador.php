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

        // case "listar":
        //     $result = $conn->query(
        //         "SELECT id_noticia, titulo, contenido, fecha_publicacion
        //  FROM noticias 
        //  ORDER BY fecha_publicacion DESC"
        //     );

        //     $noticias = [];
        //     while ($row = $result->fetch_assoc()) {
        //         $noticias[] = $row;
        //     }

        //     echo json_encode([
        //         "success" => true,
        //         "noticias" => $noticias
        //     ]);
        //     break;

        case "anadir":
            $titulo = $_POST['titulo'] ?? '';
            $contenido = $_POST['contenido'] ?? '';

            if ($idOrganizador === 0) {
                echo json_encode([
                    "success" => false,
                    "message" => "Organizador no valido"
                ]);
                exit;
            }

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
            $id = $_SESSION['id'] ?? 0;
            $titulo = $_POST['titulo'] ?? '';
            $contenido = $_POST['contenido'] ?? '';

            if ($id === 0) {
                throw new Exception("ID inválido");
            }

            $stmt = $conn->prepare(
                "UPDATE noticias 
             SET titulo=?, contenido=?
             WHERE id_noticia=?"
            );

            $stmt->bind_param("ssi", $titulo, $contenido, $id);
            $stmt->execute();

            echo json_encode(["success" => true]);
            break;

        case "borrar":
            $id = $_POST['id'] ?? 0;

            if ($id === 0) {
                throw new Exception("ID inválido");
            }

            $stmt = $conn->prepare(
                "DELETE FROM noticias WHERE id_noticia=?"
            );
            $stmt->bind_param("i", $id);

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
