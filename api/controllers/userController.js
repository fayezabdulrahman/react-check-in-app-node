const User = require("../models/User");
const CheckIn = require("../models/CheckIn");
const CheckInResponse = require("../models/CheckInResponse");
const submitCheckIn = async (req, res) => {
  try {
    const { checkInId, submittedBy, answers } = req.body;

    const firstName = submittedBy.split(" ")[0];
    const lastName = submittedBy.split(" ")[1];

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
      return res.status(404).send({ message: "Check-in not found" });
    }

    const newCheckInResponse = new CheckInResponse({
      checkInId: checkIn,
      submittedBy: user,
      answers: answers,
      answered: true,
    });

    await newCheckInResponse.save();

    res
      .status(201)
      .send({ message: "Successfully submitted check-in", answered: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error while submitting checkIn", answered: false });
  }
};

const getAnsweredCheckIn = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).send({ message: "User id is null or undefined" });
    }

    // Find the user
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send({ message: "User not found " });
    }

    // Find the currently published check-in
    const publishedCheckIn = await CheckIn.findOne({ published: true });

    const existingCheckIn = await CheckInResponse.findOne({
      submittedBy: user._id,
      checkInId: publishedCheckIn._id,
      answered: true,
    });
    res.status(200).send({
      message: "You already have submitted the latest checkIn",
      existingCheckIn: existingCheckIn,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
      message: "Error retrieving your check-in response",
    });
  }
};

const getAllSubmittedCheckIns = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).send({ message: "User id is null or undefined" });
    }
  
    // Find the user
    const user = await User.findOne({ _id: userId });
  
    if (!user) {
      return res.status(404).send({ message: "User not found " });
    }

    const allSubmittedCheckIns = await CheckInResponse.find({ submittedBy: userId })
    .select("createdAt checkInId")
    .populate("checkInId", "-_id -createdBy -published -questions -__v");

    res.status(200).send({
      submittedCheckIns: allSubmittedCheckIns,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
      message: "Error retrieving your submitted check-ins",
    });
  }

};

module.exports = {
  getAnsweredCheckIn,
  submitCheckIn,
  getAllSubmittedCheckIns
};
