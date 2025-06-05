<?php
require __DIR__ . '/../vendor/autoload.php';

use App\controllers\RegisterCustomerController;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller = new RegisterCustomerController();
    $controller->handle();
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
