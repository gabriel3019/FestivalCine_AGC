<?php
session_start();

// Si no hay usuario logueado, redirige al login
if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit();
}
?>
