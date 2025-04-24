const { landDb, middleDb } = require("../db/db");


// 송신 DB 데이터 저장
const insertJsonData = async (data) => {
    const { tableName } = req.params;
    const query = `
        INSERT INTO ${tableName} (data)
        VALUES ($1)
    `;
    await landDb.query(query, [data]);
};


// 송신 DB 데이터 조회
const fetchAllJsonData = async () => {
    const result = await landDb.query(`
        SELECT * FROM Send_JsonData ORDER BY id DESC
    `);
    return result.rows;
};

// 송신 DB 데이터 삭제
const deleteJsonById = async (id) => {
    const query = `DELETE FROM Send_JsonData WHERE id = $1`;
    await landDb.query(query, [id]);
};


// 송신 DB 데이터 저장
const saveJsonData = async (req, res) => {
    try {
        const data = req.body;
        // 송신 DB에 저장
        await insertJsonData(data);
        res.status(201).json({ message: "JSON 데이터 저장 완료" });
    } catch (err) {
        console.error("JSON 저장 오류:", err);
        res.status(500).json({ message: "저장 실패" });
    }
};

// 수신 DB 데이터 삭제
const deleteAfterSend = async (id) => {
    await landDb.query(`DELETE FROM Send_JsonData WHERE id = $1`, [id]);
};

module.exports = {
    insertJsonData,
    fetchAllJsonData,
    deleteJsonById,
    saveJsonData,
    deleteAfterSend
};