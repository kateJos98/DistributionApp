import { Kafka } from 'kafkajs';
import kafkaConfig from '../config/kafkaConfig.js';

const kafka = new Kafka({
  clientId: kafkaConfig.clientId,
  brokers: kafkaConfig.brokers,
});

const producer = kafka.producer();

export async function sendCustomerDeletedEvent(email) {
  await producer.connect();
  await producer.send({
    topic: kafkaConfig.topic,
    messages: [
      { value: JSON.stringify({ event: 'customer_deleted', email }) }
    ]
  });
  await producer.disconnect();
}
