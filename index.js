const express = require("express");
const authRoute = require("./api/routes/auth.js");
const adminRoute = require("./api/routes/admin.js");
const userRoute = require("./api/routes/user.js");
const chatRoute = require("./api/routes/chat.js");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const tokenService = require("./api/services/auth-token-service.js");
const db = require("../react-check-in-app-node/api/db/connectToDb");
const logger = require('./api/logger/logger.js');
require("dotenv").config();

const PORT = process.env.PORT || 9000;

// apply middleware to api
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow CORS
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// apply our app routes
app.use("/auth", authRoute);
app.use("/admin", tokenService.verifyToken, adminRoute);
app.use("/user", tokenService.verifyToken, userRoute);
app.use("/chats", tokenService.verifyToken, chatRoute);

// run application
app.listen(PORT, () => {
  db.connectToMongoDb();
  logger.info(`Server is running on port ${PORT}`);
});
