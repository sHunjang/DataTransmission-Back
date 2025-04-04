const { getAllLogs, getLogsByTransmissionId, } = require("../models/transmissionLogModel")

const fetchAllLogs = async (req, res) => {
    try {
        const logs = await getAllLogs();
        res.status(200).json(logs);
    } catch (error) {
        console.error("전체 로그 조회 실패: ", error)
        res.status(500).json({ message: '전체 로그 조회 오류: ' });
    }
};

const fetchLogsByTransmissionId = async (req, res) => {
    try {
        const transmissionId = req.params.transmissionId;
        const logs = await getLogsByTransmissionId(transmissionId);
        res.status(200).json(logs);
    } catch (error) {
        console.log("전송별 로그 조회 오류: ", error);
        res.status(500).json({ message: "전송별 로그 조회 오류 "});
    }
};

module.exports = {
    fetchAllLogs, 
    fetchLogsByTransmissionId,
}