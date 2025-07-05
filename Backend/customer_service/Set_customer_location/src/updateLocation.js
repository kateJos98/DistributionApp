import axios from 'axios';
import { db } from './db.js';

export async function updateLocation(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const { lat, lng } = req.body;

  if (!token || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Faltan datos o token' });
  }

  try {
    const response = await axios.get(process.env.AUTH_SERVICE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const email = response.data.email;
    if (!email) return res.status(403).json({ error: 'Token inválido' });

    const [result] = await db.execute(
      'UPDATE customers SET lat = ?, lng = ? WHERE email = ?',
      [lat, lng, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    return res.json({ message: 'Ubicación actualizada' });

  } catch (err) {
    return res.status(500).json({ error: 'Error al actualizar ubicación', detail: err.message });
  }
}
