<?php 
namespace App\Services;

use App\Config\database;
use App\Models\CustomerRepository;
use App\Config\KafkaProducer;
use PDOException;

class CustomerService {
    public function register(array $data): bool|string {
        $db = Database::connect();
        $repo = new CustomerRepository($db);

        try {
            $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
            if ($repo->save(array_merge($data, ['password' => $hashedPassword]))) {
                KafkaProducer::publish($_ENV['KAFKA_TOPIC'], [
                    "username" => $data['username'],
                    "email"    => $data['email'],
                    "password" => $data['password'], 
                    "role"     => "cliente"
                ]);
                return true;
            }
            return false;
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), 'Duplicate')) {
                return 'duplicate';
            }
            return false;
        }
    }
}
