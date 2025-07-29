<?php
namespace App\Config;

use Dotenv\Dotenv;
use PDO;
use PDOException;

class Database {
    public static function connect() {
        // ✅ Cargar archivo .env solo si existe
        $dotenvPath = __DIR__ . '/../../.env';
        if (file_exists($dotenvPath)) {
            $dotenv = Dotenv::createImmutable(dirname($dotenvPath));
            $dotenv->load();
            error_log("📦 Variables cargadas desde .env");
        } else {
            error_log("⚠️ Archivo .env no encontrado, usando variables de entorno del sistema");
        }

        try {
            $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST');
            $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT');
            $dbname = $_ENV['DB_NAME'] ?? getenv('DB_NAME');
            $user = $_ENV['DB_USER'] ?? getenv('DB_USER');
            $pass = $_ENV['DB_PASS'] ?? getenv('DB_PASS');

            error_log("🌐 Conectando a la DB en $host:$port/$dbname");

            $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8", $user, $pass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch (PDOException $e) {
            error_log("❌ Error de conexión a la base de datos: " . $e->getMessage());
            throw $e;
        }
    }
}

