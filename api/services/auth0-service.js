const { auth } = require("express-oauth2-jwt-bearer");
const User = require("../models/User");
require("dotenv").config();

// Middleware to verify JWT from Auth0
const verifyToken = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
  algorithms: ["RS256"],
});

// Middleware to validate Auth0Id from frontend
const validateUser = async (req, res, next) => {
  const userId = req.headers["x-user-id"]; // Extract the user ID from the headers

  if (!userId) {
    return res.status(401).json({ message: "X-User-ID is required" });
  }

  // Check if the user exists in the database
  const user = await User.findOne({ auth0Id: userId });

  if (!user) {
    return res.status(401).json({ message: "User not found or unauthorized" });
  }

  // Attach the user to the request object for use in subsequent middleware/routes
  req.user = user;
  next();
};

module.exports = { verifyToken, validateUser };
