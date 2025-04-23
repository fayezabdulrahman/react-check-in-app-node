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
      .send({ message: "Successfully Submitted Check-in", answered: true });
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

    // Get all published check-ins
    const publishedCheckIns = await CheckIn.find({ published: true });

    if (!publishedCheckIns || publishedCheckIns.length === 0) {
      return res.status(200).send({
        message: "No Published Check-ins found",
        submitted: [],
        availableToSubmit: [],
      });
    }

    const publishedCheckInIds = publishedCheckIns.map((checkIn) => checkIn._id);

    console.log("publishedCheckInIds ", publishedCheckInIds);

    // Find all responses by the user for published check-ins
    const userResponses = await CheckInResponse.find({
      submittedBy: userInRequest._id,
      checkInId: { $in: publishedCheckInIds },
      answered: true,
    });

    console.log("user responses ", userResponses);

    const submittedCheckInIds = userResponses.map((response) =>
      response.checkInId.toString()
    );

    console.log("submittedCheckInIds ", submittedCheckInIds);

    // Combine submitted check-ins with user answers + createdAt
    const submitted = publishedCheckIns
      .filter((checkIn) => submittedCheckInIds.includes(checkIn._id.toString()))
      .map((checkIn) => {
        const matchingResponse = userResponses.find(
          (res) => res.checkInId.toString() === checkIn._id.toString()
        );
        return {
          checkIn,
          response: matchingResponse?.answers,
          createdAt: matchingResponse?.createdAt,
        };
      });

    const availableToSubmit = publishedCheckIns.filter(
      (checkIn) => !submittedCheckInIds.includes(checkIn._id.toString())
    );

    res.status(200).send({
      message: "Successfully retrieved Check-ins for user",
      submitted,
      availableToSubmit,
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

    const allSubmittedCheckIns = await CheckInResponse.find({
      submittedBy: userInRequest._id,
    })
      .select("createdAt checkInId answers")
      .populate("checkInId", "-_id -createdBy -published -__v");

    console.log("all submitted checkins ", allSubmittedCheckIns);

    // Transform the response to match the desired structure
    const transformedCheckIns = allSubmittedCheckIns.map((checkIn) => ({
      _id: checkIn._id,
      data: {
        checkInId: checkIn.checkInId.checkInId,
        answers: checkIn.answers,
        questions: checkIn.checkInId.questions,
      },
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
  getAllSubmittedCheckIns,
};
