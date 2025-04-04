const pool = require("../db/db");

const getTableNames = async (req, res) => {
    try {
        const query = `
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
                AND table_type = 'BASE TABLE';
        `;
        const result = await pool.query(query);
        const tables = result.rows.map(row => row.table_name);
        res.json(tables);
    } catch (err) {
        console.error("테이블 목록 조회 실패: ", err);
        res.status(500).json({ message: "테이블 목록 조회 실패F" });
    }
};

const getTableData = async (req, res) => {
    const { tableName } = req.params;
    try {
        // 테이블명 화이트리스트 확인
        const tableCheck = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            AND table_name = $1
        `, [tableName]);

        if (tableCheck.rows.length === 0) {
            return res.status(400).json({ message: "잘못된 테이블명입니다." });
        }

        const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY id`);
        res.json(result.rows);
    } catch (err) {
        console.error("테이블 조회 실패: ", err);
        res.status(500).json({ message: "테이블 조회 실패" });
    }
};

module.exports = {
    getTableNames,
    getTableData,
}