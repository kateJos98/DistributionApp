require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { getCustomer } = require("./controllers/customerController");

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 8005;

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization", "api-key"],
  exposedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/view-customer", getCustomer);

app.listen(PORT, () => {
  console.log(`✅ View_Customer corriendo en puerto ${PORT}`);
});
