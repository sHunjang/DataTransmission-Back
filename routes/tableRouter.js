const express = require("express");
const router = express.Router();

const { getTableData, getTableNames } = require("../controllers/tableController");

router.get("/names", getTableNames);
router.get("/:tableName", getTableData);

module.exports = router;