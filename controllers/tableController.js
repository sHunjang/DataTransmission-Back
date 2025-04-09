const { landDb, middleDb } = require("../db/db");

const getTableNames = async (req, res) => {
    try {
        const result = await middleDb.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
    `);
        const tables = result.rows.map(row => row.table_name);
        res.json(tables);
    } catch (err) {
        console.error("테이블 목록 조회 실패:", err.message);
        res.status(500).json({ message: "테이블 목록 조회 실패" });
    }
};

module.exports = { getTableNames };