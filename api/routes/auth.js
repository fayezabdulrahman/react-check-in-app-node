const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const auth0TokenService = require("../services/auth0-service.js");


// handle post request for registration
router.post("/register", authController.registerUser);

// handle post request for fetching users
router.post("/users", authController.fetchUser);

// handle post request for updating user details
router.post("/user/update", auth0TokenService.validateUser, authController.updateUser);

module.exports = router;
