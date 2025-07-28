<?php
namespace App\Config;

use PDO;
use PDOException;

class Database {
    public static function connect(): PDO {
        // Cargar .env solo si estamos fuera de Docker
        if (!getenv('DB_HOST')) {
            if (file_exists(__DIR__ . '/../../.env')) {
                $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
                $dotenv->load();
            }
        }

        $host = getenv('DB_HOST');
        $port = getenv('DB_PORT');
        $db   = getenv('DB_NAME');
        $user = getenv('DB_USER');
        $pass = getenv('DB_PASS');

        error_log("🔧 Conectando a MySQL en $host:$port / DB: $db / User: $user");

        if (!$host || !$db) {
            throw new \Exception("❌ Variables de entorno faltantes: DB_HOST o DB_NAME");
        }

        try {
            $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8";
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
            error_log("✅ Conexión exitosa a MySQL");
            return $pdo;
        } catch (PDOException $e) {
            error_log("❌ Error de conexión a MySQL: " . $e->getMessage());
            throw $e;
        }
    }
}
