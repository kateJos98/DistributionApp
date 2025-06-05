import axios from 'axios';

const API_URL = 'https://TU_DOMINIO_O_IP_API/login'; // Reemplaza con tu endpoint real

export const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};
