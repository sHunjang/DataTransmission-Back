const { middleDb, landDb } = require("../db/db");

const getAllJsonLogs = async (req, res) => {
    try {
        const result = await landDb.query(`SELECT * FROM send_jsondata ORDER BY id DESC`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("로그 조회 실패:", err.message);
        res.status(500).json({ message: "로그 조회 실패" });
    }
};

module.exports = { getAllJsonLogs };