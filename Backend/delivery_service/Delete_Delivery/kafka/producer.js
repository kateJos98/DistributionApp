const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({
  clientId: 'delete-delivery-producer',
  brokers: [process.env.KAFKA_BROKER],
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("✅ Kafka Producer conectado");
}

async function publishDeliveryDeleted(data) {
  try {
    await producer.send({
      topic: "delivery_deleted",
      messages: [{ value: JSON.stringify(data) }],
    });
    console.log("📤 Mensaje publicado a Kafka (delivery-deleted):", data);
  } catch (error) {
    console.error("❌ Error al publicar delivery-deleted en Kafka:", error);
  }
}

module.exports = {
  connectProducer,
  publishDeliveryDeleted,
};
