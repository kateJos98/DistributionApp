const axios = require("axios");

async function validateToken(token) {
  try {
    const res = await axios.get(process.env.AUTH_SERVICE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return null;
  }
}

module.exports = { validateToken };
