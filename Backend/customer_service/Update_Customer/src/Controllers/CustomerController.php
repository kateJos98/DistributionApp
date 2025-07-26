<?php
namespace App\Controllers;

use App\Config\Database;
use App\Models\CustomerRepository;
use App\Services\CustomerService;
use App\Kafka\KafkaProducer;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;


class CustomerController {
    public static function handleUpdate(): void {
        ini_set('log_errors', 1);
        ini_set('display_errors', 0);
        ini_set('error_log', '/proc/self/fd/2');

        $token = null;
    
        // Verificar si hay token en cookies
        if (isset($_COOKIE['token'])) {
            $token = $_COOKIE['token'];
            // Debug: imprimir el token recibido
            error_log("=== TOKEN RECIBIDO ===");
            error_log($token);
        } else {
            // Si no hay cookie, verificar en headers
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $token = str_replace("Bearer ", "", $headers['Authorization']);
                error_log("✅ Token recibido por header: $token");
            } else {
                error_log("❌ No se recibió token ni por cookie ni por header.");
            }
        }
        

        // Validar existencia del token
        if (!$token) {
            http_response_code(401);
            echo json_encode(["error" => "No se envió el token"]);
            return;
        }

        try {
            // Validar token con el authorization-service
            error_log("🔍 Validando token con el AuthService...");
            $authResponse = self::validateTokenWithAuthService($token);
            error_log("✅ Token validado correctamente");
            $userEmail = $authResponse['email']; // Email obtenido del token
            
            $input = json_decode(file_get_contents("php://input"), true);
            
            // Validación de campos mínimos
            if (!isset($input['username']) || !isset($input['email']) || 
                !isset($input['full_name']) || !isset($input['phone']) || 
                !isset($input['city']) || !isset($input['address'])) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan campos requeridos"]);
                return;
            }

            $pdo = Database::connect();
            $repo = new CustomerRepository($pdo);
            $service = new CustomerService($repo);

            // Buscar cliente por email del token
            $existingCustomer = $repo->findByEmail($userEmail);
            if (!$existingCustomer) {
                http_response_code(404);
                echo json_encode(["error" => "Cliente no encontrado"]);
                return;
            }

            // Guardar email anterior para actualización
            $emailAnterior = $existingCustomer['email'];

            // Actualizar en MySQL
            $success = $service->updateCustomer($emailAnterior, $input);
            if (!$success) {
                http_response_code(500);
                echo json_encode(["error" => "Error al actualizar cliente"]);
                return;
            }

            // Enviar evento Kafka para actualizar login-service
            $payload = [
                "email_anterior" => $emailAnterior,
                "update" => [
                    "email" => $input['email'],
                    "username" => $input['username']
                ]
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

    private static function validateTokenWithAuthService(string $token): array {
        error_log("🌐 Llamando a AUTH_SERVICE con token...");
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, getenv('AUTH_SERVICE_URL'));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer " . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        if ($response === false) {
            error_log("⚠️ cURL Error: " . curl_error($ch));
        } else {
            error_log("📥 Respuesta AUTH_SERVICE: HTTP " . curl_getinfo($ch, CURLINFO_HTTP_CODE) . " - " . $response);
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new \Exception("Token inválido o no autorizado");
        }
        $decoded = json_decode($response, true);
        if ($decoded === null) {
            error_log("⚠️ json_decode falló: " . json_last_error_msg());
            throw new \Exception("Error al decodificar respuesta JSON del auth-service");
        }
        
        return $decoded;
    }
}
