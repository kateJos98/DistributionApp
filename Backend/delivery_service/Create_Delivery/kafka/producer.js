const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();

async function connectProducer(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await producer.connect();
      console.log("✅ Producer conectado a Kafka");
      return;
    } catch (err) {
      console.error(`⏳ Intento ${i + 1} de conexión a Kafka fallido:`, err.message);
      await new Promise((res) => setTimeout(res, 3000)); // espera 3s
    }
  }
  throw new Error("❌ No se pudo conectar con Kafka después de varios intentos");
}

async function publishDeliveryCreated(delivery) {
  await producer.send({
    topic: process.env.KAFKA_TOPIC_DELIVERY_CREATE,
    messages: [
      {
        value: JSON.stringify({
          email: delivery.email,
          password: delivery.password,
          username: delivery.full_name,
          role: "repartidor"
        })
      }
    ]
  });
}

module.exports = { connectProducer, publishDeliveryCreated };
