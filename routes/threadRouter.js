const express = require("express");
const router = express.Router();

const { sendFiles, startScheduledTransmission, stopScheduledTransmission, getAllTransmissionJobs } = require("../controllers/threadController");


router.post("/send", sendFiles);
router.post("/schedule-send", startScheduledTransmission);
router.post("/stop-schedule", stopScheduledTransmission);

router.get("/jobs", getAllTransmissionJobs);

module.exports = router;