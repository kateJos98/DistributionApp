export class RedisZoneRepository {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  async assign(driverId, zoneId) {
    await this.redis.hSet('driver:zones', driverId, zoneId);
  }
}
