const express = require("express");
const User = require("../models/User");
const CheckIn = require("../models/CheckIn");
const CheckInResponse = require("../models/CheckInResponse");

const router = express.Router();

router.post("/submitCheckIn", async (req, res) => {
  try {
    console.log("request", req.body);
    const { checkInId, submittedBy, answers } = req.body;

    const firstName = submittedBy.split(" ")[0];
    const lastName = submittedBy.split(" ")[1];

    console.log("first name", firstName);
    console.log("last name", lastName);
    console.log("answers", answers);

    // Find the user by username
    const user = await User.findOne({
      firstName: firstName,
      lastName: lastName,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Find the check-in by ID
    const checkIn = await CheckIn.findOne({ checkInId: checkInId });
    if (!checkIn) {
      return res.status(404).send({ message: "CheckIn not found" });
    }

    const newCheckInResponse = new CheckInResponse({
      checkInId: checkIn,
      submittedBy: user,
      answers: answers,
      answered: true,
    });

    console.log("new questino Response to save, ", newCheckInResponse);

    await newCheckInResponse.save();

    res
      .status(201)
      .send({ message: "successfully submitted checkIn", answered: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "error while submitting checkIn", answered: false });
  }
});

router.get("/questionResponses", async (req, res) => {
  try {
    const checkInResponses = await CheckInResponse.find()
      .populate("submittedBy", "firstName lastName")
      .populate("checkInId", "checkInId")
      .exec();
    res.status(200).send({ message: "success", response: checkInResponses });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post("/answeredCheckIn", async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).send({ message: 'Missing firstName or lastName' });
    }

    // Find the user by firstName and lastName
    const user = await User.findOne({ firstName, lastName });

    if (!user) {
      return res.status(404).send({ message: 'User not found ' });
    }

    const existingCheckIn = await CheckInResponse.findOne({
      submittedBy: user._id,
      answered: true
    });
    res
      .status(200)
      .send({ message: "You already have submitted the latest checkIn", existingCheckIn: existingCheckIn });
  } catch (error) {
    res.status(500).send({ error: error.message, message: "Error retrieving your check-in response"});
  }
});
module.exports = router;
