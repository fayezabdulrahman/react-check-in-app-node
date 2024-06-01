const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (user) => {
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.TOKEN_SECRET_KEY,
    {}
  );
  return token;
};

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send({ message: "Access denied!" });
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { createToken, verifyToken };
