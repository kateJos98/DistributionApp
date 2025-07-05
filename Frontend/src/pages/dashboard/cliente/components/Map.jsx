// components/Map.jsx
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'

export default function Map({ position, onPositionChange }) {
  const handleClick = (e) => {
    onPositionChange([e.latlng.lat, e.latlng.lng]);
  };

  return (
    <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} draggable={true}>
        <Popup>Tu ubicación seleccionada</Popup>
      </Marker>
      <MapClickHandler onClick={handleClick} />
    </MapContainer>
  );
}

function MapClickHandler({ onClick }) {
  useMapEvents({
    click: onClick,
  });
  return null;
}

