// src/components/UserAuth.jsx
// Combined Sign Up / Sign In page for volunteers
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle, Heart } from "lucide-react";

const googleProvider = new GoogleAuthProvider();

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

export default function UserAuth({ mode = "signup" }) {
  const [tab, setTab] = useState(mode); // "signup" | "login"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const resetForm = () => {
    setName(""); setEmail(""); setPassword(""); setConfirm(""); setError("");
  };

  const handleGoogleAuth = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/my-dashboard");
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (tab === "signup") {
      if (!name.trim()) return setError("Please enter your full name.");
      if (password.length < 6) return setError("Password must be at least 6 characters.");
      if (password !== confirm) return setError("Passwords do not match.");
      setLoading(true);
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name.trim() });
        navigate("/my-dashboard");
      } catch (err) {
        setError(
          err.code === "auth/email-already-in-use"
            ? "An account with this email already exists. Please sign in."
            : err.code === "auth/invalid-email"
            ? "Invalid email address."
            : "Sign up failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/my-dashboard");
      } catch (err) {
        setError(
          err.code === "auth/invalid-credential" ||
          err.code === "auth/user-not-found" ||
          err.code === "auth/wrong-password"
            ? "Invalid email or password."
            : "Sign in failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
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
          <p className="auth-logo-sub">Volunteer Portal</p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            id="tab-signup"
            className={`auth-tab ${tab === "signup" ? "auth-tab-active" : ""}`}
            onClick={() => { setTab("signup"); resetForm(); }}
            type="button"
          >
            <UserPlus size={15} /> Sign Up
          </button>
          <button
            id="tab-login"
            className={`auth-tab ${tab === "login" ? "auth-tab-active" : ""}`}
            onClick={() => { setTab("login"); resetForm(); }}
            type="button"
          >
            <LogIn size={15} /> Sign In
          </button>
        </div>

        <p className="auth-subtitle">
          {tab === "signup"
            ? "Create an account to register as a volunteer"
            : "Welcome back! Sign in to your volunteer account"}
        </p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Google */}
        <button
          id="google-volunteer-btn"
          className="btn btn-google"
          onClick={handleGoogleAuth}
          disabled={googleLoading || loading}
          type="button"
        >
          {googleLoading ? <span className="spinner spinner-dark" /> : <GoogleIcon />}
          {tab === "signup" ? "Sign up with Google" : "Sign in with Google"}
        </button>

        <div className="auth-divider">
          <span>or use email</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Name — only on signup */}
          {tab === "signup" && (
            <div className="form-group">
              <label className="form-label" htmlFor="user-name">
                <User size={15} /> Full Name
              </label>
              <input
                id="user-name"
                type="text"
                className="form-input"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="user-email">
              <Mail size={15} /> Email Address
            </label>
            <input
              id="user-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="user-password">
              <Lock size={15} /> Password
            </label>
            <input
              id="user-password"
              type="password"
              className="form-input"
              placeholder={tab === "signup" ? "Min. 6 characters" : "••••••••"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {tab === "signup" && (
            <div className="form-group">
              <label className="form-label" htmlFor="user-confirm">
                <Lock size={15} /> Confirm Password
              </label>
              <input
                id="user-confirm"
                type="password"
                className="form-input"
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          )}

          <button
            id="user-auth-submit"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <span className="spinner" />
            ) : tab === "signup" ? (
              <><UserPlus size={17} /> Create Account</>
            ) : (
              <><LogIn size={17} /> Sign In</>
            )}
          </button>
        </form>

        {/* Already registered? */}
        <p className="auth-switch">
          {tab === "signup" ? (
            <>Already have an account?{" "}
              <button className="auth-switch-btn" onClick={() => { setTab("login"); resetForm(); }}>Sign in</button>
            </>
          ) : (
            <>New volunteer?{" "}
              <button className="auth-switch-btn" onClick={() => { setTab("signup"); resetForm(); }}>Create account</button>
            </>
          )}
        </p>

        <p className="auth-hint" style={{ marginTop: "0.75rem" }}>
          Are you an admin?{" "}
          <Link to="/admin/login" className="auth-link">Admin login →</Link>
        </p>
      </div>
    </div>
  );
}
