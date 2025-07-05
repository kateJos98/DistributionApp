import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const UbicacionCliente = () => {
  const [position, setPosition] = useState([-0.2299, -78.5249]); // [lat, lng]

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  const guardarUbicacion = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/update-location',
        { lat: position[0], lng: position[1] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Ubicación guardada!');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Selecciona tu ubicación</h2>
      <div className="h-[400px] mb-4">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={position} draggable={true}>
            <Popup>Arrástrame para ajustar</Popup>
          </Marker>
          <MapClickHandler />
        </MapContainer>
      </div>
      <button
        onClick={guardarUbicacion}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar Ubicación
      </button>
    </div>
  );
};

export default UbicacionCliente;