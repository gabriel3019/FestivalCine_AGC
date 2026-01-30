<?php
session_start();

/* Vaciar variables de sesión */
$_SESSION = [];

/* Destruir la sesión */
session_destroy();

header("Location: ../../html/login.html");
exit;
