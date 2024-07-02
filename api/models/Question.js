const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: Number
    },
    label: {
      type: String,
      required: true,
    },
    componentType: {
      type: String,
      enum: ["text", "select", "radio", "textarea"],
      default: "text",
    },
    selectOptions: {
      type: [String],
      default: [],
    },
    radioOptions: {
      type: [String],
      default: [],
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

module.exports = questionSchema;
