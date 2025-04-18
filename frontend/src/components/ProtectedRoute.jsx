import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    alert("🔐 You must be logged in to access this page.");
    return <Navigate to="/login" replace />;
  }

  return children;
}
