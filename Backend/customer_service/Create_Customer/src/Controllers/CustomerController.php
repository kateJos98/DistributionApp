<?php
namespace App\Controllers;

use App\Services\CustomerService;

class CustomerController {
    public static function handleRegister(): void {
        $data = json_decode(file_get_contents("php://input"), true);

        $required = ['username', 'email', 'password', 'full_name', 'phone', 'city', 'address'];
        foreach ($required as $field) {
            if (!isset($data[$field])) {
                http_response_code(400);
                echo json_encode(["error" => "Falta el campo $field"]);
                return;
            }
        }

        $service = new CustomerService();
        $result = $service->register($data);

        if ($result === true) {
            echo json_encode(["message" => "Cliente registrado correctamente"]);
        } elseif ($result === 'duplicate') {
            http_response_code(409);
            echo json_encode(["error" => "El correo ya está registrado"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al registrar cliente"]);
        }
    
    }

}


