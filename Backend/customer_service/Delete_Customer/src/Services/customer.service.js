
import { pool } from '../config/database.js';

export class CustomerService {
  async deleteCustomer(email) {
    const [rows] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
    if (rows.length === 0) return false;

    await pool.query('DELETE FROM customers WHERE email = ?', [email]);
    return true;
  }
}
