const express = require("express");
const router = express.Router();

const { saveJsonData, getAllJsonData, deleteJsonData, saveJsonToTable, getTableNames, getPaginatedJsonData, getAllJsonLogs, sendAndDeleteJsonData } = require("../controllers/jsonDataController");
const { sendToSelectedTable } = require("../controllers/jsonSendController");

// JSON 데이터 저장
router.post("/upload", saveJsonData);

// 저장된 JSON 전체 조회
router.get("/all", getAllJsonData);

router.delete("/:id", deleteJsonData);

router.post("/upload-to-table", saveJsonToTable);

router.get("/table-names", getTableNames);

router.post("/send-to-table", sendToSelectedTable);

router.post("/save/:tableName", saveJsonToTable);

router.get("/paginated", getPaginatedJsonData);

router.get("/json/logs", getAllJsonLogs);

router.post("/send-delete", sendAndDeleteJsonData);

module.exports = router;