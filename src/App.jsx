// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import VolunteerForm from "./components/VolunteerForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UserAuth from "./components/UserAuth";
import UserDashboard from "./components/UserDashboard";
import { useAuth } from "./context/AuthContext";

// Redirect already-logged-in users away from auth pages
function GuestRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/my-dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public */}
            <Route path="/" element={<VolunteerForm />} />

            {/* Volunteer Auth */}
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <UserAuth mode="signup" />
                </GuestRoute>
              }
            />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <UserAuth mode="login" />
                </GuestRoute>
              }
            />

            {/* Volunteer Dashboard — protected */}
            <Route
              path="/my-dashboard"
              element={
                <ProtectedRoute redirectTo="/login">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute redirectTo="/admin/login">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
