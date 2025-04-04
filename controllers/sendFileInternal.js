const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");


const { getAllFiles } = require("../utils/fileUtil");
const { createZip } = require("../utils/zipUtil");
const { saveTransmissionJob } = require("../models/transmissionJobModel");


const sendFilesInternally = async ({ threadCount = 1, serverUrl }) => {
    const allFiles = getAllFiles;
    const startTime = new Date().toISOString();

    const dateStr = new Date().toISOString().slice(0, 10);
    const zipName = `SendFiles_${dateStr}.zip`;
    const zipPath = await createZip(allFiles(), zipName);

    const form = new FormData();
    form.append("file", fs.createReadStream(zipPath), zipName);

    const endTime = new Date().toISOString();
    const durationSec = Math.floor((endTime - startTime) / 1000);

    try {
        const response = await axios.post(serverUrl, form, {
            headers: form.getHeaders(),
        });

        await saveTransmissionJob({
            startTime,
            endTime,
            durationSec,
            threadCount,
            fileCount: allFiles.length,
        });

        console.log("Zip 파일 전송..: ", zipName);
    } catch (error) {
        console.error("Zip 파일 전송 실패..: ", error.message);
    }
};

module.exports = {
    sendFilesInternally,
}