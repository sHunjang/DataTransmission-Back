const { middleDb, landDb, seaDb } = require("./db");

// transmissions 테이블
const createTransmissionTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS transmissions (
            id SERIAL PRIMARY KEY,
            filename TEXT NOT NULL,
            filepath TEXT NOT NULL,
            upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            filesize INTEGER,
            status TEXT DEFAULT 'uploaded'
        );
    `;
    await middleDb.query(query);
    console.log("transmissions 테이블 생성 완료");
};

// transmission_logs 테이블
const createTransmissionLogTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS transmission_logs (
            id SERIAL PRIMARY KEY,
            transmission_id INTEGER REFERENCES transmissions(id),
            filename TEXT NOT NULL,
            status TEXT NOT NULL,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            response TEXT
        );
    `;
    await middleDb.query(query);
    console.log("transmission_logs 테이블 생성 완료");
};

// transmission_jobs 테이블
const createTransmissionJobsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS transmission_jobs (
            id SERIAL PRIMARY KEY,
            start_time TIMESTAMP NOT NULL,
            end_time TIMESTAMP NOT NULL,
            duration_sec INTEGER,
            thread_count INTEGER,
            file_count INTEGER
        );
    `;
    await middleDb.query(query);
    console.log("transmission_jobs 테이블 생성 완료");
};

// json_data 테이블
const createJsonDataStorageTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS json_data (
            id SERIAL PRIMARY KEY,
            data JSONB NOT NULL,
            received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await middleDb.query(query);
    console.log("json_data 테이블 생성 완료");
};

// json_transmission_logs 테이블
const createJsonTransmissionLogTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS json_transmission_logs (
            id SERIAL PRIMARY KEY,
            sent_data JSONB NOT NULL,
            table_name TEXT,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await middleDb.query(query);
    console.log("json_transmission_logs 테이블 생성 완료");
};

// 육상 사용자 테이블
const createLandUserTables = async () => {
    try {
        await landDb.query(`
            CREATE TABLE IF NOT EXISTS user_data (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL,
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        await landDb.query(`
            CREATE TABLE IF NOT EXISTS user_log (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL,
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("[육상 DB] user_data, user_log 테이블 생성 완료");
    } catch (err) {
        console.error("[육상 DB] 테이블 생성 실패:", err.message);
    }
};

// 해상 사용자 테이블
const createSeaUserTables = async () => {
    try {
        await seaDb.query(`
            CREATE TABLE IF NOT EXISTS user_data (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL,
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        await seaDb.query(`
            CREATE TABLE IF NOT EXISTS user_log (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL,
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("[해상 DB] user_data, user_log 테이블 생성 완료");
    } catch (err) {
        console.error("[해상 DB] 테이블 생성 실패:", err.message);
    }
};

module.exports = {
    createTransmissionTable,
    createTransmissionLogTable,
    createTransmissionJobsTable,
    createJsonDataStorageTable,
    createJsonTransmissionLogTable,
    createLandUserTables,
    createSeaUserTables,
};