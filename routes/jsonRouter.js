// routes/jsonRouter.js
const express = require("express");
const router = express.Router();

const jsonDataController = require("../controllers/jsonDataController");

router.post("/save/:tableName", jsonDataController.saveJsonToTable);
router.post("/send-and-delete", jsonDataController.sendAndDeleteJsonData);
router.get("/all", jsonDataController.getAllJsonData);
router.get("/paged", jsonDataController.getPaginatedJsonData);
router.delete("/:id", jsonDataController.deleteJsonData);
router.get("/logs", jsonDataController.getAllJsonLogs);

module.exports = router;