import { redisClient, pool } from '../config/db.js';

export async function findNearbyDrivers(lat, lng, radius = 5000) {
  const redisData = await redisClient.hGetAll('driver:locations');
  const drivers = [];

  for (const [driverId, loc] of Object.entries(redisData)) {
    const [dLat, dLng] = loc.split(',').map(Number);
    const distance = haversineDistance(lat, lng, dLat, dLng);
    if (distance < radius) {
      drivers.push({ driverId, lat: dLat, lng: dLng, distance });
    }
  }

  drivers.sort((a, b) => a.distance - b.distance);
  return drivers.slice(0, 10);
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
