// src/components/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import VolunteerTable from "./VolunteerTable";
import {
  Users,
  MapPin,
  TrendingUp,
  RefreshCw,
  LogOut,
  Heart,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchVolunteers = async () => {
    setLoading(true);
    setError("");
    try {
      const q = query(collection(db, "volunteers"), orderBy("registeredAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVolunteers(data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error(err);
      setError("Failed to load volunteer data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Stats
  const totalVolunteers = volunteers.length;
  const uniqueAreas = new Set(volunteers.map((v) => v.areaOfInterest)).size;
  const todayCount = volunteers.filter((v) => {
    if (!v.registeredAt?.toDate) return false;
    const d = v.registeredAt.toDate();
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="dashboard-page">
      {/* Dashboard header */}
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <div className="dashboard-logo">
            <Heart size={22} fill="currentColor" />
          </div>
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">
              Signed in as <strong>{currentUser?.email}</strong>
            </p>
          </div>
        </div>
        <div className="dashboard-actions">
          <button
            id="refresh-btn"
            className="btn btn-ghost"
            onClick={fetchVolunteers}
            disabled={loading}
            title="Refresh data"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            Refresh
          </button>
          <button
            id="dashboard-logout-btn"
            className="btn btn-outline-sm"
            onClick={handleLogout}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-blue">
          <div className="stat-card-icon">
            <Users size={22} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-num">
              {loading ? "—" : totalVolunteers}
            </span>
            <span className="stat-card-label">Total Volunteers</span>
          </div>
        </div>

        <div className="stat-card stat-card-orange">
          <div className="stat-card-icon">
            <TrendingUp size={22} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-num">
              {loading ? "—" : todayCount}
            </span>
            <span className="stat-card-label">Registered Today</span>
          </div>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-card-icon">
            <Target size={22} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-num">
              {loading ? "—" : uniqueAreas}
            </span>
            <span className="stat-card-label">Areas Covered</span>
          </div>
        </div>

        <div className="stat-card stat-card-purple">
          <div className="stat-card-icon">
            <MapPin size={22} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-num">
              {loading
                ? "—"
                : volunteers.length > 0
                ? new Set(volunteers.flatMap((v) => v.skills || [])).size
                : 0}
            </span>
            <span className="stat-card-label">Unique Skills</span>
          </div>
        </div>
      </div>

      {/* Last refreshed */}
      {lastRefreshed && (
        <p className="last-refreshed">
          Last updated: {lastRefreshed.toLocaleTimeString()}
        </p>
      )}

      {/* Table section */}
      <div className="table-section">
        <div className="table-section-header">
          <h2 className="section-title">Volunteer Records</h2>
          <p className="section-subtitle">
            Search, filter, and export volunteer data
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading volunteer data...</p>
          </div>
        ) : (
          <VolunteerTable volunteers={volunteers} />
        )}
      </div>
    </div>
  );
}
