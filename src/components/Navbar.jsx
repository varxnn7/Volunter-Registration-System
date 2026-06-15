// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Heart, LayoutDashboard, LogIn, UserPlus, User } from "lucide-react";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminArea = location.pathname.startsWith("/admin");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">
            <Heart size={20} fill="currentColor" />
          </span>
          <div className="brand-text">
            <span className="brand-name">NayePankh</span>
            <span className="brand-sub">Foundation</span>
          </div>
        </Link>

        <div className="navbar-actions">
          {currentUser ? (
            // Logged-in user (volunteer or admin)
            <>
              {isAdminArea ? (
                <Link to="/admin/dashboard" className="nav-link">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              ) : (
                <Link to="/my-dashboard" className="nav-link">
                  <User size={16} />
                  My Dashboard
                </Link>
              )}
              <button className="btn btn-outline-sm" onClick={handleLogout} id="navbar-logout-btn">
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : isAdminArea ? (
            // Admin login area
            <Link to="/admin/login" className="btn btn-outline-sm">
              <LogIn size={15} />
              Admin Login
            </Link>
          ) : (
            // Public area — show Sign Up + Sign In for volunteers
            <>
              <Link to="/login" className="nav-link" id="navbar-login-link">
                <LogIn size={16} />
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary-sm" id="navbar-signup-link">
                <UserPlus size={15} />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
