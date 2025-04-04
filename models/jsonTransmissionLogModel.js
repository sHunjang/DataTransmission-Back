const pool = require("../db/db");

const saveJsonTransmissionLog = async ({ sentData, tableName }) => {
    const query = `
        INSERT INTO json_transmission_logs (sent_data, table_name)
        VALUES ($1, $2)
    `;
    await pool.query(query, [sentData, tableName]);
};

module.exports = {
    saveJsonTransmissionLog,
};