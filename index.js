const express = require("express");
const authRoute = require("./api/routes/auth.js");
const adminRoute = require("./api/routes/admin.js");
const userRoute = require("./api/routes/user.js");
const healthRoute = require("./api/routes/health.js");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const tokenService = require("./api/services/auth-token-service.js");
const db = require("./api/db/connectToDb");
const logger = require('./api/logger/logger.js');
require("dotenv").config();

const PORT = process.env.PORT || 9000;
const SERVER_PREFIX = '/api'

// apply middleware to api
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow CORS
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// apply our app routes
app.use(`${SERVER_PREFIX}/auth`, authRoute);
app.use(`${SERVER_PREFIX}/admin`, tokenService.verifyToken, adminRoute);
app.use(`${SERVER_PREFIX}/user`, tokenService.verifyToken, userRoute);
app.use(`${SERVER_PREFIX}`, healthRoute);

// run application
app.listen(PORT, () => {
  db.connectToMongoDb();
  logger.info(`Server is running on porttt ${PORT}`);
});
