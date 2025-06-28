<?php
require __DIR__ . '/../vendor/autoload.php';

use App\Controllers\CustomerController;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if ($uri === '/update-customer' && in_array($method, ['POST', 'PUT'])) {
    CustomerController::handleUpdate();
} else {
    http_response_code(404);
    echo json_encode(["error" => "Ruta no encontrada"]);
}
