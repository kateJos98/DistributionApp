const express = require("express");
const router = express.Router();
const { getOwnProfile } = require("../controllers/delivery.controller");
const { validateToken } = require("../middleware/auth.middleware");

router.get("/profile", validateToken, getOwnProfile);

module.exports = router;
