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
    description: {
      type: String,
      default: ''
    },
    componentType: {
      type: String,
      enum: ["text", "select", "radio", "textarea", "multiselect"],
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
