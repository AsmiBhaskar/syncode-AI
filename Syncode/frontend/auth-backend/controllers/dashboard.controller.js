import { prisma } from "../lib/prisma.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user + company info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const totalTranscripts = await prisma.transcript.count({
      where: { userId },
    });

    const recentActivity = await prisma.transcript.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        caseId: true,
        service: true,
        status: true,
        createdAt: true,
      },
    });

    res.json({
      user: {
        fullName: user.fullName,
        companyName: user.company?.name,
      },
      totalTranscripts,
      recentActivity: recentActivity.map((t) => ({
        id: t.id,
        caseId: t.caseId,
        service: t.service,
        status: t.status,
        createdAt: t.createdAt,
      })),
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};
