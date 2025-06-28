<?php
namespace App\Services;

use App\Models\CustomerRepository;
use App\Kafka\KafkaProducer;

class CustomerService {
    private $repo;

    public function __construct(CustomerRepository $repo) {
        $this->repo = $repo;
    }

    public function updateCustomer(string $emailAnterior, array $data): bool {
        $success = $this->repo->updateByEmail($emailAnterior, $data);
        if ($success) {
            KafkaProducer::send('user_updated', json_encode([
                'email_anterior' => $emailAnterior,
                'email'          => $data['email'],       // nuevo email
                'username'       => $data['username'],
                'full_name'      => $data['full_name'],
                'phone'          => $data['phone'],
                'city'           => $data['city'],
                'address'        => $data['address'],
            ]));
        }
        return $success;
    }
}

