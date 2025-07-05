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

    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare("SELECT * FROM customers WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
    }

}
