import axios from 'axios';

const API_URL = 'http://localhost:8003';
const API_KEY = 'OMpqVWAH.UC80wyXTtPwhDgAUdCTx6';

export const registerCustomer = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/create-customer`, data, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    throw error.response?.data || { error: 'Error al registrar cliente' };
  }
};
