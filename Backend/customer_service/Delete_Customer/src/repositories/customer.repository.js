export class CustomerRepository {
  constructor(db) {
    this.db = db;
  }

  async deleteByEmail(email) {
    const [result] = await this.db.execute(
      'DELETE FROM customers WHERE email = ?',
      [email]
    );
    return result.affectedRows > 0;
  }
}
