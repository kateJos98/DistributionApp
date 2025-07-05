import { WebSocketServer } from 'ws';

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', ws => {
    console.log('🧩 Cliente WebSocket conectado');

    ws.on('message', message => {
      const data = JSON.parse(message);
      console.log('📨 Mensaje WS recibido:', data);
    });

    ws.send(JSON.stringify({ event: 'connected', message: 'WebSocket activo' }));
  });
}
