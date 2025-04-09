const express = require("express");
const router = express.Router();

const { getTableNames } = require("../controllers/tableController");

router.get("/names", getTableNames);

module.exports = router;