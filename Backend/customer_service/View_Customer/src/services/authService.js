const axios = require("axios");

async function validateToken(token) {
  try {
    const url = process.env.AUTH_SERVICE_URL || "http://authorization-service:8002/validate-role";
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // debe contener { email, role, ... }
  } catch (err) {
    console.error("❌ Error validando token:", err.message);
    return null;
  }
}

module.exports = { validateToken };
