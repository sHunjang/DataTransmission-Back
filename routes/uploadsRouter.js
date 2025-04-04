const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { handleUpload } = require("../controllers/uploadController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

router.post("/upload", upload.fields([{ name: "files" }]), handleUpload);

module.exports = router;