import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import UploadPage from "./pages/Upload";
import HomePage from "./pages/Home";

import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import { DashboardPage } from "./pages/Dashboard";
import { ProcessingPage } from "./pages/Processing";

import AuditOnly from "./pages/Results/audit-only";
import ComplianceOnly from "./pages/Results/compliance-only";
import FullPipeline from "./pages/Results/full-pipeline";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<HomePage />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* PROTECTED ROUTES */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/processing/:transcriptId"
        element={
          <ProtectedRoute>
            <ProcessingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* RESULT ROUTES */}
      <Route
        path="/results/audit"
        element={
          <ProtectedRoute>
            <AuditOnly />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results/compliance"
        element={
          <ProtectedRoute>
            <ComplianceOnly />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results/full-pipeline/:caseId"
        element={
          <ProtectedRoute>
            <FullPipeline />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;
