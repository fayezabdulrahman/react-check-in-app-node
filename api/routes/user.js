const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// handle post request to create check-in
router.post("/submitCheckIn", userController.submitCheckIn);

// handle get request to get answered check in for the user
router.get("/answeredCheckIn", userController.getAnsweredCheckIn);

module.exports = router;
