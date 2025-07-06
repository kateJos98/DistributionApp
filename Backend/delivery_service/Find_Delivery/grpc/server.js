import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { findNearbyDrivers } from '../services/deliveryService.js';

const packageDefinition = protoLoader.loadSync('proto/location.proto');
const proto = grpc.loadPackageDefinition(packageDefinition).location;

function GetNearbyDrivers(call, callback) {
  const { lat, lng, radius } = call.request;
  findNearbyDrivers(lat, lng, radius || 5000)
    .then(drivers => callback(null, { drivers }))
    .catch(err => callback(err, null));
}

const server = new grpc.Server();
server.addService(proto.LocationService.service, { GetNearbyDrivers });

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('🟢 gRPC server running on port 50051');
  server.start();
});
