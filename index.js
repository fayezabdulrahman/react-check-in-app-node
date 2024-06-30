const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./api/routes/auth.js");
const protectedRoute = require("./api/routes/hello.js");
const adminRoute = require("./api/routes/admin.js");
const userRoute = require("./api/routes/user.js");
const chatRoute = require('./api/routes/chat.js');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const tokenService = require("./api/services/auth-token-service.js");
require("dotenv").config();

const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL || "";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to DB successfully");

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    // allow CORS
    let corsOptions = {
      origin: "http://localhost:5173",
      credentials: true,
    };
    app.use(cors(corsOptions));
    // app.use((req, res, next) => {
    //   res.header("Access-Control-Allow-Origin", "*");
    //   res.header(
    //     "Access-Control-Allow-Headers",
    //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    //   );

    //   if (req.method === "OPTIONS") {
    //     res.header(
    //       "Access-Control-Allow-Methods",
    //       "PUT, POST, PATCH, DELETE, GET"
    //     );
    //     return res.status(200).json({});
    //   }
    //   next();
    // });

    app.use("/", authRoute);
    app.use("/protected", protectedRoute);
    app.use("/admin", tokenService.verifyToken, adminRoute);
    app.use("/user", tokenService.verifyToken, userRoute);
    app.use("/chats", tokenService.verifyToken, chatRoute);

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(error));
