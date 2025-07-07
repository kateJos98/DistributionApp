const express = require("express");
const corsMiddleware = require("./config/cors.config");
const config = require("./config");

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Rutas
const deliveryRoutes = require("./routes/delivery.routes");
app.use("/delivery", deliveryRoutes);

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`🚚 View-Delivery corriendo en puerto ${config.port} - ${process.env.NODE_ENV}`);
});

console.log("ENV:", process.env);
