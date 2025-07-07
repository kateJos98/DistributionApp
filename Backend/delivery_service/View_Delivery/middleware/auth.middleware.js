const axios = require("axios");
const config = require("../config");

async function validateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const response = await axios.get(config.authorizationService, {
      headers: { Authorization: token },
    });

    const { email, role } = response.data;
    if (!role || role.toLowerCase() !== "repartidor") {
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

    req.user = { email, role };
    next();
  } catch (err) {
    console.error("❌ Error al validar token:", err.message);
    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = { validateToken };
