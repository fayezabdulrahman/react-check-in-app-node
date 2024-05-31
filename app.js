import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to DB successfully");
  })
  .catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
