const mongoose = require("mongoose");
const User = require("./User");
const CheckIn = require("./CheckIn");

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const checkInResponseSchema = new mongoose.Schema(
  {
    checkInId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CheckIn",
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answered: {
      type: Boolean,
      default: false,
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CheckInResponse", checkInResponseSchema);
