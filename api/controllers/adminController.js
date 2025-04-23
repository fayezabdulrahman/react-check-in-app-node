const CheckIn = require("../models/CheckIn");
const validationSchema = require("../util/validationSchema");
const CheckInResponse = require("../models/CheckInResponse");
const logger = require("../logger/logger");

const createCheckIn = async (req, res) => {
  try {
    // validate checkIn
    const checkIn = await validationSchema.checkInValidation.validate(req.body);

    logger.info(`Creating checkIn  ${JSON.stringify(checkIn)}`);
    const saveNewCheckIn = new CheckIn({
      checkInId: checkIn.checkInId,
      createdBy: checkIn.createdBy,
      published: checkIn.published,
      questions: checkIn.questions,
    });

    // save checkIn to db
    await saveNewCheckIn.save();
    res.status(200).send({ message: "Created Check-in succesfully" });
  } catch (error) {
    res.status(500).send({ message: error.message, error: error });
  }
};

const publishCheckIn = async (req, res) => {
  try {
    // get the check-in from the request body
    const { checkInToPublish } = req.body;

    if (!checkInToPublish) {
      res.status(400).send({ message: "Check-in is required" });
    }

    // publish new check-in selected from admin
    logger.info("Publishing selected Check-in ", checkInToPublish);
    const result = await CheckIn.findOneAndUpdate(
      { checkInId: checkInToPublish },
      { published: true },
      { new: true } // This option ensures the updated document is returned
    );

    if (result) {
      res.status(200).send({
        message: "Check-in Published Successfully",
        checkIn: result.toObject(),
      });
    } else {
      res
        .status(200)
        .send({ message: "Check-in could not be pubslished", error: result });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      messagae: "An error occured while publishing check-in",
      error: error.message,
    });
  }
};

const updateCheckIn = async (req, res) => {
  try {
    // get the check-in from the request body
    const { originalCheckInId, checkInToEdit } = req.body;
    logger.info("checkIntoEdit", checkInToEdit);
    if (!originalCheckInId || !checkInToEdit) {
      res
        .status(400)
        .send({ message: "Check-in and original check-in ID are required" });
    }

    // Find the existing check-in using the original ID
    const existingCheckIn = await CheckIn.findOne({
      checkInId: originalCheckInId,
    });

    if (!existingCheckIn) {
      return res.status(404).send({ message: "Check-in not found" });
    }

    let result;

    if (existingCheckIn.checkInId === checkInToEdit.checkInId) {
      result = await CheckIn.findOneAndUpdate(
        { checkInId: checkInToEdit.checkInId },
        { questions: checkInToEdit.questions },
        { new: true } // This option ensures the updated document is returned
      ).select("-_id"); // exclude ID;
    } else {
      result = await CheckIn.findOneAndUpdate(
        { checkInId: originalCheckInId },
        {
          checkInId: checkInToEdit.checkInId,
          questions: checkInToEdit.questions,
        },
        { new: true } // This option ensures the updated document is returned
      ).select("-_id"); // exclude ID;
    }

    if (result) {
      res
        .status(200)
        .send({ message: "Check-in updated successfully", checkIn: result });
    } else {
      res
        .status(200)
        .send({ message: "Check-in could not be updated", error: result });
    }
  } catch (error) {
    res.status(500).send({
      messagae: "An error occured while updating check-in",
      error: error.message,
    });
  }
};

const deleteCheckIn = async (req, res) => {
  try {
    // get the check-in from the request body
    const { checkInToDelete } = req.body;
    logger.info("Deleting the following check-in ", checkInToDelete);
    if (!checkInToDelete) {
      return res.status(400).send({ message: "Check-in is required" });
    }

    await CheckIn.findOneAndDelete({ checkInId: checkInToDelete });

    res.status(200).send({ message: "Check-in Deleted Successfully" });
  } catch (error) {
    res.status(500).send({
      messagae: "An error occured while deleting check-in",
      error: error,
    });
  }
};

const unPublishCheckIn = async (req, res) => {
  try {
    // get the check-in from the request body
    const { checkInToUnpublish } = req.body;

    if (!checkInToUnpublish) {
      return res.status(400).send({ message: "Check-in is required" });
    }

    logger.info("Unpublishing check-in ", checkInToUnpublish);
    const result = await CheckIn.findOneAndUpdate(
      { checkInId: checkInToUnpublish },
      { published: false },
      { new: true } // This option ensures the updated document is returned
    ).select("-_id"); // exclude ID;

    if (result) {
      res.status(200).send({
        message: "Check-in Unpublished Successfully",
        checkIn: result,
      });
    } else {
      res
        .status(200)
        .send({ message: "Check-in could not be Unpublished", error: result });
    }
  } catch (error) {
    res.status(500).send({
      messagae: "An error occured while Unpublishing Check-in",
      error: error,
    });
  }
};

const getAllCheckInsWithResponses = async (req, res) => {
  try {
    // Step 1: Get all check-ins
    const allCheckIns = await CheckIn.find();

    // Step 2: Loop through each check-in and attach responses
    const checkInsWithResponses = await Promise.all(
      allCheckIns.map(async (checkIn) => {
        const responses = await CheckInResponse.find(
          { checkInId: checkIn._id },
          { answers: 1, _id: 0 }
        ).populate("submittedBy", "firstName lastName -_id");

        const uniqueUserIds = await CheckInResponse.distinct("submittedBy", {
          checkInId: checkIn._id,
        });

        return {
          ...checkIn.toObject(),
          responseCount: uniqueUserIds.length,
          responses,
        };
      })
    );

    res.status(200).send({
      message: "All check-ins with responses retrieved successfully",
      checkIns: checkInsWithResponses,
    });
  } catch (error) {
    console.error("Error getting check-ins with responses", error);
    res.status(500).send({
      message: "Something went wrong fetching check-ins",
      error: error.message,
    });
  }
};

module.exports = {
  createCheckIn,
  publishCheckIn,
  updateCheckIn,
  deleteCheckIn,
  unPublishCheckIn,
  getAllCheckInsWithResponses,
};
