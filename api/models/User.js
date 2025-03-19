const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  firstName: String,
  lastName: String,
  auth0Id: String,
  roles: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("User", userSchema);
