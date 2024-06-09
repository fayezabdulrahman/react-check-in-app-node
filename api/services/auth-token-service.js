const jwt = require("jsonwebtoken");
require("dotenv").config();

const createToken = (user) => {
  // create new object to which will be used when decoded on front-end
  const userInfo = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  const token = jwt.sign(userInfo, process.env.TOKEN_SECRET_KEY, {
    expiresIn: "15m",
  });
  return token;
};

const createRefreshToken = (user) => {
  const userInfo = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  const refreshToken = jwt.sign(
    userInfo,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "20m" }
  );
  return refreshToken;
};

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.header("Authorization");

  // if we have auth header
  if (!authorizationHeader) return res.status(401).send({ message: "Access denied!" });

  const token = authorizationHeader.includes("Bearer");


  if (!token) return res.status(401).send({ message: "Access denied!!!!!" });
  try {
    const extractedToken = authorizationHeader.split(" ")[1];

    const user = jwt.verify(extractedToken, process.env.TOKEN_SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { createToken, verifyToken, createRefreshToken };
