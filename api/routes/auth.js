const express = require("express");
const tokenService = require("../../archive/auth-token-service.js");
const router = express.Router();
const authController = require("../controllers/authController.js");

// handle post request for registration
router.post("/register", authController.registerUser);

router.post("/users", authController.fetchUser);

module.exports = router;
