import fs from "fs";
import path from "path";
import multer from "multer";

// Absolute path to uploads folder
const uploadDir = path.join(process.cwd(), "uploads");

// Ensure folder exists at server start
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Extra safety: create folder if deleted during runtime
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    // Sanitize filename to avoid special character issues
    const sanitized = file.originalname.replace(/[^a-z0-9.-]/gi, "_");
    cb(null, `${Date.now()}-${sanitized}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});
