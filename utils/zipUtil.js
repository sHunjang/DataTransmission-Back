const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

const createZip = (files, zipName, targetDir = "sent_zips") => {

    return new Promise((resolve, reject) => {
        const zipDir = path.join(__dirname, "..", targetDir);
        if (!fs.existsSync(zipDir)) fs.mkdirSync(zipDir, { recursive: true });

        const zipPath = path.join(zipDir, zipName);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", () => resolve(zipPath));
        archive.on("error", (err) => reject(err));

        archive.pipe(output);
        files.forEach((filePath) => {
            archive.file(filePath, { name: path.basename(filePath) });
        });

        archive.finalize();
    });
};

module.exports = { createZip };