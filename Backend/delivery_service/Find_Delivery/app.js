import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/api.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

export default app;
