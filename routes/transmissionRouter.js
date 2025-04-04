const express = require("express");
const router = express.Router();

const { getTransmissions, getTransmission, deleteTransmission, sendTransmission } = require("../controllers/transmissionController");

// GET 요청 시 getTransmissions 실행
router.get("/", getTransmissions);

// GET 요청 시 단일 정보 조회
router.get("/:id", getTransmission);

// DELETE 요청 시 전송 정보 삭제
router.delete("/:id", deleteTransmission);

// 전송 기능 등록
router.post("/:id/send", sendTransmission);

module.exports = router;