const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");

const { createZip } = require("../utils/zipUtil");
const { saveTransmissionJob } = require("../models/transmissionJobModel");
const { sendFilesInternally } = require("./sendFileInternal");
const { getAllFiles } = require("../utils/fileUtil");
const { getAllJobs } = require("../models/transmissionJobModel");


const sendFiles = async (req, res) => {
    const { threadCount = 1, serverUrl, startTime: clientStartTime } = req.query;

    const startTime = clientStartTime ? new Date(clientStartTime) : new Date();

    const allFiles = getAllFiles();
    const dateStr = new Date().toISOString().slice(0, 10);
    const zipName = `SendFiles_${dateStr}.zip`;
    const zipPath = await createZip(allFiles, zipName);

    const endTime = new Date();
    const durationSec = Math.floor((endTime - startTime) / 1000);

    await saveTransmissionJob({
        startTime,
        endTime,
        durationSec,
        threadCount,
        fileCount: allFiles.length,
    });

    const form = new FormData();
    form.append("file", fs.createReadStream(zipPath), zipName);

    try {
        const axiosResponse = await axios.post(serverUrl, form, {
            headers: form.getHeaders(),
        });

        res.status(200).json({
            message: `총 ${allFiles.length}개 파일 zip 파일로 전송 완료`,
            threads: threadCount,
            zipFile: zipName,
            zipResponse: axiosResponse.data,
        });
    } catch (error) {
        console.error("zip 파일 전송 실패: ", error.message);
        res.status(500).json({ message: "zip 파일 전송 실패", error: error.message });
    }
};

// 전송 주기 시작 로직
let intervalId = null;

const startScheduledTransmission = (req, res) => {
    const { intervalSec = 10, threadCount = 1, serverUrl } = req.body;

    if (intervalId) {
        return res.status(400).json({ message: "이미 실행 중.." });
    }

    intervalId = setInterval(async () => {
        try {
            console.log(`${intervalSec}초 마다 전송 중..`);
            await sendFilesInternally({ threadCount, serverUrl });
        } catch (err) {
            console.error("전송 실패: ", err.message);
        }
    }, intervalSec * 1000);

    res.json({ message: "전송 시작..", intervalSec });
};

// 전송 주기 중지 로직
const stopScheduledTransmission = (req, res) => {
    if (!intervalId) {
        return res.status(400).json({ message: "실행 중인 주기 없음.." });
    }

    clearInterval(intervalId);
    intervalId = null;

    res.json();
};

const getAllTransmissionJobs = async (req, res) => {
    try {
        const jobs = await getAllJobs();
        res.status(200).json(jobs);
    } catch (error) {
        console.error("전송 기록 조회 실패: ", error);
        res.status(500).json({ message: "전송 기록 조회 실패" });
    }
};

module.exports = {
    sendFiles,
    startScheduledTransmission,
    stopScheduledTransmission,
    getAllTransmissionJobs,
};