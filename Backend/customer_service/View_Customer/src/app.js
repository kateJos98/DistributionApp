require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getCustomer } = require("./controllers/customerController");

const app = express();
const PORT = process.env.PORT || 8020;

app.use(cors()); // <- Aquí habilitas CORS
app.use(express.json());

app.get("/view-customer", getCustomer);

app.listen(PORT, () => {
  console.log(`✅ View_Customer corriendo en puerto ${PORT}`);
});
