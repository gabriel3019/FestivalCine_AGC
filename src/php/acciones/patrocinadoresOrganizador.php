<?php

// Cabecera JSON
header('Content-Type: application/json');

// Iniciar sesión y conectar BBDD
session_start();
require "../BBDD/conecta.php"; // tu conexión $conn

// Carpeta donde se guardan los logos
$root = dirname(__DIR__, 2);
$uploadDir = $root . "/uploads/";

$action = $_POST['action'] ?? '';

try {

    switch($action){

        // ================= LISTAR =================
        case "listar":
            $result = $conn->query("SELECT id_patrocinador, nombre, logo FROM patrocinadores ORDER BY id_patrocinador DESC");
            $patrocinadores = [];
            while($row = $result->fetch_assoc()){
                // Convertir logo a base64 si existe
                if($row['logo'] && file_exists($uploadDir.$row['logo'])){
                    $row['logo'] = 'data:image;base64,' . base64_encode(file_get_contents($uploadDir.$row['logo']));
                } else {
                    $row['logo'] = null;
                }
                $patrocinadores[] = $row;
            }
            echo json_encode(["success"=>true, "patrocinadores"=>$patrocinadores]);
            break;

        // ================= AÑADIR =================
        case "anadir":
            $nombre = $_POST['nombre'] ?? '';
            $logoNombre = '';

            if(isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK){
                // Reemplazar espacios en nombre de archivo
                $logoNombre = time().'_'.preg_replace('/\s+/', '_', basename($_FILES['logo']['name']));
                if(!move_uploaded_file($_FILES['logo']['tmp_name'], $uploadDir.$logoNombre)){
                    echo json_encode(["success"=>false,"message"=>"No se pudo subir el logo"]);
                    exit;
                }
            }

            $stmt = $conn->prepare("INSERT INTO patrocinadores (nombre, logo) VALUES (?, ?)");
            $stmt->bind_param("ss", $nombre, $logoNombre);
            $stmt->execute();
            echo json_encode(["success"=>$stmt->affected_rows>0]);
            break;

        // ================= EDITAR =================
        case "editar":
            $id = intval($_POST['id'] ?? 0);
            $nombre = $_POST['nombre'] ?? '';

            if(isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK){
                $logoNombre = time().'_'.preg_replace('/\s+/', '_', basename($_FILES['logo']['name']));
                if(!move_uploaded_file($_FILES['logo']['tmp_name'], $uploadDir.$logoNombre)){
                    echo json_encode(["success"=>false,"message"=>"No se pudo subir el logo"]);
                    exit;
                }
                $stmt = $conn->prepare("UPDATE patrocinadores SET nombre=?, logo=? WHERE id_patrocinador=?");
                $stmt->bind_param("ssi", $nombre, $logoNombre, $id);
            } else {
                $stmt = $conn->prepare("UPDATE patrocinadores SET nombre=? WHERE id_patrocinador=?");
                $stmt->bind_param("si", $nombre, $id);
            }
            $stmt->execute();
            echo json_encode(["success"=>$stmt->affected_rows>0]);
            break;

        // ================= BORRAR =================
        case "borrar":
            $id = intval($_POST['id'] ?? 0);
            $stmt = $conn->prepare("DELETE FROM patrocinadores WHERE id_patrocinador=?");
            $stmt->bind_param("i",$id);
            $stmt->execute();
            echo json_encode(["success"=>$stmt->affected_rows>0]);
            break;

        // ================= ACCIÓN NO RECONOCIDA =================
        default:
            echo json_encode(["success"=>false,"message"=>"Acción no reconocida"]);
    }

} catch(Throwable $e){
    echo json_encode(["success"=>false,"message"=>$e->getMessage()]);
}
