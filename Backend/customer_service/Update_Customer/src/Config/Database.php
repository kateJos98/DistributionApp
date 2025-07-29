<?php
namespace App\Config;

use Dotenv\Dotenv;
use PDO;
use PDOException;

class Database {
    private static $connection = null;

    public static function connect() {
        error_log("🔌 Iniciando conexión a la base de datos...");

        // Reutiliza la conexión si ya existe
        if (self::$connection !== null) {
            return self::$connection;
        }

        // ✅ Cargar archivo .env si existe (solo una vez)
        $dotenvPath = __DIR__ . '/../../.env';
        if (file_exists($dotenvPath)) {
            $dotenv = Dotenv::createImmutable(dirname($dotenvPath));
            $dotenv->safeLoad(); // no lanza excepción si alguna variable falta
            error_log("📦 Variables cargadas desde .env");
        } else {
            error_log("⚠️ Archivo .env no encontrado, usando variables del sistema");
        }

        try {
            $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST');
            $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT');
            $dbname = $_ENV['DB_NAME'] ?? getenv('DB_NAME');
            $user = $_ENV['DB_USER'] ?? getenv('DB_USER');
            $pass = $_ENV['DB_PASS'] ?? getenv('DB_PASS');

            if (!$host || !$port || !$dbname || !$user || !$pass) {
                throw new \Exception("❌ Faltan variables de entorno para conectar a la base de datos.");
            }
            
            $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8";
            error_log("🌐 Conectando a la DB con DSN: $dsn");

            self::$connection = new PDO($dsn, $user, $pass);
            self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return self::$connection;
        } catch (PDOException $e) {
            error_log("❌ Error de conexión a la base de datos: " . $e->getMessage());
            throw $e;
        }
    }
}
