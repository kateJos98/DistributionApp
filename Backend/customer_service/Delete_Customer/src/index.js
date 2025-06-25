import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { CustomerController } from './Controllers/Customer.controller.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.delete('/delete-customer', CustomerController.handleDelete);

const PORT = process.env.PORT || 8004;
app.listen(PORT, () => {
  console.log(`🚀 Delete-Customer corriendo en puerto ${PORT}`);
});