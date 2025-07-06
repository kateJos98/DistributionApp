import http from 'http';
import app from './app.js';
import { setupWebSocket } from './socket/websocket.js';

const server = http.createServer(app);
setupWebSocket(server);

const PORT = process.env.PORT || 8011;
server.listen(PORT, () => {
  console.log(`🚀 find-delivery escuchando en http://localhost:${PORT}`);
});
