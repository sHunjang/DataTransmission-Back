const express = require("express");
const { fetchAllLogs, fetchLogsByTransmissionId } = require("../controllers/transmissionLogController");
const router = express.Router();


router.get("/", fetchAllLogs);

router.get("/:transmissionId", fetchLogsByTransmissionId);

module.exports = router;