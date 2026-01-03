<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SESSION['usuario'])) {
    echo json_encode([
        "logged" => true,
        "usuario" => [
            "id" => $_SESSION['usuario']['id'],
            "nombre" => $_SESSION['usuario']['nombre'],
            "rol" => $_SESSION['usuario']['rol']
        ]
    ]);
} else {
    echo json_encode([
        "logged" => false
    ]);
}
