import { prisma } from "../lib/prisma.js";
import { v4 as uuid } from "uuid";

// Create a new transcript and initialize its processing status
export const createTranscript = async (req, res) => {
  try {
    const { rawText, caseId, insuranceProvider, policyType, service } =
      req.body;
    const files = req.files;

    // Guard: must have files or raw text
    if ((!files || files.length === 0) && !rawText) {
      return res.status(400).json({ error: "No input provided" });
    }

    const inputType = files && files.length > 0 ? "FILE" : "TEXT";

    // Store only sanitized file paths
    const filePaths = files
      ? files.map((file) => file.path.replace(/\\/g, "/"))
      : [];

    // Create transcript with an initial processingStatus record
    const transcript = await prisma.transcript.create({
      data: {
        transcriptId: uuid(),
        inputType,
        filePaths,
        rawText: rawText || null,
        caseId,
        insuranceProvider,
        policyType,
        service,
        userId: req.user.id,
        status: "PROCESSING",
        processingStatus: {
          create: {
            service: service || "full-pipeline",
            progress: 0,
            currentStep: "",
            steps: [],
          },
        },
      },
      include: { processingStatus: true },
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

// Update the processing status of a transcript
export const updateProcessingStatus = async (req, res) => {
  try {
    const { transcriptId, service, progress, currentStep, steps } = req.body;

    const transcript = await prisma.transcript.findUnique({
      where: { transcriptId },
    });

    if (!transcript)
      return res.status(404).json({ error: "Transcript not found" });

    await prisma.processingStatus.upsert({
      where: { transcriptId: transcript.id },
      update: { progress, currentStep, steps, service },
      create: {
        transcriptId: transcript.id,
        service,
        progress,
        currentStep,
        steps,
      },
    });

    // Auto-mark transcript as completed
    if (progress === 100) {
      await prisma.transcript.update({
        where: { id: transcript.id },
        data: { status: "COMPLETED" },
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Update processing status error:", err);
    res.status(500).json({ error: "Status update failed" });
  }
};

// Get current processing status of a transcript
export const getProcessingStatus = async (req, res) => {
  try {
    const { transcriptId } = req.params;

    const transcript = await prisma.transcript.findUnique({
      where: { transcriptId },
      include: { processingStatus: true },
    });

    if (!transcript) {
      return res.status(404).json({ error: "Transcript not found" });
    }

    // If no processingStatus exists yet, return defaults
    const status = transcript.processingStatus || {
      progress: 0,
      currentStep: "",
      steps: [],
      service: transcript.service || "full-pipeline",
    };

    return res.json({
      service: status.service,
      progress: status.progress,
      currentStep: status.currentStep,
      steps: status.steps,
      status: transcript.status,
      metadata: {
        caseId: transcript.caseId,
        insuranceProvider: transcript.insuranceProvider,
        policyType: transcript.policyType,
      },
      files: transcript.filePaths || [],
    });
  } catch (err) {
    console.error("Get processing status error:", err);
    res.status(500).json({ error: "Failed to fetch status" });
  }
};
