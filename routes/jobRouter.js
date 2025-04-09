const express = require("express");
const router = express.Router();
const { saveJsonToTable, getAllJsonData } = require("../controllers/jsonDataController");

router.post("/send", saveJsonToTable);
router.get("/all", getAllJsonData);

module.exports = router;