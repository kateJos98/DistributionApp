const { createDelivery } = require("../models/delivery.model");
const { publishDeliveryCreated } = require("../kafka/producer");

async function registerDelivery(data) {
  const delivery = await createDelivery(data);
  await publishDeliveryCreated(delivery);
  return delivery;
}

module.exports = { registerDelivery };