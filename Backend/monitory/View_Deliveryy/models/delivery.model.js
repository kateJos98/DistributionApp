const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function getDeliveriesByEmail(email) {
  const query = 'SELECT * FROM deliveries WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows;
}

module.exports = {
  getDeliveriesByEmail,
};
