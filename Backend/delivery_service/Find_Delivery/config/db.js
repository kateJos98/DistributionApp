import { createClient } from 'redis';
import pg from 'pg';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import dotenv from 'dotenv';
dotenv.config();

// PostgreSQL
const pool = new pg.Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT
});

// Redis
const redisClient = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });
await redisClient.connect();

// gRPC Cliente
const packageDefinition = protoLoader.loadSync('proto/location.proto');
const locationProto = grpc.loadPackageDefinition(packageDefinition).location;

const grpcClient = new locationProto.LocationService(
  process.env.LOCATION_SERVICE_URL,
  grpc.credentials.createInsecure()
);

export { pool, redisClient, grpcClient };
