const cors = require("cors");
const config = require("./index");

const corsOptions = {
  origin: config.corsOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
