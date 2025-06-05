<?php
namespace App\config;

use PDO;
use Dotenv\Dotenv;

class Database {
    public static function connect() {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
        $dotenv->load();

        $host = $_ENV['DB_HOST'];
        $db = $_ENV['DB_NAME'];
        $user = $_ENV['DB_USER'];
        $pass = $_ENV['DB_PASSWORD'];

        return new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    }
}
