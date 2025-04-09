// 업로드 파일 정보 저장

const { middleDb } = require("../db/db");


// 파일 전송 정보 저장
const saveTransmission = async ({ filename, filepath, filesize, status = 'uploads' }) => {
    const query = `
    INSERT INTO transmissions (filename, filepath, filesize, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;
    const values = [filename, filepath, filesize, status];
    const result = await middleDb.query(query, values);
    return result.rows[0];
};

// 파일 전송 기록 조회
const getAllTransmissions = async () => {
    const result = await middleDb.query(`
        SELECT * FROM transmissions ORDER BY upload_time;
    `);
    return result.rows;
};

// 단일 전송 정보 조회
const getTransmissionById = async (id) => {
    const query = `SELECT * FROM transmissions WHERE id = $1;`;
    const result = await middleDb.query(query, [id]);
    return result.rows[0];
};

// 전송 정보 삭제
const deleteTransmissionById = async (id) => {
    const query = `DELETE FROM transmissions WHERE id = $1 RETURNING *;`;
    const result = await middleDb.query(query, [id]);
    return result.rows[0];
};

// 전송 상태 업데이트
const updateTransmissionStatus = async (id, status) => {
    const query = `UPDATE transmissions SET status = $1 WHERE id = $2 RETURNING *;`;
    const result = await middleDb.query(query, [status, id]);
    return result.rows[0];
};


module.exports = {
    saveTransmission,
    getAllTransmissions,
    getTransmissionById,
    deleteTransmissionById,
    updateTransmissionStatus,
};