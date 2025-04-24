const { middleDb, landDb } = require("../db/db");
const axios = require("axios");

const {
    insertJsonData,
    fetchAllJsonData,
    deleteJsonById,
    deleteAfterSend
} = require("../models/jsonDataModel");

const {
    saveJsonTransmissionLog
} = require("../models/jsonTransmissionLogModel");

// 중간 DB - JSON 저장
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

// 중간 DB - 전체 조회
const getAllJsonData = async (req, res) => {
    try {
        const result = await fetchAllJsonData();
        res.json(result);
    } catch (err) {
        console.error("미리보기 오류:", err);
        res.status(500).json({ message: "조회 실패" });
    }
};

// 중간 DB - 삭제
const deleteJsonData = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteJsonById(id);
        res.json({ message: "삭제 완료" });
    } catch (err) {
        console.error("삭제 오류: ", err);
        res.status(500).json({ message: "삭제 실패" });
    }
};

// 육상 DB - JSON 테이블에 저장 + 로그
const saveJsonToTable = async (req, res) => {
    const { tableName } = req.params;
    const jsonData = req.body;

    try {
        const query = `INSERT INTO ${tableName} (data) VALUES ($1)`;
        await landDb.query(query, [jsonData]);

        await saveJsonTransmissionLog({ sentData: jsonData, tableName });

        res.status(201).json({ message: "저장 성공 및 로그 기록 완료" });
    } catch (err) {
        console.error("저장 실패:", err.message);
        res.status(500).json({ message: "저장 실패" });
    }
};

// 육상 DB - 테이블 목록 조회
const getTableNames = async (req, res) => {
    try {
        const result = await landDb.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        `);
        const tables = result.rows.map(row => row.table_name);
        res.json(tables);
    } catch (err) {
        console.error("테이블 목록 조회 실패:", err);
        res.status(500).json({ message: "테이블 목록 조회 실패" });
    }
};

// 중간 DB - 페이징 조회
const getPaginatedJsonData = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const dataQuery = `SELECT * FROM Received_data_middle ORDER BY id DESC LIMIT $1 OFFSET $2`;
        const countQuery = `SELECT COUNT(*) FROM Received_data_middle`;

        const dataResult = await middleDb.query(dataQuery, [limit, offset]);
        const countResult = await middleDb.query(countQuery);

        const totalCount = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            data: dataResult.rows,
            page,
            totalPages,
        });
    } catch (err) {
        console.error("페이징 데이터 조회 실패:", err);
        res.status(500).json({ message: "조회 실패" });
    }
};


// 육상 DB - 전송 로그 삭제
const deleteJsonData_SendDB = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteJsonById(id);
        res.json({ message: "삭제 완료" });
        console.log(`ID: ${id} 삭제 완료`);
    } catch (err) {
        console.error("삭제 오류: ", err);
        res.status(500).json({ message: "삭제 실패" });
    }
};

// 중간 DB → 외부 서버 전송 후 삭제
const sendAndDeleteJsonData = async (req, res) => {
    const { serverUrl } = req.body;

    try {
        const allData = await fetchAllJsonData();

        for (const item of allData) {
            try {
                await axios.post(serverUrl, item.data); // 실제 전송
                await deleteAfterSend(item.id);         // 성공 시 삭제
                console.log(`전송 및 삭제 완료 - ID: ${item.id}`);
            } catch (err) {
                console.error(`전송 실패 - ID: ${item.id}`, err.message);
            }
        }

        res.json({ message: "전송 내용 삭제 완료" });
    } catch (err) {
        console.error("전송 작업 실패:", err);
        res.status(500).json({ message: "전송 중 오류 발생" });
    }
};

module.exports = {
    saveJsonData,
    getAllJsonData,
    deleteJsonData,
    saveJsonToTable,
    getTableNames,
    getPaginatedJsonData,
    sendAndDeleteJsonData,
    deleteJsonData_SendDB,
};