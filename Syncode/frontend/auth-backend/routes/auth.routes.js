import { login, signup, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware.js";
import express from "express";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
