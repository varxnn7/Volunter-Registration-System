// src/components/ProtectedRoute.jsx
// Guards routes — redirects unauthenticated users to the given path
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to={redirectTo} replace />;
}
