import { findNearbyDrivers } from '../services/deliveryService.js';
import grpcClient from '../grpc/client.js';
import { pool } from '../config/db.js';  // conexión PostgreSQL

// Función para validar si repartidor existe en PostgreSQL
function assignZoneGrpc(driverId, zoneId) {
  return new Promise((resolve, reject) => {
    grpcClient.Assign({ driverId, zoneId }, (err, response) => {
      if (err) reject(err);
      else resolve(response.message);
    });
  });
}

export async function getNearbyDrivers(req, res) {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng) return res.status(400).json({ error: 'Faltan coordenadas' });

  try {
    const drivers = await findNearbyDrivers(
      parseFloat(lat),
      parseFloat(lng),
      parseInt(radius || 5000)
    );

    if (drivers.length > 0) {
      const exists = await driverExists(drivers[0].driverId);
      if (exists) {
        try {
          const msg = await assignZoneGrpc(drivers[0].driverId, 'zona-quito-sur');
          console.log('✅ Zona asignada vía gRPC:', msg);
        } catch (err) {
          console.error('❌ Error al asignar zona por gRPC:', err.message);
        }
      } else {
        console.warn(`⚠️ Repartidor con ID ${drivers[0].driverId} no existe en la base de datos.`);
      }
    }

    res.json({ drivers });
  } catch (error) {
    console.error('Error en getNearbyDrivers:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}