const { deleteDelivery } = require("../models/deleteDeliveryModel");
const { publishDeliveryDeleted } = require("../kafka/producer");

async function deleteDeliveryData(id) {
  const delivery = await deleteDelivery(id);
  if (!delivery) return null;

  // Publicar evento Kafka para auth-service
  await publishDeliveryDeleted({
    email: delivery.email,
    username: delivery.full_name,
  });

  return delivery;
}

module.exports = { deleteDeliveryData };
