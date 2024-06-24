const mongoose = require("mongoose");
const User = require('../models/User');
const CheckIn = require('../models/CheckIn');

const answerSchema = new mongoose.Schema(
  {
    questionLabel: {
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

const questionResponseSchema = new mongoose.Schema(
  {
    checkInId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CheckIn',
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionResponse", questionResponseSchema);
