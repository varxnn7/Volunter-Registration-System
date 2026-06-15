// src/components/AdminLogin.jsx
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, AlertCircle, Heart } from "lucide-react";

const googleProvider = new GoogleAuthProvider();

// Google "G" SVG icon
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.4 35.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.2 5.2C37 36.9 44 31 44 24c0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential" ||
          err.code === "auth/user-not-found" ||
          err.code === "auth/wrong-password"
          ? "Invalid email or password. Please try again."
          : "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized. Add it in Firebase Console → Authentication → Settings → Authorized domains.");
      } else {
        setError("Google sign-in failed. Make sure Google is enabled in Firebase Console → Authentication.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Heart size={28} fill="currentColor" />
          </div>
          <h1 className="auth-logo-name">NayePankh</h1>
          <p className="auth-logo-sub">Admin Portal</p>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to manage volunteer registrations</p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign-In */}
        <button
          id="google-login-btn"
          className="btn btn-google"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          type="button"
        >
          {googleLoading ? <span className="spinner spinner-dark" /> : <GoogleIcon />}
          Continue with Google
        </button>

        {/* Divider */}
        <div className="auth-divider">
          <span>or sign in with email</span>
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleLogin} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">
              <Mail size={15} /> Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              className="form-input"
              placeholder="admin@nayepankh.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              <Lock size={15} /> Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <LogIn size={17} />
                Sign In with Email
              </>
            )}
          </button>
        </form>

        <p className="auth-hint">
          🔒 This portal is restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
}
