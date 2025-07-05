const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({
  clientId: 'update-delivery-producer',
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


async function publishDeliveryUpdated({ email_anterior, update }) {
  try {
    await producer.send({
      topic: "delivery_updated", // ✅ nombre correcto del tópico
      messages: [
        {
          value: JSON.stringify({
            email_anterior,
            update,
          }),
        },
      ],
    });

    console.log(`📤 Mensaje publicado a Kafka (delivery_updated):`, { email_anterior, update });
  } catch (error) {
    console.error("❌ Error al publicar en Kafka:", error);
  }
}

module.exports = {
  connectProducer,
  publishDeliveryUpdated,
};
