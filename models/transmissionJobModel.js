// 파일 전송 기록 저장

const pool = require("../db/db");

const saveTransmissionJob = async ({

    startTime,
    endTime,
    durationSec,
    threadCount,
    fileCount,
    successCount,
    failCount,
    status,

}) => {
    const query = `
        INSERT INTO transmission_jobs (
            start_time, end_time, duration_sec, thread_count, file_count
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [
        startTime,
        endTime,
        durationSec,
        threadCount,
        fileCount,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};


// 전송 정보 전체 조회
const getAllJobs = async () => {
    const result = await pool.query(`SELECT * FROM transmission_jobs ORDER BY id`);
    return result.rows;
};

// 전송 정보 단일 조회
const getJobById = async (id) => {
    const result = await pool.query(`SELECT * FROM transmission_jobs WHERE id = $1`, [id]);
    return result.rows[0];
};

module.exports = { 
    saveTransmissionJob, 
    getAllJobs, 
    getJobById,
};