const db = require("../config/db");

async function deleteDelivery(id) {
  const findQuery = `SELECT * FROM deliveries WHERE id = $1;`;
  const findResult = await db.query(findQuery, [id]);

  if (findResult.rows.length === 0) return null; // No existe repartidor

  const delivery = findResult.rows[0];

  // Luego eliminarlo
  const deleteQuery = `DELETE FROM deliveries WHERE id = $1;`;
  await db.query(deleteQuery, [id]);

  return delivery; // Retornamos datos antes de borrar para usar en Kafka
}

module.exports = { deleteDelivery };