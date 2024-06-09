const express = require("express");

const tokenService = require("../services/auth-token-service");
const router = express.Router();

router.get("/", tokenService.verifyToken, (req, res) => {
  try {
    console.log('request', req);
    res.status(200).send("protected route");
  } catch (error) {
    console.log('error in protected route')
  }
});

module.exports = router;
