import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch"; // For calling external AI model

const prisma = new PrismaClient();

async function callAIModelBackend() {
  console.log("⚠️ AI not integrated yet, using fallback");
  return null;
}

// This function simulates calling a real AI model backend
// async function callAIModelBackend(transcriptText) {
//   try {
//     // Imagine this is your AI model endpoint
//     // const response = await fetch(
//     //   "https://your-ai-backend.com/api/extract-codes",
//     //   {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify({ text: transcriptText }),
//     //   }
//     // );

//     // if (!response.ok) throw new Error("AI model returned error");

//     // const data = await response.json();
//     // Example AI response format: [{ code: "A123", type: "ICD-10" }, ...]
//     // return data.codes || [];

//   } catch (err) {
//     console.error("AI model call failed:", err.message);
//     return null; // will trigger fallback
//   }
// }

export const getResultsByCaseId = async (req, res) => {
  const { caseId } = req.params;

  try {
    const transcript = await prisma.transcript.findFirst({
      where: { caseId },
      include: { medicalCodes: true },
    });

    if (!transcript) {
      return res.status(404).json({ error: "Transcript not found" });
    }

    let medicalCodes = transcript.medicalCodes;

    // If no codes yet, call AI model
    if (!medicalCodes || medicalCodes.length === 0) {
      const aiCodes = await callAIModelBackend(transcript.rawText || "");

      if (aiCodes && aiCodes.length > 0) {
        // Save AI codes to DB
        await prisma.medicalCode.createMany({
          data: aiCodes.map((c) => ({
            transcriptId: transcript.id,
            code: c.code,
            type: c.type,
          })),
        });

        // Fetch saved codes
        medicalCodes = await prisma.medicalCode.findMany({
          where: { transcriptId: transcript.id },
        });
      } else {
        // Fallback mock if AI fails or returns nothing
        medicalCodes = [
          { code: "A123", type: "ICD-10" },
          { code: "B456", type: "ICD-10" },
        ];
      }
    }

    res.json({ medicalCodes });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch results. Showing mock data.",
      medicalCodes: [
        { code: "A123", type: "ICD-10" },
        { code: "B456", type: "ICD-10" },
      ],
    });
  }
};
