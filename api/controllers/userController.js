const User = require("../models/User");
const CheckIn = require("../models/CheckIn");
const CheckInResponse = require("../models/CheckInResponse");
const submitCheckIn = async (req, res) => {
  try {
    const { checkInId, answers } = req.body;
    const userInRequest = req.user;

    // Find the check-in by ID
    const checkIn = await CheckIn.findOne({ checkInId: checkInId });
    if (!checkIn) {
      return res.status(404).send({ message: "Check-in not found" });
    }

    const newCheckInResponse = new CheckInResponse({
      checkInId: checkIn,
      submittedBy: userInRequest,
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
    const userInRequest = req.user;

    // Find the currently published check-in
    const publishedCheckIn = await CheckIn.findOne({ published: true });

    if (!publishedCheckIn) {
      return res.status(200).send({ message: "No Published Check-ins found", checkIn: null  });
    }

    const existingCheckIn = await CheckInResponse.findOne({
      submittedBy: userInRequest._id,
      checkInId: publishedCheckIn._id,
      answered: true,
    });

    let message;

    if (!existingCheckIn) {
      message = "Check-in available to submit";
    } else {
      message = "You already have submitted the latest checkIn";
    }
    res.status(200).send({
      message: message,
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
    const userInRequest = req.user;

    const allSubmittedCheckIns = await CheckInResponse.find({ submittedBy: userInRequest._id })
    .select("createdAt checkInId answers")
    .populate("checkInId", "-_id -createdBy -published -__v");

    console.log('all submitted checkins ', allSubmittedCheckIns);

    // Transform the response to match the desired structure
    const transformedCheckIns = allSubmittedCheckIns.map((checkIn) => ({
      _id: checkIn._id,
      data: { checkInId: checkIn.checkInId.checkInId, answers: checkIn.answers, questions: checkIn.checkInId.questions },
      createdAt: checkIn.createdAt,
    }));


    res.status(200).send({
      submittedCheckIns: transformedCheckIns,
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
