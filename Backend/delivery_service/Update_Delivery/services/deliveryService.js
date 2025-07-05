const db = require("../config/db");
const { updateDelivery } = require("../models/deliveryModel");
const { publishDeliveryUpdated } = require("../kafka/producer");

async function updateDeliveryData(id, data) {
  

  const updated = await updateDelivery(id, data);
  
  if (!updated) return null;

  await publishDeliveryUpdated({
    email_anterior: updated.email, // 👈 necesario para buscar en auth
    update: {
      username: updated.full_name,
    },
  });

  return updated;
}

module.exports = { updateDeliveryData };
