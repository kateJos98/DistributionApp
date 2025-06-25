import React, { useEffect, useState } from "react";
//import { getCustomerInfo } from "../services/customerService";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function ClienteDashboard() {
  const [cliente, setCliente] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      const data = await getCustomerInfo(); // debe devolver info del cliente por su token
      setCliente(data);
    };

    fetchCliente();
  }, []);

  useEffect(() => {
    if (cliente && cliente.lat && cliente.lng) {
      const map = L.map("map").setView([cliente.lat, cliente.lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      L.marker([cliente.lat, cliente.lng]).addTo(map)
        .bindPopup("Tu ubicación")
        .openPopup();
    }
  }, [cliente]);

  const handleEdit = () => navigate("/editar-cliente");
  const handleDelete = () => {
    // llamar a API para eliminar
    alert("Cuenta eliminada");
  };
  const handleBuscarRepartidor = () => {
    navigate("/buscar-repartidor");
  };

  if (!cliente) return <p>Cargando...</p>;

  return (
    <div className="min-h-screen bg-blue-100">
      <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Panel del Cliente</h1>
        <div className="space-x-4">
          <button onClick={handleEdit}>Editar</button>
          <button onClick={handleDelete}>Eliminar</button>
          <button onClick={handleBuscarRepartidor}>Buscar Repartidor</button>
          <button onClick={() => navigate("/")}>Cerrar sesión</button>
        </div>
      </header>

      <main className="p-6">
        <h2 className="text-lg font-semibold mb-4">Tu Información</h2>
        <ul className="mb-4 bg-white p-4 rounded shadow">
          <li><strong>Usuario:</strong> {cliente.username}</li>
          <li><strong>Email:</strong> {cliente.email}</li>
          <li><strong>Nombre:</strong> {cliente.full_name}</li>
          <li><strong>Teléfono:</strong> {cliente.phone}</li>
          <li><strong>Ciudad:</strong> {cliente.city}</li>
          <li><strong>Dirección:</strong> {cliente.address}</li>
        </ul>

        <div id="map" className="w-full h-96 rounded shadow" />
      </main>
    </div>
  );
}
