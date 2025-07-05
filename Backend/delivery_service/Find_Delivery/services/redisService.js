import { redisClient } from '../config/db.js';

export async function getDriverLocation(driverId) {
  const loc = await redisClient.hGet('driver:locations', driverId);
  if (!loc) return null;
  const [lat, lng] = loc.split(',').map(Number);
  return { lat, lng };
}

export async function setDriverLocation(driverId, lat, lng) {
  await redisClient.hSet('driver:locations', driverId, `${lat},${lng}`);
}
