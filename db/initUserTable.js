const pool = require("./db");

const createUserTables = async () => {
    const queries = [
        `
        CREATE TABLE IF NOT EXISTS device_data (
            id SERIAL PRIMARY KEY,
            data JSONB NOT NULL,
            received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `,
        `
        CREATE TABLE IF NOT EXISTS sensor_data (
            id SERIAL PRIMARY KEY,
            data JSONB NOT NULL,
            received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `,
        `
        CREATE TABLE IF NOT EXISTS user_feedback (
            id SERIAL PRIMARY KEY,
            data JSONB NOT NULL,
            received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `
    ];

    try {
        for (const query of queries) {
            await pool.query(query);
        }
        console.log("사용자용 테이블 생성..");
    } catch (err) {
        console.error("사용자용 테이블 생성 실패:", err);
    }
};

module.exports = { createUserTables };