<?php
namespace App\Models;

use PDO;
use PDOException;

class CustomerRepository {
    private $db;
    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function save(array $data): bool {
        $stmt = $this->db->prepare(
            "INSERT INTO customers 
                (username, email, password, full_name, phone, city, address)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );

        return $stmt->execute([
            $data['username'],
            $data['email'],
            password_hash($data['password'], PASSWORD_BCRYPT),
            $data['full_name'],
            $data['phone'],
            $data['city'],
            $data['address']
        ]);
    }

}
