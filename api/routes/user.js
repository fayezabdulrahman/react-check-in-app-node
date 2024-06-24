const express = require("express");
const User = require("../models/User");
const CheckIn = require("../models/CheckIn");
const QuestionResponse = require("../models/QuestionResponse");

const router = express.Router();

router.post("/submitCheckIn", async (req, res) => {
  try {
    console.log("request", req.body);
    const { checkInId, submittedBy, answers } = req.body;

    const firstName = submittedBy.split(' ')[0];
    const lastName = submittedBy.split(' ')[1];

    console.log('first name', firstName);
    console.log('last name', lastName);


    // Find the user by username
    const user = await User.findOne({ firstName: firstName, lastName: lastName} );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Find the check-in by ID
    const checkIn = await CheckIn.findOne({checkInId: checkInId});
    if (!checkIn) {
      return res.status(404).send({ message: "CheckIn not found" });
    }

    const newQuestionResponse = new QuestionResponse({
      checkInId: checkIn,
      submittedBy: user,
      answers,
    });

    console.log('new questino Response to save, ', newQuestionResponse);

    await newQuestionResponse.save();

    res.status(201).send({ message: "successfully submitted checkIn" });
  } catch (error) {
    res.status(500).send({ message: "error while submitting checkIn" });
  }
});

router.get('/questionResponses', async (req, res) => {
    try {
      const questionResponses = await QuestionResponse.find()
        .populate('submittedBy' , 'firstName lastName').select("-_id")
        .populate('checkInId' , 'checkInId').select("-_id")
        .exec();
      res.status(200).send({message: "success", response: questionResponses});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
module.exports = router;
