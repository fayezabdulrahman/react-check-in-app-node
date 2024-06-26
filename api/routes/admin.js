const express = require("express");
const CheckIn = require("../models/CheckIn");
const validationSchema = require("../util/validationSchema");
const CheckInResponse = require("../models/CheckInResponse");
const User = require("../models/User");

const router = express.Router();

// Router to create a check-in
router.post("/createCheckin", async (req, res) => {
  try {
    console.log("request", req.body);
    const checkIn = await validationSchema.checkInValidation.validate(req.body);

    const saveNewCheckIn = new CheckIn({
      checkInId: checkIn.checkInId,
      createdBy: checkIn.createdBy,
      published: checkIn.published,
      questions: checkIn.questions,
    });

    // save checkIn to db
    await saveNewCheckIn.save();
    res.status(200).send({ message: "Created Checkin succesfully" });
  } catch (error) {
    res.status(500).send({ message: error.message, error: error });
  }
});

// Route to get the latest check-in
router.get("/publishedCheckin", async (req, res) => {
  try {
    // Query to find the document where isLatestCheckIn is true
    const publishedCheckin = await CheckIn.findOne({ published: true });

    if (publishedCheckin) {
      res.status(200).send({
        message: "Published check-in available",
        checkIn: publishedCheckin,
      });
    } else {
      res
        .status(200)
        .send({ message: "No published check-in found", checkIn: null });
    }
  } catch (error) {
    res.status(500).send({ message: error.message, error: error });
  }
});

// get all checkins
router.get("/allCheckins", async (req, res) => {
  try {
    // Query to find the document where isLatestCheckIn is true
    const allCheckin = await CheckIn.find().select("-_id"); // exclude ID

    res.status(200).send({
      message: "Checks-ins retrieved successfully",
      checkIns: allCheckin,
    });
  } catch (error) {
    res.status(500).send({ message: error.message, error: error });
  }
});

router.post("/publishCheckIn", async (req, res) => {
  try {
    const { checkInToPublish } = req.body;

    // unpublish previously published check-in
    await CheckIn.updateMany({ published: true }, { published: false });
    // publish new check-in selected from admin
    const result = await CheckIn.findOneAndUpdate(
      { checkInId: checkInToPublish },
      { published: true },
      { new: true } // This option ensures the updated document is returned
    ).select("-_id"); // exclude ID;

    if (result) {
      res
        .status(200)
        .send({ message: "Check-in published successfully", checkIn: result });
    } else {
      res
        .status(200)
        .send({ message: "Check-in could not be pubslished", error: result });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      messagae: "An error occured while publishing check-in",
      error: error,
    });
  }
});

router.post("/updateCheckIn", async (req, res) => {
  try {
    const checkInToEdit = req.body;
    const result = await CheckIn.findOneAndUpdate(
      { checkInId: checkInToEdit.checkInId },
      { questions: checkInToEdit.questions },
      { new: true } // This option ensures the updated document is returned
    ).select("-_id"); // exclude ID;
    res
      .status(200)
      .send({ message: "updated check-in successfully", checkIn: result });
  } catch (error) {
    res.status(500).send({
      messagae: "An error occured while updating check-in",
      error: error,
    });
  }
});

router.post("/checkInAnayltics", async (req, res) => {
  try {
    // i will haave check in id passed
    const { checkInId } = req.body;
    const checkIn = await CheckIn.findOne({ checkInId: checkInId });

    if (!checkIn) {
      return res.status(404).send({ message: "CheckIn not found" });
    }

    const responsesCaptured = await CheckInResponse.countDocuments({});
    const questions = await CheckInResponse.find(
      { checkInId: checkIn._id },
      { answers: 1, _id: 0 }
    ).populate("submittedBy", "firstName lastName");

    res.status(200).send({
      message: "count success",
      count: responsesCaptured,
      questions,
    });
  } catch (error) {
    res.status(500).send({ message: "count error", error: error.message });
  }
});

module.exports = router;
