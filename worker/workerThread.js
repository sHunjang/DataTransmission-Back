const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const failedFiles = [];

const sendFile = async (filePath, serverUrl) => {
    try {
        const form = new FormData();
        form.append("file", fs.createReadStream(filePath));
        await axios.post(serverUrl, form, {
            headers: form.getHeaders(),
        });
        return true;
    } catch (err) {
        return false;
    }
};

(async () => {
    const { files, serverUrl } = workerData;
    let failed = 0;

    for (const file of files) {
        const success = await sendFile(file, serverUrl);
        if (!success) failed++;
    }

    parentPort.postMessage({ failed });
})();