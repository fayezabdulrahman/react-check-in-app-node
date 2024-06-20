const express = require("express");
const CheckIn = require("../models/Checkin");
const validationSchema = require("../util/validationSchema");

const tokenService = require("../services/auth-token-service");
const router = express.Router();

// Router to create a check-in
router.post("/createCheckin", tokenService.verifyToken, async (req, res) => {
  try {
    console.log("request", req.body);
    const checkIn = await validationSchema.checkInValidation.validate(req.body);

    // If the new check-in should be the latest, update others to not be latest
    // if (checkIn.isLatestCheckIn) {
    //   await CheckIn.updateMany(
    //     { isLatestCheckIn: true },
    //     { $set: { isLatestCheckIn: false } }
    //   );
    // }

    const saveNewCheckIn = new CheckIn({
      checkInId: checkIn.checkInId,
      isLatestCheckIn: checkIn.isLatestCheckIn,
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
      res
        .status(200)
        .send({ message: "Published check-in available", checkIn: publishedCheckin });
    } else {
      res.status(200).send({ message: "No published check-in found", checkIn: null});
    }
  } catch (error) {
    res.status(500).send({ message: error.message, error: error });
  }
});

module.exports = router;
