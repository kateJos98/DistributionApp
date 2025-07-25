import axios from 'axios';
import { CustomerService } from '../Services/customer.service.js';
import { sendCustomerDeletedEvent } from '../kafka/producer.js';


export class CustomerController {
  static async handleDelete(req, res) {
    try {
      
      let token = req.cookies?.access_token;
      console.log('Cookies recibidas:', req.cookies);
      if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
      }

      const { data } = await axios.get(
        process.env.AUTH_SERVICE_URL,
        { headers: { Authorization: `Bearer ${token}` } }
        
      );

      const email = data.email;
      const role = data.role;

      if (!email || (role !== 'admin' && req.body.email !== email)) {
        return res.status(403).json({ error: 'No autorizado para eliminar este usuario' });
      }

      const service = new CustomerService();
      const deleted = await service.deleteCustomer(req.body.email);

      if (deleted) {
        await sendCustomerDeletedEvent(req.body.email);
        res.json({ message: 'Usuario eliminado correctamente' });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }

    } catch (error) {
      console.error('❌ Error al eliminar usuario:', {
        message: error.message,
        response: error?.response?.data,
        stack: error.stack
      });
      res.status(500).json({ error: 'Error interno al eliminar' });
    }
  }
}


