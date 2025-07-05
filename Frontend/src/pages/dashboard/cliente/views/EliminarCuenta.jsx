import React from 'react';
import { deleteCustomer } from '../services/customerService';

export default function EliminarCuenta() {
  const handleDelete = async () => {
    const confirm = window.confirm('¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirm) {
      try {
        await deleteCustomer();
        alert('Cuenta eliminada');
        localStorage.clear();
        window.location.href = '/';
      } catch (err) {
        alert('Error al eliminar: ' + err.response?.data?.error);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Eliminar cuenta
    </button>
  );
}
