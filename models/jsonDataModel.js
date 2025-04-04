const pool = require("../db/db");

const insertJsonData = async (data) => {
    const query = `
        INSERT INTO json_data (data)
        VALUES ($1)
    `;
    await pool.query(query, [data]);
};

const fetchAllJsonData = async () => {
    const result = await pool.query(`
        SELECT * FROM json_data ORDER BY id DESC
    `);
    return result.rows;
};

const deleteJsonById = async (id) => {
    const query = `DELETE FROM json_data WHERE id = $1`;
    await pool.query(query, [id]);
};

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

const deleteAfterSend = async (id) => {
    await pool.query(`DELETE FROM json_data WHERE id = $1`, [id]);
};

module.exports = {
    insertJsonData,
    fetchAllJsonData,
    deleteJsonById,
    saveJsonData,
    deleteAfterSend
};