const express = require("express");
const adminController = require('../controllers/adminController');

const router = express.Router();

// handle post request for creating a check-in
router.post("/createCheckin", adminController.createCheckIn);

// handke post request for retrieving published check-in
router.get("/publishedCheckin", adminController.searchForPublishedCheckIn);

// handle get request to retrieve all check-ins
router.get("/allCheckins", adminController.getAllCheckIn);

// handle post request for publishing a check-in
router.post("/publishCheckIn", adminController.publishCheckIn);

// handle post request for updating a check-in
router.post("/updateCheckIn", adminController.updateCheckIn);

// handle post request for deleting a check-in
router.post("/deleteCheckIn", adminController.deleteCheckIn);

// handle post request for unpublishing a check-in
router.post("/unPublishCheckIn", adminController.unPublishCheckIn);

// handle post request for getting analytics result for a check-in
router.post("/checkInAnayltics", adminController.getCheckInAnalytics);

module.exports = router;
