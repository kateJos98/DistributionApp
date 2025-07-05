const axios = require("axios");

async function validateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const response = await axios.get(
      process.env.AUTHORIZATION_SERVICE,
      {
        headers: {
        Authorization: token  
        }
      }
    );

    const { email, role } = response.data;

    console.log("🔐 Validación de token OK:", response.data);

    
    req.user = { email, role };

    if (!role || role.toLowerCase() !== "repartidor") {
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

    next();
  } catch (err) {
    console.error("❌ Error al validar token:", err.message);
    return res.status(500).json({ error: "Error al validar token" });
  }
}

module.exports = { validateToken };