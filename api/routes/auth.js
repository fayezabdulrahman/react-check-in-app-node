const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validationSchema = require("../util/validationSchema");
const router = express.Router();

const handlError = (error, res, alternative) => {
  if (error?.message) return res.status(400).send(error.message);
  res.status(500).send(alternative);
};

const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email }).exec();
  } catch (error) {
    return null;
  }
};
// handle post request for registration
router.post("/register", async (req, res) => {
  try {
    const user = await validationSchema.registrationValidation.validate(
      req.body
    );
    const userExists = await getUserByEmail(user.email);
    if (userExists) return res.status(409).send("Email is already registered!");

    const hashedPass = await bcrypt.hash(user.password, 10);

    const saveNewUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: hashedPass,
    });

    // save user to db
    await saveNewUser.save();
    return res.status(201).send("User registered successfully!");
  } catch (error) {
    handlError(error, res, "Unable to register user");
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await validationSchema.loginValidation.validate(req.body);
    const userExists = await getUserByEmail(user.email);
    if (!userExists) return res.status(422).send("Invalid email!");

    const isValidPass = bcrypt.compare(user.password, userExists.password);

    if (!isValidPass) return res.status(422).send("Invalid password");

    res.status(200).send("Login successful");
  } catch (error) {
    handlError(error, res, "Unable to login user");
  }
});

module.exports = router;
