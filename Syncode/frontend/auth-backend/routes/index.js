import express from "express";

import authRoutes from "./auth.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import transcriptRoutes from "./transcript.routes.js";

const router = express.Router();

// health check
router.get("/", (req, res) => {
  res.json({ status: "API running" });
});

// mount routes
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/transcripts", transcriptRoutes);

export default router;
