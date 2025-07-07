const express = require('express');
const cors = require('cors');
require('dotenv').config();

const deliveryRoutes = require('./routes/delivery.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/delivery', deliveryRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚚 View-Delivery service running on port ${PORT}`);
});
