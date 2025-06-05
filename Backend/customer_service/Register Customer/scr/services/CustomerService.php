<?php
namespace App\services;

use App\config\Database;
use App\models\Customer;
use App\events\CustomerRegisteredEvent;

class CustomerService {
    public function register(Customer $customer) {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)");
        $stmt->execute([$customer->name, $customer->email, $customer->phone]);

        // Emitir evento
        $event = new CustomerRegisteredEvent();
        $event->publish($customer);
    }
}
