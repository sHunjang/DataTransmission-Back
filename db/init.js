const pool = require("./db");


// transmissions Table 없을 때 생성 코드
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
    try {
        await pool.query(query);
        console.log("transmissions 테이블 생성..");
    } catch (error) {
        console.error("transmissions 테이블 생성 오류: ", error);
    }
};

// transmission_logs Table 없을 때 생성 코드
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
    try {
        await pool.query(query);
        console.log("transmission_logs 테이블 생성..");
    } catch (error) {
        console.error("transmission_logs 테이블 생성 오류: ", error);
    }
};


// transmission_jobs 생성 코드
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
    try {
        await pool.query(query);
        console.log("transmission_jobs 테이블 생성..");
    } catch (err) {
        console.error("transmission_jobs 테이블 생성 오류: ", err);
    }
};

const createJsonDataStorageTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS json_data (
            id SERIAL PRIMARY KEY,
            data JSONB NOT NULL,
            received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log("json_data 테이블 생성..");
    } catch (err) {
        console.error("json_data 테이블 생성 오류: ", err);
    }
};

const createJsonTransmissionLogTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS json_transmission_logs (
            id SERIAL PRIMARY KEY,
            sent_data JSONB NOT NULL,
            table_name TEXT,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log("json_transmission_logs 테이블 생성..");
    } catch (err) {
        console.error("테이블 생성 요류:", err.message);
    }
};

module.exports = {
    createTransmissionTable,
    createTransmissionLogTable,
    createTransmissionJobsTable,
    createJsonDataStorageTable,
    createJsonTransmissionLogTable,
};