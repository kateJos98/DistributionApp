const express = require("express");
const { registerDelivery } = require("../services/delivery.service");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const delivery = await registerDelivery(req.body);
    res.status(201).json({ message: "Repartidor creado", delivery });
  } catch (error) {
    console.error("❌ Error al registrar repartidor:", error.message); // ✅ Uso correcto del nombre
    res.status(500).json({ error: "Error al registrar el repartidor" });
  }
});

module.exports = router;
