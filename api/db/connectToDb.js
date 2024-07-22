require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL || "";

const connectToMongoDb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB successfully");
  } catch (error) {
    console.log("Failed to connect to database ", error.message);
  }
};

module.exports = { connectToMongoDb };
