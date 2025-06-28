const db = require("../services/db");
const { validateToken } = require("../services/authService");

async function getCustomer(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token requerido" });

  const token = authHeader.replace("Bearer ", "");
  const authData = await validateToken(token);
  if (!authData || !authData.email)
    return res.status(403).json({ error: "Token inválido" });

  try {
    const [rows] = await db.execute(
      "SELECT username, email, full_name, phone, city, address, lat, lng FROM customers WHERE email = ?",
      [authData.email]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Cliente no encontrado" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al consultar datos" });
  }
}

module.exports = { getCustomer };
