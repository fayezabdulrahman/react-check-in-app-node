const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

// handle post request for registration
router.post("/register", authController.registerUser);

// handle post request for fetching users
router.post("/users", authController.fetchUser);

module.exports = router;
