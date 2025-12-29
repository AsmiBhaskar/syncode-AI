import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export function DashboardPage() {
  const [user, setUser] = useState(null);
  const [totalTranscripts, setTotalTranscripts] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusStyles = {
    COMPLETED: "text-green-500 font-semibold",
    FAILED: "text-red-500 font-semibold",
    PROCESSING: "text-yellow-500 font-semibold",
  };

  const toTitleCase = (str = "") =>
    str.replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    );

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard", {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        const now = Date.now();

        const formattedActivity = (data.recentActivity || []).map((a) => {
          const diff = now - new Date(a.createdAt).getTime();
          const minutes = Math.floor(diff / 60000);

          const timeAgo =
            minutes < 60
              ? `${minutes}m ago`
              : `${Math.floor(minutes / 60)}h ago`;

          return {
            ...a,
            timeAgo,
          };
        });

        console.log("Dashboard user:", data.user);

        setUser(data.user);
        setTotalTranscripts(data.totalTranscripts);
        setRecentActivity(formattedActivity);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading ...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showNavLinks={false} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-3xl mb-2">
            Welcome back, {user?.fullName || "User"} 👋
          </h1>
          <p className="text-muted-foreground">
            Here’s what’s happening with your transcripts
          </p>
        </motion.div>

        {/* Upload */}
        <div className="my-8">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#11d462] text-black rounded-lg hover:text-foreground hover:scale-110 "
          >
            <Upload className="w-5 h-5" />
            Upload New Transcript
          </Link>
        </div>

        {/* Total */}
        <div className="bg-card border border-[#11d462] rounded-xl p-6 mb-10 max-w-sm">
          <div className="flex gap-4">
            <FileText className="w-8 h-8 text-[#11d462]" />
            <div>
              <div className="text-3xl">{totalTranscripts}</div>
              <div className="text-sm text-muted-foreground">
                Total Transcripts
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="mb-4">Recent Activity</h3>

          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground">
              No transcripts uploaded yet.
            </p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((a) => (
                <div
                  key={a.id}
                  className="flex justify-between items-center p-4 bg-secondary rounded-lg border border-[#11d462]"
                >
                  {/* LEFT */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-foreground">
                        Case ID: {a.caseId || "—"}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-transparent text-[#11d462] font-medium">
                        {a.service ? toTitleCase(a.service) : "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {a.timeAgo}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <span className={statusStyles[a.status]}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
