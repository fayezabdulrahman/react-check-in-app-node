const express = require("express");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

router.post('/notify', notificationController.sendToAll);
router.post('/notification/subscribe', notificationController.saveSubscription);
router.post('/notification/unsubscribe', notificationController.deleteSubscription)


module.exports = router;
