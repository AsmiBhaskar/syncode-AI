import express from "express";
import {
  createTranscript,
  getProcessingStatus,
  updateProcessingStatus,
} from "../controllers/transcript.controller.js";
import { verifyToken } from "../middleware.js";
import { upload } from "../lib/upload.js";

const router = express.Router();

router.post("/upload", verifyToken, upload.array("files"), createTranscript);
// internal ML route
router.post("/internal/processing-status", updateProcessingStatus);

// frontend route
router.get("/:transcriptId/status", verifyToken, getProcessingStatus);

export default router;
