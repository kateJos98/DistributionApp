const express = require("express");
require("dotenv").config();
const { connectProducer } = require("./kafka/producer");


const deliveryRoutes = require("./routes/deleteDeliveryRoutes");

const app = express();
app.use(express.json());

app.use("/delete-delivery", deliveryRoutes);

const PORT = process.env.PORT;
app.listen(PORT, async() => {
  console.log(`🚚 Update-Delivery service on port ${PORT}`);

  try {
    await connectProducer();
  } catch (error) {
    console.error("❌ Error al conectar con Kafka Producer:", error);
  }
});
