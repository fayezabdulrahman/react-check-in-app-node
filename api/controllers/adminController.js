const CheckIn = require("../models/CheckIn");
const validationSchema = require("../util/validationSchema");
const CheckInResponse = require("../models/CheckInResponse");
const logger = require('../logger/logger');

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

const searchForPublishedCheckIn = async (req, res) => {
  try {
    // Query to find the document that has published is true
    const publishedCheckin = await CheckIn.findOne({ published: true });

    console.log('published check in from backend ', publishedCheckin);

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
};

const getAllCheckIn = async (req, res) => {
  try {
    // query all documents in our CheckIn collection
    const allCheckin = await CheckIn.find().select("-_id"); // exclude ID

    logger.info("Retreving all check-ins");

    res.status(200).send({
      message: "Checks-ins retrieved successfully",
      checkIns: allCheckin,
    });
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

    logger.info("Unpublishing previously published check-in");
    // unpublish previously published check-in
    await CheckIn.updateMany({ published: true }, { published: false });

    // publish new check-in selected from admin
    logger.info("Publishing selected Check-in ", checkInToPublish);
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
        { checkInId: checkInToEdit.checkInId, questions: checkInToEdit.questions},
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
      { published: true },
      { published: false },
      { new: true } // This option ensures the updated document is returned
    ).select("-_id"); // exclude ID;

    console.log('result of unpublishing check-in ', result);

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

const getCheckInAnalytics = async (req, res) => {
  try {
    // i will have check in id passed
    const { checkInId } = req.query;
    
    console.log('checkInId to get analytics for ', checkInId);
    if (!checkInId) {
      return res.status(400).send({ message: "Check-in is required" });
    }
    const checkIn = await CheckIn.findOne({ checkInId: checkInId });

    if (!checkIn) {
      return res.status(404).send({ message: "CheckIn not found" });
    }

    // Count the number of unique users who submitted responses for the specific CheckIn
    //It uses distinct to get the unique submittedBy user IDs for responses to the specific CheckIn and counts them.
    const uniqueUserResponsesCount = await CheckInResponse.distinct("submittedBy", { checkInId: checkIn._id });

    // const questions = await CheckInResponse.find(
    //   { checkInId: checkIn._id },
    //   { answers: 1, _id: 0 }
    // ).populate("submittedBy", "firstName lastName -_id");

    // res.status(200).send({
    //   message: "Check-in anayltics results successful",
    //   count: uniqueUserResponsesCount.length,
    //   questions,
    // });


    const responses = await CheckInResponse.find(
      { checkInId: checkIn._id },
      { answers: 1, _id: 0 }
    ).populate("submittedBy", "firstName lastName -_id");

    console.log('responses ', responses);

    res.status(200).send({
      message: "Check-in anayltics results successful",
      count: uniqueUserResponsesCount.length,
      responses,
    });
  } catch (error) {
    res.status(500).send({ message: "count error", error: error.message });
  }
};

module.exports = {
  createCheckIn,
  searchForPublishedCheckIn,
  getAllCheckIn,
  publishCheckIn,
  updateCheckIn,
  deleteCheckIn,
  unPublishCheckIn,
  getCheckInAnalytics,
};
