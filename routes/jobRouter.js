const express = require("express");
const router = express.Router();
const { saveJsonToTable, getAllJsonData, deleteJsonData_SendDB } = require("../controllers/jsonDataController");

router.post("/send", saveJsonToTable);
router.get("/all", getAllJsonData);
router.delete("/:id", deleteJsonData_SendDB);

module.exports = router;