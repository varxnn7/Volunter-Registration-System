// src/components/UserDashboard.jsx
// Personal dashboard for logged-in volunteers
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Sparkles,
  Target,
  LogOut,
  Heart,
  CheckCircle,
  ClipboardList,
  Calendar,
} from "lucide-react";

export default function UserDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRegistration = async () => {
      if (!currentUser) return;
      try {
        // Look up by email — works whether they used email/password or Google
        const q = query(
          collection(db, "volunteers"),
          where("email", "==", currentUser.email)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setRegistration({ id: snap.docs[0].id, ...snap.docs[0].data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRegistration();
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const displayName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "Volunteer";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="user-dash-header">
        <div className="user-dash-welcome">
          <div className="user-avatar">{avatarLetter}</div>
          <div>
            <h1 className="user-dash-title">Hello, {displayName}! 👋</h1>
            <p className="user-dash-subtitle">{currentUser?.email}</p>
          </div>
        </div>
        <button className="btn btn-outline-sm" onClick={handleLogout} id="user-logout-btn">
          <LogOut size={15} /> Logout
        </button>
      </div>

      {/* Status banner */}
      {!loading && (
        <div className={`status-banner ${registration ? "status-banner-success" : "status-banner-pending"}`}>
          {registration ? (
            <>
              <CheckCircle size={22} />
              <div>
                <strong>Registration Complete</strong>
                <p>Your volunteer registration has been submitted successfully!</p>
              </div>
            </>
          ) : (
            <>
              <ClipboardList size={22} />
              <div>
                <strong>Registration Pending</strong>
                <p>You haven't filled in the volunteer registration form yet.</p>
              </div>
            </>
          )}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading your profile...</p>
        </div>
      ) : registration ? (
        // Show registration details
        <div className="reg-card">
          <div className="reg-card-header">
            <Heart size={18} fill="currentColor" className="reg-card-icon" />
            <h2 className="reg-card-title">Your Registration Details</h2>
          </div>

          <div className="reg-details-grid">
            <div className="reg-detail-item">
              <span className="reg-detail-label"><User size={13} /> Full Name</span>
              <span className="reg-detail-value">{registration.name}</span>
            </div>
            <div className="reg-detail-item">
              <span className="reg-detail-label"><Mail size={13} /> Email</span>
              <span className="reg-detail-value">{registration.email}</span>
            </div>
            <div className="reg-detail-item">
              <span className="reg-detail-label"><Phone size={13} /> Phone</span>
              <span className="reg-detail-value">{registration.phone}</span>
            </div>
            <div className="reg-detail-item">
              <span className="reg-detail-label"><Target size={13} /> Area of Interest</span>
              <span className="reg-detail-value">
                <span className="area-badge">{registration.areaOfInterest}</span>
              </span>
            </div>
            <div className="reg-detail-item reg-detail-full">
              <span className="reg-detail-label"><Sparkles size={13} /> Skills</span>
              <div className="skill-tags" style={{ marginTop: "0.4rem" }}>
                {(registration.skills || []).map((s) => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
            </div>
            {registration.message && (
              <div className="reg-detail-item reg-detail-full">
                <span className="reg-detail-label">💬 Motivation</span>
                <span className="reg-detail-value reg-detail-message">{registration.message}</span>
              </div>
            )}
            <div className="reg-detail-item">
              <span className="reg-detail-label"><Calendar size={13} /> Registered On</span>
              <span className="reg-detail-value">
                {registration.registeredAt?.toDate
                  ? registration.registeredAt.toDate().toLocaleDateString("en-IN", {
                      day: "2-digit", month: "long", year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
          </div>

          <div className="reg-card-footer">
            <p>Want to update your details? Contact the NayePankh team.</p>
          </div>
        </div>
      ) : (
        // Not yet registered
        <div className="not-registered-card">
          <div className="not-reg-icon">📋</div>
          <h2>Complete Your Registration</h2>
          <p>
            You've created an account but haven't submitted your volunteer registration form yet.
            Fill it in now to get started!
          </p>
          <Link to="/" className="btn btn-primary" id="go-to-form-btn">
            <Heart size={17} fill="currentColor" />
            Fill Registration Form
          </Link>
        </div>
      )}
    </div>
  );
}
