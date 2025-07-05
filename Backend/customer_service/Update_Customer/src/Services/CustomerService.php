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
            $kafkaPayload = [
                "email_anterior" => $emailAnterior,
                "update" => [
                    "email" => $data['email'],
                    "username" => $data['username']
                    
                ]
            ];
            
            try {
                KafkaProducer::send('user_updated', json_encode($kafkaPayload));
            } catch (\Exception $e) {
                // Loggear el error pero no fallar la operación
                error_log('Error enviando a Kafka: ' . $e->getMessage());
            }
        }
        return $success;
    }
}

