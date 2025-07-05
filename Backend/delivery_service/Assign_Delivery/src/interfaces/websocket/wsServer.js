import { WebSocketServer } from 'ws';

export function createWebSocketServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('🌐 Cliente conectado al WebSocket de assign-delivery');

    // Opcional: escucha mensajes del cliente
    ws.on('message', (message) => {
      console.log('📩 Mensaje recibido:', message.toString());
    });

    // Opcional: mensaje de bienvenida
    ws.send('Bienvenido al WebSocket de assign-delivery');
  });

  return wss;
}
