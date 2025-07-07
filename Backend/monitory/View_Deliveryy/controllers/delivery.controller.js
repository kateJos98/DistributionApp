const { getDeliveriesByEmail } = require('../models/delivery.model');

const viewDeliveries = async (req, res) => {
  const { email } = req.user;

  try {
    const deliveries = await getDeliveriesByEmail(email);
    res.status(200).json(deliveries);
  } catch (error) {
    console.error("❌ Error al obtener entregas:", error.message);
    res.status(500).json({ error: "Error al obtener entregas" });
  }
};

module.exports = {
  viewDeliveries,
};
