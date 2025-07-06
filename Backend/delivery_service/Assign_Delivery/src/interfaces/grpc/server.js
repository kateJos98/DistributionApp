import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = path.join(__dirname, 'proto/zone.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition);

export function startGrpcServer(assignZoneUseCase) {
  const server = new grpc.Server();

  server.addService(proto.ZoneService.service, {
    Assign: async (call, callback) => {
      const { driverId, zoneId } = call.request;
      const result = await assignZoneUseCase.execute(driverId, zoneId);
      callback(null, { message: `Zona asignada a repartidor ${result.driverId}` });
    }
  });

  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('🚀 Servidor gRPC de assign-delivery escuchando en puerto 50051');
  });
}
