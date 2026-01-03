import express from "express";
import { getResultsByCaseId } from "./results.controller.js";
import { verifyToken } from "auth-backend/middleware/auth.js";

const router = express.Router();

// GET /api/results/:caseId
router.get("/:caseId", verifyToken, getResultsByCaseId);

export default router;
