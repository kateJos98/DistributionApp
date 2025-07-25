const db = require("../services/db");
const { validateToken } = require("../services/authService");

async function getCustomer(req, res) {
  try {
    // Obtener token desde cookie o Authorization header
    let token = req.cookies?.access_token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Token requerido" });
    }

    // Validar JWT con microservicio de autorización
    const authData = await validateToken(token);
    if (!authData || !authData.email) {
      return res.status(403).json({ error: "Token inválido o sin email" });
    }

    // Consulta SQL
    const [rows] = await db.execute(
      `SELECT username, email, full_name, phone, city, address, lat, lng 
       FROM customers WHERE email = ?`,
      [authData.email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("❌ Error en DB:", err);
    res.status(500).json({ error: "Error al consultar datos del cliente" });
  }
}

module.exports = { getCustomer };
