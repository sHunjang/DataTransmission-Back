// 파일 전송 성공 여부 로그 저장

const { middleDb } = require("../db/db");

// 파일 전송 로그 저장
const saveTransmissionLog = async ({ transmissionId, filename, status, response }) => {
    const query = `
        INSERT INTO transmission_logs (transmission_id, filename, status, response)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [transmissionId, filename, status, response];
    const result = await middleDb.query(query, values);
    return result.rows[0];
};

const getAllLogs = async () => {
    const result = await middleDb.query("SELECT * FROM transmission_logs ORDER BY sent_at;");
    return result.rows;
};

const getLogsByTransmissionId = async (transmissionId) => {
    const result = await middleDb.query(
        "SELECT * FROM transmission_logs WHERE transmission_id = $1 ORDER BY sent_at;",
        [transmissionId]
    );
    return result.rows;
}

module.exports = {
    saveTransmissionLog,
    getAllLogs,
    getLogsByTransmissionId,
}