const db = require("../config/db");

async function updateDelivery(id, data) {
  console.log("📥 Data recibida en updateDelivery:", data);

  const requiredFields = ["full_name", "phone", "dni", "vehicle_plate", "working_zone"];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`El campo '${field}' es obligatorio.`);
    }
  }

  const { full_name, phone, dni, vehicle_plate, working_zone } = data;

  console.log("✅ Campos validados:");
  console.log({ full_name, phone, dni, vehicle_plate, working_zone });

  const query = `
    UPDATE deliveries
    SET full_name = $1, phone = $2, dni = $3, vehicle_plate = $4, working_zone = $5
    WHERE id = $6
    RETURNING *;
  `;

  try {
    const result = await db.query(query, [
      full_name,
      phone,
      dni,
      vehicle_plate,
      working_zone,
      id
    ]);

    return result.rows[0];
  } catch (err) {
    console.error("❌ Error al actualizar la base de datos:", err);
    throw new Error("Error al actualizar el repartidor");
  }
}

module.exports = { updateDelivery };
