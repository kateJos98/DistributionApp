const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/authMiddleware");
const { updateDeliveryData } = require("../services/deliveryService");


router.put("/:id", validateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const updateData = req.body;
    console.log("🧾 Body recibido:", updateData);
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Datos de actualización vacíos" });
    }

    const delivery = await updateDeliveryData(id, updateData);

    if (!delivery) {
      return res.status(404).json({ error: "Repartidor no encontrado" });
    }

    res.json({ message: "Repartidor actualizado", delivery });

  } catch (err) {
    console.error("❌ Error al actualizar repartidor:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
