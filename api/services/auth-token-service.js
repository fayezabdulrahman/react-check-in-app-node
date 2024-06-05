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
    expiresIn: "1h",
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
    { expiresIn: "1d" }
  );
  return refreshToken;
};

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: "Access denied!" });
  try {
    const decodedUser = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = decodedUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { createToken, verifyToken, createRefreshToken };
