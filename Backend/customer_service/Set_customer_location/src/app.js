import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { updateLocation } from './updateLocation.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/set-location', updateLocation);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`📍 set-customer-location activo en puerto ${PORT}`);
});