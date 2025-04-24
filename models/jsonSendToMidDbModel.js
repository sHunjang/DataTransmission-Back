const { middleDb, landDb } = require("../db/db");


// 송신 -> 중간 DB 데이터 저장
const insertJsonData = async (data) => {
    const query = `
        INSERT INTO Received_data_middle (data)
        VALUES ($1)
    `;
    await middleDb.query(query, [data]);

};

// 중간 DB 데이터 조회
const fetchAllJsonData = async () => {
    const result = await middleDb.query(`
        SELECT * FROM Received_data_middle ORDER BY id DESC
    `);
    return result.rows;
};

// 중간 DB -> 수신 DB 데이터 저장
const saveJsonData = async (req, res) => {
    try {
        const data = req.body;
        await insertJsonData(data);
        res.status(201).json({ message: "JSON 데이터 저장 완료" });
    } catch (err) {
        console.error("JSON 저장 오류:", err);
        res.status(500).json({ message: "저장 실패" });
    }
};

// 중간 DB -> 수신 DB 데이터 전송 후 삭제 -
const deleteJsonById = async (id) => {
    const query = `DELETE FROM Received_data_middle WHERE id = $1`;
    await middleDb.query(query, [id]);
};


const deleteAfterSend = async (id) => {
    await middleDb.query(`DELETE FROM Received_data_middle WHERE id = $1`, [id]);
};

module.exports = {
    insertJsonData,
    fetchAllJsonData,
    deleteJsonById,
    saveJsonData,
    deleteAfterSend
};