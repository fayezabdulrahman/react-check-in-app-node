const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  role: {
    type: String,
    default: 'user'
  }
});

module.exports = mongoose.model("User", userSchema);
