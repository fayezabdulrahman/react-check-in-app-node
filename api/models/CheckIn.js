const mongoose = require("mongoose");
const questionSchema = require("./Question");

const checkInSchema = new mongoose.Schema(
  {
    checkInId: {
      type: String,
      required: true,
      unique: true
    },
    createdBy: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
  }
);

module.exports = mongoose.model("CheckIn", checkInSchema);
