require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  corsOrigin: process.env.CORS_ORIGIN,
  authorizationService: process.env.AUTHORIZATION_SERVICE,
};
