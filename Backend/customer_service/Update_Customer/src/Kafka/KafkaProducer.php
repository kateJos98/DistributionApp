<?php
namespace App\Kafka;

use RdKafka\Producer;

class KafkaProducer {
    public static function send(string $topicName, string $message): void {
        $conf = new \RdKafka\Conf();
        $producer = new Producer($conf);
        $producer->addBrokers('kafka:9092');

        $topic = $producer->newTopic($topicName);
        $topic->produce(RD_KAFKA_PARTITION_UA, 0, $message);

        $producer->flush(5000);
    }
}
