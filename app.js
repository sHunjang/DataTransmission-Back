const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const transmissionLogRouter = require("./routes/transmissionLogRouter");
const jobRouter = require("./routes/jobRouter");
const tableRouter = require("./routes/tableRouter");
const jsonRouter = require("./routes/jsonRouter");
const jsonLogRouter = require("./routes/jsonLogRouter");
const {
    createJsonDataStorageTable,
    createLandUserTables,
    createSeaUserTables,
} = require("./db/init");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// 업로드 파일 제공
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 라우터 등록
// app.use("/api", uploadRoutes);
// app.use("/api/transmission", transmissionRouter);
app.use("/api/transmission-logs", transmissionLogRouter);
// app.use("/api/threads", threadRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/tables", tableRouter);
app.use("/api/json", jsonRouter);
app.use("/api/json/logs", jsonLogRouter);



// 테이블 생성 (초기화)
(async () => {
    await createJsonDataStorageTable();
    await createLandUserTables();
    await createSeaUserTables();
    console.log("모든 테이블 생성 완료");
})();



app.listen(port, () => {
    console.log(`송신 서버 실행 중: http://localhost:${port}`);
});