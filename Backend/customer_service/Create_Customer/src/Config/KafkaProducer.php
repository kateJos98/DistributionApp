<?php 
namespace App\Config;

use RdKafka\Producer;
use RdKafka\Conf;
use Exception;

class KafkaProducer {
    public static function publish(string $topicName, array $message): void {
        $conf = new Conf();
        $conf->set('metadata.broker.list', $_ENV['KAFKA_BROKER'] ?? 'kafka:9092');

        $producer = new Producer($conf);
        if (!$producer) {
            throw new Exception("❌ No se pudo crear el productor de Kafka");
        }

        $topic = $producer->newTopic($topicName);
        if (!$topic) {
            throw new Exception("❌ No se pudo obtener el tópico: $topicName");
        }

        $payload = json_encode($message);
        if ($payload === false) {
            throw new Exception("❌ Error al codificar el mensaje JSON");
        }

        $topic->produce(RD_KAFKA_PARTITION_UA, 0, $payload);

        $result = $producer->flush(1000);
        if ($result !== RD_KAFKA_RESP_ERR_NO_ERROR) {
            throw new Exception("❌ Error al hacer flush del mensaje a Kafka");
        }
    }
}
