const express = require("express");
const authRoute = require("./api/routes/auth.js");
const adminRoute = require("./api/routes/admin.js");
const userRoute = require("./api/routes/user.js");
const healthRoute = require("./api/routes/health.js");
const notificationRoute = require("./api/routes/notifiaction.js");

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const auth0TokenService = require("./api/services/auth0-service.js");
const db = require("./api/db/connectToDb");
const logger = require('./api/logger/logger.js');
require("dotenv").config();

const PORT = process.env.PORT || 9000;
const SERVER_PREFIX = '/api'
const corsOriginUrl = process.env.CORS_ORIGIN_URL || 'http://localhost:3000';

// apply middleware to api
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow CORS
const corsOptions = {
  origin: corsOriginUrl,
  credentials: true,
};
app.use(cors(corsOptions));

// apply our app routes
app.use(`${SERVER_PREFIX}/auth`, auth0TokenService.verifyToken, authRoute);

app.use(`${SERVER_PREFIX}/admin`, auth0TokenService.verifyToken, adminRoute);
app.use(`${SERVER_PREFIX}/user`, auth0TokenService.verifyToken, auth0TokenService.validateUser, userRoute);

// notification
app.use(`${SERVER_PREFIX}/admin`,auth0TokenService.validateUser,  notificationRoute);

// non protected route
app.use(`${SERVER_PREFIX}`, healthRoute);

// run application
app.listen(PORT, () => {
  db.connectToMongoDb();
  logger.info(`Server is running on port ${PORT}`);
});
