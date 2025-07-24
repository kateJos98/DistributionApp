import axios from 'axios';

const API_URL = 'http://localhost:8003'; //create-customer |
const UPDL_API = 'http://localhost:8006'; // update-location-customer
const VIEW_API = 'http://localhost:8005'; // view-customer
const DEL_API = 'http://localhost:8004'; // delete-customer
const UPDC_API = 'http://localhost:8010'; // update-customer


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

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const getCustomer = async () => {
  try {
    const res = await axios.get(`${VIEW_API}/view-customer`, authHeader());
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Error al obtener datos del cliente" };
  }
};

export const updateCustomer = async (data) => {
  const res = await axios.post(`${UPDC_API}/update-customer`, data, authHeader());
  return res.data;
};

export const updateLocation = async (lat, lng) => {
  const res = await axios.post(`${UPDL_API}/update-location`, { lat, lng }, authHeader());
  return res.data;
};
export const deleteCustomer = async () => {
  const res = await axios.delete(`${DEL_API}/delete-customer`, authHeader());
  return res.data;
};