import express from 'express';
import { getNearbyDrivers } from '../controllers/deliveryController.js';
const router = express.Router();

router.get('/drivers/nearby', getNearbyDrivers);

export default router;
