const deliveryService = require("../services/delivery.service");

async function getOwnProfile(req, res) {
  try {
    const email = req.user.email;
    const delivery = await deliveryService.getDeliveryByEmail(email);

    if (!delivery) {
      return res.status(404).json({ error: "Repartidor no encontrado" });
    }

    res.json(delivery);
  } catch (error) {
    console.error("❌ Error al obtener perfil:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = { getOwnProfile };
