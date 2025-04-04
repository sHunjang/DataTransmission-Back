const fs = require("fs");
const path = require("path");

const getAllFiles = () => {
    const folderPath = path.join(__dirname, "..", "files");

    // 폴더가 없을 경우 예외 방지
    if (!fs.existsSync(folderPath)) {
        console.warn("files 폴더가 존재하지 않습니다.");
        return [];
    }

    return fs.readdirSync(folderPath).map(file => path.join(folderPath, file));
};

module.exports = { getAllFiles };