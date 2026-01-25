<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['usuario'])) {
    echo json_encode([
        "logged" => true,
        "usuario" => [
            "id" => $_SESSION['usuario']['id'],
            "nombre" => $_SESSION['usuario']['nombre'],
            "tipo" => $_SESSION['usuario']['tipo'] ?? null
        ]
    ]);
} else {
    echo json_encode([
        "logged" => false
    ]);
}
