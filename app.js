const express = require("express");
const cors = require("cors");
const path = require("path");

const uploadRoutes = require("./routes/uploadsRouter");
const transmissionRouter = require("./routes/transmissionRouter");
const transmissionLogRouter = require("./routes/transmissionLogRouter");
const threadRouter = require("./routes/threadRouter")
const jobRouter = require("./routes/jobRouter");
const tableRouter = require("./routes/tableRouter");
const jsonDataRouter = require("./routes/jsonDataRouter");
const jsonLogRouter = require("./routes/jsonLogRouter");

const { createTransmissionTable, createTransmissionLogTable, createTransmissionJobsTable, createJsonDataStorageTable, createJsonTransmissionLogTable } = require("./db/init");
const { createUserTables } = require("./db/initUserTable");

const app = express();
const port = 8080;

// transmissions 테이블 생성
createTransmissionTable();

// transmission_logs 테이블 생성
createTransmissionLogTable();

// transmission_jobs 테이블 생성
createTransmissionJobsTable();

// json_data 테이블 생성
createJsonDataStorageTable();

createJsonTransmissionLogTable();

// user 테이블 생성
createUserTables();

app.use(cors());
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/transmission", transmissionRouter);

app.use("/api/transmission-logs", transmissionLogRouter);

app.use("/api/threads", threadRouter);

app.use("/api/jobs", jobRouter);

app.use("/api/tables", tableRouter);

app.use("/api/json", jsonDataRouter);

app.use("/api/json/logs", jsonLogRouter);

app.listen(port, () => {
    console.log(`서버: http://localhost:${port}에서 실행 중..`);
});