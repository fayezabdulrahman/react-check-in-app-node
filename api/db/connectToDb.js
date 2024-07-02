require("dotenv").config();
const mongoose = require("mongoose");

const connectToMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB successfully");
  } catch (error) {
    console.log("Failed to connect to database ", error.message);
  }
};

module.exports = { connectToMongoDb };
