import axios from 'axios';

const API_URL = 'http://localhost:8003';

export const registerCustomer = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/create-customer`, data, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': 'OMpqVWAH.UC80wyXTtPwhDgAUdCTx6',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    throw error.response?.data || { error: 'Error al registrar cliente' };
  }
};
export const getCustomerInfo = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'api-key': API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener info del cliente:", error);
    throw error.response?.data || { error: 'No se pudo obtener información' };
  }
};