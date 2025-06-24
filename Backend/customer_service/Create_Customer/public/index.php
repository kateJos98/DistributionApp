<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, api-key");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require __DIR__ . '/../vendor/autoload.php';

use App\Controllers\CustomerController;

header("Content-Type: application/json");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if ($uri === '/create-customer' && $method === 'POST') {
    CustomerController::handleRegister();
} else {
    http_response_code(404);
    echo json_encode(["message" => "Ruta no encontrada"]);
}
