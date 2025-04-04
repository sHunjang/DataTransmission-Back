const { getAllJobs, getJobById } = require("../models/transmissionJobModel");

const fetchAllJobs = async (req, res) => {
    try {
        const jobs = await getAllJobs();
        res.status(200).json(jobs);
    } catch (error) {
        console.error("전송 전체 기록 조회 오류: ", error);
        res.status(500).json({ message: "전송 전체 기록 조회 오류" });
    }
};

const fetchJobById = async (req, res) => {
    try {
        const job = await getJobById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "해당 전송 기록 없음.." });
        }
        res.status(200).json(job);
    } catch (error) {
        console.error("전송 기록 조회 오류: ", error);
        res.status(500).json({ message: "전송 기록 조회 오류" });
    }
};

module.exports = {
    fetchAllJobs,
    fetchJobById,
}