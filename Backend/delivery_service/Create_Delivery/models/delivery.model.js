const db = require("../config/db");

async function createDelivery(data) {
  const { full_name, email, password, phone, dni, vehicle_plate, working_zone } = data;

  const exists = await db.query("SELECT 1 FROM deliveries WHERE email = $1", [email]);
  if (exists.rows.length > 0) {
    throw new Error("El email ya está registrado");
  }
  
  const query = `
    INSERT INTO deliveries (full_name, email, password, phone, dni, vehicle_plate, working_zone)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [full_name, email, password, phone, dni, vehicle_plate, working_zone];

  const result = await db.query(query, values);
  return result.rows[0];
}

module.exports = { createDelivery };
