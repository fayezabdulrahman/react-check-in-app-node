require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL || "";
const logger = require('../logger/logger.js');
logger.info(`MONGO URL ${MONGO_URL}`);

const connectToMongoDb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    logger.info("Connected to DB successfully")
  } catch (error) {
    logger.error(`Failed to connect to database ${error}`);
  }
};

module.exports = { connectToMongoDb };
