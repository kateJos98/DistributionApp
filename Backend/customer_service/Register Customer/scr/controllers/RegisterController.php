<?php
namespace App\controllers;

use App\models\Customer;
use App\services\CustomerService;

class RegisterCustomerController {
    public function handle() {
        $data = json_decode(file_get_contents('php://input'), true);
        $customer = new Customer($data);
        $service = new CustomerService();
        $service->register($customer);

        echo json_encode(['message' => 'Cliente registrado exitosamente']);
    }
}
