const express = require("express");
require("dotenv").config();
const deliveryRoutes = require("./routes/delivery.routes");
const { connectProducer } = require("./kafka/producer");


const app = express();

app.use(express.json());
app.use("/Create-Delivery", deliveryRoutes);

connectProducer().catch(console.error);

const PORT = process.env.PORT || 8007;
app.listen(PORT, () => {
  console.log(`🚚 Create-Delivery service on port ${PORT}`);
});
