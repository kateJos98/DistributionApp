<?php
namespace App\Config;

use PDO;
use Dotenv\Dotenv;

class Database {
    public static function connect(): PDO {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
        $dotenv->load();

        return new PDO(
            "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8",
            $_ENV['DB_USER'],
            $_ENV['DB_PASSWORD']
        );
    }
}

