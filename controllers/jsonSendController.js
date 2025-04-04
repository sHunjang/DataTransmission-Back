const pool = require("../db/db");

const sendToSelectedTable = async (req, res) => {
    const { selectedDB, selectedTable, jsonData } = req.body;

    if (!selectedTable || !jsonData) {
        return res.status(400).json({ message: "필수 데이터 누락" });
    }

    try {
        const query = `INSERT INTO ${selectedTable}(data) VALUES ($1) RETURNING *`;
        const result = await pool.query(query, [jsonData]);

        res.status(200).json({
            message: `✅ ${selectedTable} 테이블에 데이터 저장 완료`,
            saved: result.rows[0],
        });
    } catch (error) {
        console.error("데이터 저장 오류:", error);
        res.status(500).json({ message: "❌ 저장 실패", error: error.message });
    }
};

module.exports = { 
    sendToSelectedTable,
};