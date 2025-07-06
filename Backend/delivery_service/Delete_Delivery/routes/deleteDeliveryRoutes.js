const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/authMiddleware.js");
const { deleteDeliveryData } = require("../services/deleteDeliveryService");

router.delete("/:id", validateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const delivery = await deleteDeliveryData(id);
    if (!delivery) return res.status(404).json({ error: "Repartidor no encontrado" });

    res.json({ message: "Repartidor eliminado", delivery });
  } catch (err) {
    console.error("❌ Error al eliminar repartidor:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
