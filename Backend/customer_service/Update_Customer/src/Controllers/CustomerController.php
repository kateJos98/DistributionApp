<?php
namespace App\Controllers;

use App\Config\Database;
use App\Models\CustomerRepository;
use App\Services\CustomerService;
use App\Kafka\KafkaProducer;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

use Dotenv\Dotenv;

class CustomerController {
    public static function handleUpdate(): void {
        ini_set('log_errors', 1);
        ini_set('display_errors', 0);
        ini_set('error_log', '/proc/self/fd/2');

        // =======================
        // Cargar variables de entorno .env
        // =======================
        $dotenvPath = __DIR__ . '/../../.env';
        if (file_exists($dotenvPath)) {
            $dotenv = Dotenv::createImmutable(dirname($dotenvPath));
            $dotenv->load();
            error_log("📦 Variables cargadas desde .env");
        } else {
            error_log("⚠️ Archivo .env no encontrado, usando variables del sistema");
        }

        $token = null;

        // =======================
        // Obtener token
        // =======================
        if (isset($_COOKIE['token'])) {
            $token = $_COOKIE['token'];
            error_log("📦 Token recibido desde cookie");
        } else {
            error_log("📦 Token no sea recibido desde cookie");
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $token = str_replace("Bearer ", "", $headers['Authorization']);
                error_log("✅ Token recibido por header: $token");
            } else {
                error_log("❌ No se recibió token ni por cookie ni por header.");
            }
        }

        if (!$token) {
            http_response_code(401);
            echo json_encode(["error" => "No se envió el token"]);
            return;
        }

        try {
            // =======================
            // Validar token con AuthService
            // =======================
            error_log("🔍 Validando token con el AuthService...");
            $authResponse = self::validateTokenWithAuthService($token);
            error_log("✅ Token validado correctamente");

            $userEmail = $authResponse['email']; // Email extraído del token

            // =======================
            // Leer input del request
            // =======================
            $input = json_decode(file_get_contents("php://input"), true);
            if (!$input) {
                error_log("❌ Entrada vacía o JSON mal formado");
                http_response_code(400);
                echo json_encode(["error" => "Entrada vacía o JSON inválido"]);
                return;
            }

            // =======================
            // Validar campos requeridos
            // =======================
            $requiredFields = ['username', 'email', 'full_name', 'phone', 'city', 'address'];
            foreach ($requiredFields as $field) {
                if (!isset($input[$field])) {
                    http_response_code(400);
                    echo json_encode(["error" => "Falta el campo requerido: $field"]);
                    return;
                }
            }

            // =======================
            // Conectar base de datos
            // =======================
            error_log("🔎 Variable de entorno DB_HOST = " . getenv('DB_HOST'));
            error_log("🔌 Conectando a la base de datos...");
            $pdo = Database::connect();
            error_log("✅ Conexión a la base de datos exitosa");

            $repo = new CustomerRepository($pdo);
            $service = new CustomerService($repo);

            // =======================
            // Buscar cliente
            // =======================
            $existingCustomer = $repo->findByEmail($userEmail);
            if (!$existingCustomer) {
                http_response_code(404);
                error_log("❌ Cliente no encontrado en la base");
                echo json_encode(["error" => "Cliente no encontrado"]);
                return;
            }

            $emailAnterior = $existingCustomer['email'];
            error_log("📥 Datos recibidos para actualización: " . print_r($input, true));

            // =======================
            // Actualizar cliente
            // =======================
            $success = $service->updateCustomer($emailAnterior, $input);
            if (!$success) {
                throw new \Exception("Falló la actualización del cliente");
            }
            error_log("🛠 Cliente actualizado correctamente en MySQL");

            // =======================
            // Enviar evento Kafka
            // =======================
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
            error_log("🔥 Error general en actualización: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                "error" => "Error al actualizar cliente", 
                "detalle" => $e->getMessage()
            ]);
        }
    }

    private static function validateTokenWithAuthService(string $token): array {
        error_log("🌐 Llamando a AUTH_SERVICE con token...");

        $authServiceUrl = $_ENV['AUTH_SERVICE_URL'] ?? null;
        if (!$authServiceUrl) {
            throw new \Exception("AUTH_SERVICE_URL no está definido en el entorno");
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $authServiceUrl);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer " . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($response === false) {
            error_log("⚠️ Error en cURL: " . curl_error($ch));
            curl_close($ch);
            throw new \Exception("Error al llamar al AuthService");
        }

        error_log("📥 Respuesta AUTH_SERVICE: HTTP $httpCode - $response");
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
