<?php
namespace App\Controllers;

use App\Config\Database;
use App\Models\CustomerRepository;
use App\Services\CustomerService;
use App\Kafka\KafkaProducer;

class CustomerController {
    public static function handleUpdate(): void {
        $input = json_decode(file_get_contents("php://input"), true);

        // Validar campos mínimos
        if (!isset($input['username']) || !isset($input['full_name']) || 
            !isset($input['phone']) || !isset($input['city']) || 
            !isset($input['address']) || !isset($input['email'])) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan campos requeridos"]);
            return;
        }

        try {
            $pdo = Database::connect();
            $repo = new CustomerRepository($pdo);
            $service = new CustomerService($repo);

            // Obtener cliente actual por username
            $existingCustomer = $repo->findByUsername($input['username']);
            if (!$existingCustomer) {
                http_response_code(404);
                echo json_encode(["error" => "Cliente no encontrado"]);
                return;
            }

            $emailAnterior = $existingCustomer['email'];

            // Actualizar en MySQL
            $success = $service->updateCustomer($emailAnterior, $input);
            if (!$success) {
                http_response_code(500);
                echo json_encode(["error" => "Error al actualizar cliente"]);
                return;
            }

            
            $payload = [
                "email_anterior" => $emailAnterior,
                "email"          => $input['email'],
                "username"       => $input['username'],
                "full_name"      => $input['full_name'],
                "phone"          => $input['phone'],
                "city"           => $input['city'],
                "address"        => $input['address'],
            ];

            KafkaProducer::send("user_updated", json_encode($payload));

            echo json_encode(["message" => "Cliente actualizado correctamente"]);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                "error" => "Error al actualizar cliente", 
                "detalle" => $e->getMessage()
            ]);
        }
    }
}
