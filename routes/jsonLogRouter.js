// routes/jsonLogRouter.js

const express = require("express");
const router = express.Router();
const { getAllJsonLogs } = require("../controllers/jsonLogController");

router.get("/", getAllJsonLogs);

module.exports = router;