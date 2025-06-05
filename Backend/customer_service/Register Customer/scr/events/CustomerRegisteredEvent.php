<?php
namespace App\events;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class CustomerRegisteredEvent {
    public function publish($customer) {
        $connection = new AMQPStreamConnection(
            $_ENV['RABBITMQ_HOST'],
            $_ENV['RABBITMQ_PORT'],
            $_ENV['RABBITMQ_USER'],
            $_ENV['RABBITMQ_PASSWORD']
        );
        $channel = $connection->channel();
        $channel->queue_declare('customer_registered', false, false, false, false);

        $data = json_encode([
            'name' => $customer->name,
            'email' => $customer->email,
            'phone' => $customer->phone
        ]);

        $msg = new AMQPMessage($data);
        $channel->basic_publish($msg, '', 'customer_registered');

        $channel->close();
        $connection->close();
    }
}
