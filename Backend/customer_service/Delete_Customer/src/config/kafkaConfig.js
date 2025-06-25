export default {
  clientId: 'delete-customer-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
  topic: process.env.KAFKA_TOPIC_DELETE || 'customer_deleted',
};