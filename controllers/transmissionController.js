const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const { getAllTransmissions, getTransmissionById, deleteTransmissionById, updateTransmissionStatus } = require("../models/transmissionModel");
const { saveTransmissionLog } = require("../models/transmissionLogModel");

// 요청 시 DB에서 목록 조회
const getTransmissions = async (req, res) => {
    try {
        const transmissions = await getAllTransmissions();
        res.status(200).json(transmissions);
    } catch (error) {
        res.status(500).json({ error: '조회 실패' });
    }
};

// ID 단일 조회
const getTransmission = async (req, res) => {
    try {
        const id = req.params.id;
        const transmission = await getTransmissionById(id);

        if (!transmission) {
            return res.status(404).json({ message: '해당 ID의 정보가 없음..' });
        }

        res.status(200).json(transmission);

    } catch (error) {
        console.error('단일 정보 조회 오류:', error);
        res.status(500).json({ error: '단일 조회 실패' });
    }
};

// 전송 정보 삭제
const deleteTransmission = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteId = await deleteTransmissionById(id);

        if (!deleteId) {
            return res.status(404).json({ message: '해당 ID의 정보 없음..' });
        }

        res.status(200).json({
            message: `ID ${id} 전송 정보 삭제 완료`,
            deleteId,
        });

    } catch (error) {
        console.error('정보 삭제 오류: ', error);
        res.status(500).json({ message: '전송 정보 삭제 실패' });
    }
};

// 파일 전송
const sendTransmission = async (req, res) => {
    try {
        const id = req.params.id;
        const transmission = await getTransmissionById(id);

        if (!transmission) {
            return res.status(404).json({ message: '해당 ID 정보 없음..' });
        }

        const filePath = transmission.filepath;
        const fileName = transmission.filename;

        // 실제 파일 존재 여부 확인
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: '파일 존재하지 않음..' });
        }

        // 중복 전송 방지
        if (transmission.status === "sent") {
            return res.status(400).json({ message: '이미 전송된 파일임..' });
        };

        // 전송 시작
        await updateTransmissionStatus(id, "sending");
        console.log(`${fileName} 전송 중..`);

        const form = new FormData();
        form.append("file", fs.createReadStream(filePath), fileName);

        const response = await axios.post("http://localhost:4000/upload", form, {
            headers: form.getHeaders(),
        })

        // 상태 업데이트
        const updated = await updateTransmissionStatus(id, "sent");

        // 전송 로그 저장
        await saveTransmissionLog({
            transmissionId: id,
            filename: transmission.filename,
            status: "sent",
            response: JSON.stringify(response.data),
        })

        // 응답
        res.status(200).json({
            message: `${fileName} 전송 완료`,
            sentAt: new Date().toISOString(),
            targetResponse: response.data,
            updated
        });

    } catch (error) {
        console.error('정보 업데이트 오류: ', error);
        const id = req.params.id;
        const transmission = await getTransmissionById(id);

        await updateTransmissionStatus(id, "failed");

        // 파일 전송 실패 로그 저장
        await saveTransmissionLog({
            transmissionId: id,
            filename: transmission?.filename || "unknown",
            status: "failed",
            response: error.message,
        });

        res.status(500).json({ message: '전송 정보 업데이트 실패' });
    }
};

module.exports = {
    getTransmissions,
    getTransmission,
    deleteTransmission,
    sendTransmission
};