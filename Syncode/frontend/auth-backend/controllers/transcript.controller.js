import { prisma } from "../lib/prisma.js";
import { v4 as uuid } from "uuid";

export const createTranscript = async (req, res) => {
  try {
    const { rawText, caseId, insuranceProvider, policyType, service } =
      req.body;

    const files = req.files;

    // ❌ no input guard
    if ((!files || files.length === 0) && !rawText) {
      return res.status(400).json({ error: "No input provided" });
    }

    const inputType = files && files.length > 0 ? "FILE" : "TEXT";

    // ✅ store ONLY file paths
    const filePaths = files ? files.map((file) => file.path) : [];

    const transcript = await prisma.transcript.create({
      data: {
        transcriptId: uuid(),
        inputType,

        filePaths, // string[]
        rawText: rawText || null,

        caseId,
        insuranceProvider,
        policyType,
        service,

        userId: req.user.id, // comes from auth middleware
        status: "PROCESSING",
      },
    });

    return res.status(201).json({
      id: transcript.id,
      transcriptId: transcript.transcriptId,
    });
  } catch (error) {
    console.error("Create transcript error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
