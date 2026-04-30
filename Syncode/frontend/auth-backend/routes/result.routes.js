import express from "express";
import { getResultsByCaseId } from "../controllers/result.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/results/:caseId
router.get("/:caseId", verifyToken, getResultsByCaseId);

export default router;
