import React, { useEffect, useState } from "react";
import axios from "axios";

const BuscarRepartidor = () => {
  const [repartidores, setRepartidores] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8050/find-deliverers")
      .then((res) => setRepartidores(res.data))
      .catch((err) => console.error("Error cargando repartidores:", err));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Repartidores Cercanos</h2>
      {repartidores.length === 0 ? (
        <p>No hay repartidores disponibles</p>
      ) : (
        <ul className="space-y-4">
          {repartidores.map((rep, idx) => (
            <li key={idx} className="p-4 bg-gray-100 rounded shadow flex justify-between items-center">
              <div>
                <p><strong>Nombre:</strong> {rep.nombre}</p>
                <p><strong>Distancia:</strong> {rep.distancia_km.toFixed(2)} km</p>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Solicitar Tanque
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BuscarRepartidor;
