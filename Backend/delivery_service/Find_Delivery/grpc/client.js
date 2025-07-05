import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
dotenv.config();

const PROTO_PATH = './proto/location.proto'; // o la ruta relativa correcta

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const zoneProto = grpc.loadPackageDefinition(packageDefinition);

const grpcClient = new zoneProto.ZoneService(
  process.env.LOCATION_SERVICE_URL,
  grpc.credentials.createInsecure()
);

export default grpcClient;
