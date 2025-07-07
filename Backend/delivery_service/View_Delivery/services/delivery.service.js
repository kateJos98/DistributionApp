const db = require("../db");

async function getDeliveryByEmail(email) {
  const result = await db.query(
    `SELECT id, full_name, email, phone, dni, vehicle_plate, working_zone,
            latitude, longitude, created_at
     FROM deliveries
     WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

module.exports = { getDeliveryByEmail };
