// src/components/VolunteerForm.jsx
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  User,
  Mail,
  Phone,
  Sparkles,
  Target,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Heart,
} from "lucide-react";

const SKILLS_OPTIONS = [
  "Teaching & Mentoring",
  "Fundraising",
  "Social Media & Marketing",
  "Medical & Healthcare",
  "Legal & Advocacy",
  "Event Management",
  "Graphic Design",
  "Web Development",
  "Content Writing",
  "Counselling & Support",
  "Photography & Videography",
  "Data Analysis",
];

const AREAS_OF_INTEREST = [
  "Child Education",
  "Women Empowerment",
  "Environment & Sustainability",
  "Healthcare & Wellness",
  "Rural Development",
  "Disaster Relief",
  "Digital Literacy",
  "Animal Welfare",
  "Senior Citizen Support",
  "Youth Development",
];

const initialState = {
  name: "",
  email: "",
  phone: "",
  skills: [],
  areaOfInterest: "",
  message: "",
};

export default function VolunteerForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "A valid email is required.";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit phone number.";
    if (form.skills.length === 0)
      e.skills = "Please select at least one skill.";
    if (!form.areaOfInterest) e.areaOfInterest = "Please select an area.";
    return e;
  };

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
    if (errors.skills) setErrors((e) => ({ ...e, skills: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setStatus(null);

    // Timeout after 10s so spinner never hangs forever
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setStatus("error");
      setErrorDetail("Request timed out. Check your Firestore rules and internet connection.");
    }, 10000);

    try {
      await addDoc(collection(db, "volunteers"), {
        ...form,
        registeredAt: serverTimestamp(),
      });
      clearTimeout(timeoutId);
      setStatus("success");
      setForm(initialState);
      setErrors({});
      setErrorDetail("");
      setTimeout(() => setStatus(null), 6000);
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Firestore error:", err.code, err.message);
      setErrorDetail(
        err.code === "permission-denied"
          ? "Permission denied. Please update your Firestore security rules to allow writes."
          : err.message || "Unknown error. Check the browser console."
      );
      setStatus("error");
      setTimeout(() => { setStatus(null); setErrorDetail(""); }, 8000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-hero">
      {/* Hero header */}
      <div className="hero-header">
        <div className="hero-badge">🌟 Join Our Mission</div>
        <h1 className="hero-title">
          Become a <span className="gradient-text">NayePankh</span> Volunteer
        </h1>
        <p className="hero-subtitle">
          Help us spread wings of hope. Register today and be part of a
          community creating meaningful change across India.
        </p>
        <div className="hero-stats">
          <div className="stat-pill">
            <span className="stat-num">2,400+</span> Volunteers
          </div>
          <div className="stat-pill">
            <span className="stat-num">18</span> States
          </div>
          <div className="stat-pill">
            <span className="stat-num">50K+</span> Lives Impacted
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="form-card">
        <div className="form-card-header">
          <h2 className="form-title">Volunteer Registration</h2>
          <p className="form-subtitle">
            Fill in the details below — it takes less than 2 minutes.
          </p>
        </div>

        {status === "success" && (
          <div className="alert alert-success">
            <CheckCircle size={20} />
            <div>
              <strong>Registration Successful!</strong>
              <p>
                Thank you for joining NayePankh! We'll reach out to you soon.
              </p>
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <div>
              <strong>Something went wrong.</strong>
              <p>{errorDetail || "Please try again or check your internet connection."}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="volunteer-form" noValidate>
          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="vol-name">
              <User size={15} /> Full Name *
            </label>
            <input
              id="vol-name"
              name="name"
              type="text"
              className={`form-input ${errors.name ? "input-error" : ""}`}
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <span className="error-msg">{errors.name}</span>
            )}
          </div>

          {/* Email + Phone */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="vol-email">
                <Mail size={15} /> Email Address *
              </label>
              <input
                id="vol-email"
                name="email"
                type="email"
                className={`form-input ${errors.email ? "input-error" : ""}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="error-msg">{errors.email}</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="vol-phone">
                <Phone size={15} /> Phone Number *
              </label>
              <input
                id="vol-phone"
                name="phone"
                type="tel"
                className={`form-input ${errors.phone ? "input-error" : ""}`}
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <span className="error-msg">{errors.phone}</span>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label className="form-label">
              <Sparkles size={15} /> Skills *
            </label>
            <p className="form-hint">Select all that apply</p>
            <div className="chips-grid">
              {SKILLS_OPTIONS.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  className={`chip ${
                    form.skills.includes(skill) ? "chip-active" : ""
                  }`}
                  onClick={() => toggleSkill(skill)}
                >
                  {form.skills.includes(skill) && <span>✓ </span>}
                  {skill}
                </button>
              ))}
            </div>
            {errors.skills && (
              <span className="error-msg">{errors.skills}</span>
            )}
          </div>

          {/* Area of Interest */}
          <div className="form-group">
            <label className="form-label" htmlFor="vol-area">
              <Target size={15} /> Area of Interest *
            </label>
            <div className="select-wrapper">
              <select
                id="vol-area"
                name="areaOfInterest"
                className={`form-input form-select ${
                  errors.areaOfInterest ? "input-error" : ""
                }`}
                value={form.areaOfInterest}
                onChange={handleChange}
              >
                <option value="">— Select an area —</option>
                {AREAS_OF_INTEREST.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
            {errors.areaOfInterest && (
              <span className="error-msg">{errors.areaOfInterest}</span>
            )}
          </div>

          {/* Optional message */}
          <div className="form-group">
            <label className="form-label" htmlFor="vol-message">
              Why do you want to volunteer? (Optional)
            </label>
            <textarea
              id="vol-message"
              name="message"
              className="form-input form-textarea"
              placeholder="Tell us a little about your motivation..."
              rows={3}
              value={form.message}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            id="submit-volunteer-form"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <Heart size={17} fill="currentColor" />
                Register as Volunteer
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
