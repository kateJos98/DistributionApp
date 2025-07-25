<?php
namespace App\Kafka;

use RdKafka\Producer;

class KafkaProducer {
    public static function send(string $topicName, string $message): void {
        $broker = getenv('KAFKA_BROKER');
        $conf = new \RdKafka\Conf();
        $producer = new Producer($conf);
        $producer->addBrokers($broker);

        $topic = $producer->newTopic($topicName);
        $topic->produce(RD_KAFKA_PARTITION_UA, 0, $message);

        try {
            $producer->flush(5000);
            if (RD_KAFKA_RESP_ERR_NO_ERROR !== $producer->getOutQLen()) {
                throw new \RuntimeException('Unable to flush messages');
            }
        } catch (\Exception $e) {
            // Loggear el error o manejarlo adecuadamente
            error_log('Kafka error: ' . $e->getMessage());
}
    }
}
