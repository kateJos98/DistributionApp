<?php
namespace App\Config;

use RdKafka\Producer;

class KafkaProducer {
    public static function publish(string $topicName, array $message): void {
        $conf = new \RdKafka\Conf();
        $producer = new Producer($conf);
        $producer->addBrokers($_ENV['KAFKA_BROKER']);

        $topic = $producer->newTopic($topicName);
        $topic->produce(RD_KAFKA_PARTITION_UA, 0, json_encode($message));
        $producer->flush(1000);
    }
}
