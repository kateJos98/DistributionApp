<?php
namespace App\Kafka;

use RdKafka\Producer;

class KafkaProducer {
    public static function send(string $topicName, string $message): void {
        $broker = $_ENV['KAFKA_BROKER'];
        if (!$broker) {
            throw new \Exception("KAFKA_BROKER no definido en el entorno");
        }
        $conf = new \RdKafka\Conf();
        $producer = new Producer($conf);
        $producer->addBrokers($broker);

        $topic = $producer->newTopic($topicName);
        $topic->produce(RD_KAFKA_PARTITION_UA, 0, $message);

        try {
            $producer->flush(5000);
            if (RD_KAFKA_RESP_ERR_NO_ERROR !== $producer->getOutQLen()) {
                throw new \RuntimeException('No se pudieron enviar todos los mensajes');
            }
        } catch (\Exception $e) {
        
            error_log('Kafka error: ' . $e->getMessage());
        }
    }
}
