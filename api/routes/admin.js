const express = require("express");
const adminController = require('../controllers/adminController');

const router = express.Router();

// handle post request for creating a check-in
router.post("/createCheckin", adminController.createCheckIn);

// handle post request for publishing a check-in
router.post("/publishCheckIn", adminController.publishCheckIn);

// handle post request for updating a check-in
router.post("/updateCheckIn", adminController.updateCheckIn);

// handle post request for deleting a check-in
router.post("/deleteCheckIn", adminController.deleteCheckIn);

// handle post request for unpublishing a check-in
router.post("/unPublishCheckIn", adminController.unPublishCheckIn);

// handle get request for retrieving all check ins with their responses
router.get("/allCheckinsWithResponses", adminController.getAllCheckInsWithResponses);


module.exports = router;
