const express = require("express");
const healthController = require("../controllers/healthController");

const router = express.Router();

// handle health checks
router.get("/health", healthController.healthEndpoint);

module.exports = router;
