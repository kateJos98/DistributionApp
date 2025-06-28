<?php
namespace App\Models;

use PDO;

class CustomerRepository {
    private $db;
    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function updateByEmail(string $email, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE customers SET 
                username = ?, email = ?, full_name = ?, phone = ?, city = ?, address = ?
            WHERE email = ?
        ");

        return $stmt->execute([
            $data['username'],
            $data['email'],
            $data['full_name'],
            $data['phone'],
            $data['city'],
            $data['address'],
            $email
        ]);
    }
    
    public function findByUsername(string $username): ?array {
        $stmt = $this->db->prepare("SELECT * FROM customers WHERE username = ?");
        $stmt->execute([$username]);
        return $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
    }

}
