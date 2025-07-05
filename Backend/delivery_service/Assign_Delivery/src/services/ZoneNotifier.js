export class ZoneNotifier {
  constructor(webSocketServer) {
    this.wss = webSocketServer;
  }

  async notifyZoneAssigned(driverId, zoneId) {
    const payload = JSON.stringify({
      event: 'zone_assigned',
      data: { driverId, zoneId }
    });

    this.wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(payload);
      }
    });
  }
}
