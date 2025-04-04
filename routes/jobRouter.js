const express = require("express");
const router = express.Router();
const { saveJsonData, getAllJsonData } = require("../controllers/jsonDataController");

router.post("/send", saveJsonData);
router.get("/all", getAllJsonData);

module.exports = router;