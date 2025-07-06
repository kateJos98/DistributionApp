import dotenv from 'dotenv';
import http from 'http';
import express from 'express';
import { redisClient } from './config/redis.js';  // Redis ya conectado
import { RedisZoneRepository } from './repositories/RedisZoneRepository.js';
import { AssignZoneUseCase } from './core/AssignZoneUseCase.js';
import { ZoneNotifier } from './services/ZoneNotifier.js';
import { createWebSocketServer } from './interfaces/websocket/wsServer.js';
import { startGrpcServer } from './interfaces/grpc/server.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8012;

// Endpoint HTTP para prueba de salud
app.get('/', (_, res) => res.send('🟢 assign-delivery funcionando'));

async function startAssignDelivery() {
  try {
    // No vuelvas a llamar redisClient.connect() aquí

    console.log('🧠 Redis ya conectado (importado desde config)');

    // Inicializar WebSocket
    const wss = createWebSocketServer(server);

    // Inyección de dependencias y servicios
    const redisRepo = new RedisZoneRepository(redisClient);
    const notifier = new ZoneNotifier(wss);
    const assignZoneUseCase = new AssignZoneUseCase(redisRepo, notifier);

    // Iniciar servidor gRPC
    startGrpcServer(assignZoneUseCase);

    // Iniciar servidor HTTP + WebSocket
    server.listen(PORT, () => {
      console.log(`🚀 assign-delivery escuchando en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar assign-delivery:', error);
    process.exit(1);
  }
}

startAssignDelivery();
