import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, FileText, CheckCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/common/Navbar";

export function ProcessingPage() {
  const navigate = useNavigate();
  const { transcriptId } = useParams();

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [serviceType, setServiceType] = useState("full-pipeline");
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState("PROCESSING");
  const [uploadData, setUploadData] = useState({ metadata: {}, files: [] });
  // const caseId = uploadData.metadata?.caseId ?? transcriptId;

  // Fetch transcript status from backend
  useEffect(() => {
    if (!transcriptId) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/transcripts/${transcriptId}/status`,
          { credentials: "include" }
        );
        if (!res.ok) return;

        const data = await res.json();

        setProgress(data.progress || 0);
        setServiceType(data.service || "full-pipeline");
        setSteps(data.steps || []);
        setStatus(data.status || "PROCESSING");

        setUploadData({
          metadata: data.metadata || {},
          files: data.files || [],
        });

        const stepIndex = data.steps?.findIndex(
          (s) => s.name === data.currentStep
        );
        setCurrentStep(stepIndex === -1 ? 0 : stepIndex);

        if (data.status === "COMPLETED") {
          if (data.status === "COMPLETED") {
            const resolvedCaseId = data.metadata?.caseId ?? transcriptId;

            setTimeout(() => {
              navigate(`/results/full-pipeline/${resolvedCaseId}`);
            }, 1000);
          }
        }
      } catch (err) {
        console.error("Status fetch failed", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);

    return () => clearInterval(interval);
  }, [transcriptId, navigate]);

  const totalPages =
    uploadData.files.reduce(
      (acc, file) => acc + Math.floor(file.size / 50000),
      0
    ) || 245;

  const serviceNames = {
    "full-pipeline": "Full Pipeline (Code Extraction + Audit)",
    "audit-only": "Audit Only",
    "compliance-only": "Policy & Regulatory Compliance",
  };

  const handleGoToResults = () => {
    const resolvedCaseId = uploadData.metadata?.caseId ?? transcriptId;

    navigate(`/results/full-pipeline/${resolvedCaseId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showNavLinks={false} />

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-[#11d462]/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Brain className="w-10 h-10 text-[#11d462]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-transparent border-t-[#11d462] rounded-full"
            />
          </div>
          <h1 className="text-3xl mb-2 text-foreground">
            Processing Your Request
          </h1>
          <p className="text-muted-foreground mb-2">
            {serviceNames[serviceType]}
          </p>
          <p className="text-sm text-muted-foreground">
            Case ID: {uploadData.metadata.caseId || "N/A"}
          </p>

          {/* Manual Skip Button */}
          <button
            onClick={handleGoToResults}
            className="mt-4 px-4 py-2 rounded bg-[#11d462] text-white hover:bg-green-600 transition"
          >
            Go to Results
          </button>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-foreground">Overall Progress</span>
            <span className="text-[#11d462]">{Math.floor(progress)}%</span>
          </div>
          <div className="h-4 bg-secondary rounded-full overflow-hidden border border-green-900">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-[#11d462] rounded-full"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-[#11d462]/5 border border-border rounded-xl p-6 text-center">
            <FileText className="w-8 h-8 text-[#11d462] mx-auto mb-2" />
            <div className="text-2xl text-foreground mb-1">
              {uploadData.files.length}
            </div>
            <div className="text-sm text-muted-foreground">Files Uploaded</div>
          </div>

          <div className="bg-[#11d462]/5 border border-border rounded-xl p-6 text-center">
            <Loader2 className="w-8 h-8 text-[#11d462] mx-auto mb-2 animate-spin" />
            <div className="text-2xl text-foreground mb-1">
              {Math.floor((progress / 100) * totalPages)}
            </div>
            <div className="text-sm text-muted-foreground">Pages Processed</div>
          </div>

          <div className="bg-[#11d462]/5 border border-border rounded-xl p-6 text-center">
            <Loader2 className="w-8 h-8 text-[#11d462] mx-auto mb-2 animate-spin" />
            <div className="text-2xl text-foreground mb-1">
              {Math.floor(progress)}
            </div>
            <div className="text-sm text-muted-foreground">Processing %</div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-[#11d462]/5 border border-border rounded-xl p-6">
          <h3 className="text-foreground mb-6">Processing Pipeline</h3>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    isCurrent
                      ? "bg-[#11d462]/10 border border-[#11d462]"
                      : "bg-secondary"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#11d462] text-[#11d462]-foreground">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                  </div>
                  <div>
                    <div className="text-foreground">{step.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
