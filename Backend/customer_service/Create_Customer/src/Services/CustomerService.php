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
            if ($repo->save($data)) {
                KafkaProducer::publish($_ENV['KAFKA_TOPIC'], [
                    "username" => $data['username'],
                    "email" => $data['email'],
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
