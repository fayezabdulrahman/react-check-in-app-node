const express = require("express");
const tokenService = require("../services/auth-token-service");
const router = express.Router();
const authController = require('../controllers/authController.js');

// handle post request for registration
router.post("/register", authController.registerUser);

// handle post request for login
router.post("/login", authController.loginUser);

// handle get request for refreshing token
router.get("/refreshToken", authController.refreshUserToken);

// handle post request for logging out
router.post("/logout", authController.logoutUser);

// handle get request for checking if user is authenticated
router.get("/me", tokenService.verifyToken, authController.whoAmI);


module.exports = router;
