import React from "react";
import { useCustomerInfo } from '@hooks/useCustomerInfo';

const PerfilCliente = () => {
  const { customer, loading, error } = useCustomerInfo();

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Información del Cliente</h2>
      <ul className="space-y-2">
        <li><strong>Nombre:</strong> {customer.full_name}</li>
        <li><strong>Email:</strong> {customer.email}</li>
        <li><strong>Teléfono:</strong> {customer.phone}</li>
        <li><strong>Ciudad:</strong> {customer.city}</li>
        <li><strong>Dirección:</strong> {customer.address}</li>
      </ul>
    </div>
  );
};

export default PerfilCliente;
