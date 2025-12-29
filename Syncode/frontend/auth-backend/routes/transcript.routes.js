import express from "express";
import { createTranscript } from "../controllers/transcript.controller.js";
import { upload, verifyToken } from "../middleware.js";

const router = express.Router();

router.post("/upload", verifyToken, upload.array("files"), createTranscript);

export default router;
