import { pool } from '../config/db.js';

export async function getDriverData(driverId) {
  const [rows] = await pool.query('SELECT * FROM drivers WHERE id = ?', [driverId]);
  return rows[0];
}
