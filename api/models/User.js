const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  email: String,
  firstName: String,
  lastName: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);
