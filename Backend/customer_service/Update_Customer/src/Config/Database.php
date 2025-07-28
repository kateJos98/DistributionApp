<?php
namespace App\Config;

use PDO;

class Database {
    public static function connect(): PDO {
        $host = $_ENV['DB_HOST'];
        $port = $_ENV['DB_PORT'];
        $db = $_ENV['DB_NAME'];
        $user = $_ENV['DB_USER'];
        $pass = $_ENV['DB_PASS'];

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

        return new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
    }
}