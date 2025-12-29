import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../lib/auth";

export default function PublicRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    isAuthenticated().then((ok) => setAllowed(!ok));
  }, []);

  if (allowed === null) return null;
  return allowed ? children : <Navigate to="/dashboard" replace />;
}
