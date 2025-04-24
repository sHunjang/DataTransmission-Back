// db/init.js

const { middleDb, landDb, seaDb } = require("./db");


// 중간 DB 테이블 생성
const createJsonDataStorageTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Received_data_middle (
            id SERIAL PRIMARY KEY,
            data JSONB NOT NULL,
            received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await middleDb.query(query);
    console.log("Received_data_middle 테이블 생성 완료");
};


// 육상 사용자 테이블 생성
const createLandUserTables = async () => {
    try {
        await landDb.query(`
            CREATE TABLE IF NOT EXISTS Send_JsonData (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL,
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("[육상 DB] Send_JsonData 테이블 생성 완료");
    } catch (err) {
        console.error("[육상 DB] 테이블 생성 실패:", err.message);
    }
};

// 해상 사용자 테이블 생성
const createSeaUserTables = async () => {
    try {
        await seaDb.query(`
            CREATE TABLE IF NOT EXISTS Received_data (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL,
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("[해상 DB] Received_data 테이블 생성 완료");
    } catch (err) {
        console.error("[해상 DB] 테이블 생성 실패:", err.message);
    }
};

module.exports = {
    createJsonDataStorageTable,
    createLandUserTables,
    createSeaUserTables,
};