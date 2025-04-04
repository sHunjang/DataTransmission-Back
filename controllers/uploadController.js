const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const archiver = require("archiver");
const { saveTransmission } = require("../models/transmissionModel");
const { url } = require("inspector");

const handleUpload = async (req, res) => {
    try {
        // 파일 존재 여부 확인
        const files = req.files["files"];
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "파일 업로드 실패" });
        }

        // zip 파일 생성
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
        const zipFileName = `Folder_${dateStr}.zip`;
        const zipFilePath = path.join(__dirname, "..", "uploads", zipFileName);
        const output = fsSync.createWriteStream(zipFilePath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", async () => {
            // zip 파일 생성 후 DB 저장
            for (const file of files) {
                await fs.unlink(file.path); // 원본 개별 파일 삭제 코드 -> zip파일로 저장하기 위함.
            }

            const stats = fsSync.statSync(zipFilePath); // -> zip 파일 크기

            // DB에 전송 정보 저장
            const saved = await saveTransmission({
                filename: zipFileName,
                filepath: zipFilePath,
                filesize: stats.size,
            });

            const downloadFiles = () => [{
                url: `/uploads/${encodeURIComponent(zipFileName)}`,
                displayName: zipFileName,
            }];

            res.json({
                message: "파일 업로드 및 압축 완료",
                downloadFiles,
                transmissionInfo: saved, // 서버에도 저장된 정보 전달
            });
        });

        // 압축 처리 중 에러 처리
        archive.on("error", (err) => {
            return res.status(500).json({ message: "압축 실패", error: err.message });
        });

        // 파일 zip에 추가 후 압축 실행
        archive.pipe(output);
        files.forEach(file => {
            archive.file(file.path, { name: file.originalname });
        });

        await archive.finalize();

    } catch (error) {
        console.error("handleUpload 에러:", error);
        res.status(500).json({ message: "업로드 처리 중 오류:", error: error.message });
    }
};

module.exports = { handleUpload };