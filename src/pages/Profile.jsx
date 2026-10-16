
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
  Pencil,
  Save,
  X,
  CheckCircle2
} from "lucide-react";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem("accesshub_user") || "null");
    } catch {
      return null;
    }
  }

  const user = getUser();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const completionFields = [form.name, form.email, form.phone];
  const completion = Math.round(
    (completionFields.filter((value) => value.trim()).length / 3) * 100
  );

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setNotice("");
  }

  function handleSave(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (phone && !/^[+()\d\s-]{7,20}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      const latestUser = getUser();

      if (!latestUser) {
        setError("Account details were not found. Please sign in again.");
        return;
      }

      const updatedUser = { ...latestUser, name, email, phone };

      localStorage.setItem(
        "accesshub_user",
        JSON.stringify(updatedUser)
      );

      setForm({ name, email, phone });
      setEditing(false);
      setNotice("Profile updated successfully.");
    } catch {
      setError("Unable to save your profile. Please try again.");
    }
  }

  function handleCancel() {
    const latestUser = getUser();

    setForm({
      name: latestUser?.name || "",
      email: latestUser?.email || "",
      phone: latestUser?.phone || ""
    });

    setEditing(false);
    setError("");
    setNotice("");
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
      })
    : "Not available";

  return (
    <main className="profile-page">
      <header className="profile-header">
        <div>
          <p className="profile-eyebrow">WORKSPACE / ACCOUNT</p>
          <h1>My Profile</h1>
          <p className="profile-subtitle">
            View and manage your personal account information.
          </p>
        </div>

        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>
      </header>

      {notice && (
        <div className="profile-message profile-success" role="status">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="profile-message profile-error" role="alert">
          {error}
        </div>
      )}

      <section className="profile-hero-card">
        <div className="profile-avatar-large">
          {(form.name || "U").charAt(0).toUpperCase()}
        </div>

        <div className="profile-hero-info">
          <h2>{form.name || "Your Name"}</h2>
          <p>{form.email || "No email address"}</p>
          <span className="profile-active-badge">
            <span />
            Account active
          </span>
        </div>

        {!editing && (
          <button
            className="profile-edit-button"
            onClick={() => {
              setEditing(true);
              setNotice("");
              setError("");
            }}
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </section>

      <div className="profile-content-grid">
        <section className="profile-card">
          <div className="profile-card-heading">
            <div>
              <h2>Personal Information</h2>
              <p>Your account details</p>
            </div>
            <UserRound size={21} />
          </div>

          <form onSubmit={handleSave}>
            <div className="profile-field">
              <label htmlFor="profile-name">Full name</label>
              <div className="profile-input-wrap">
                <UserRound size={17} />
                <input
                  id="profile-name"
                  value={form.name}
                  disabled={!editing}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="profile-email">Email address</label>
              <div className="profile-input-wrap">
                <Mail size={17} />
                <input
                  id="profile-email"
                  type="email"
                  value={form.email}
                  disabled={!editing}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="profile-phone">Phone number</label>
              <div className="profile-input-wrap">
                <Phone size={17} />
                <input
                  id="profile-phone"
                  type="tel"
                  value={form.phone}
                  disabled={!editing}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {editing && (
              <div className="profile-form-actions">
                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={handleCancel}
                >
                  <X size={16} />
                  Cancel
                </button>

                <button type="submit" className="profile-save-button">
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </section>

        <div className="profile-side-column">
          <section className="profile-card">
            <div className="profile-card-heading">
              <div>
                <h2>Profile Completion</h2>
                <p>Complete your account details</p>
              </div>
              <ShieldCheck size={21} />
            </div>

            <div className="profile-progress-heading">
              <strong>{completion}%</strong>
              <span>completed</span>
            </div>

            <div
              className="profile-progress-track"
              role="progressbar"
              aria-valuenow={completion}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${completion}%` }} />
            </div>

            <div className="profile-checklist">
              <p className={form.name.trim() ? "completed" : ""}>
                <CheckCircle2 size={16} />
                Full name
              </p>
              <p className={form.email.trim() ? "completed" : ""}>
                <CheckCircle2 size={16} />
                Email address
              </p>
              <p className={form.phone.trim() ? "completed" : ""}>
                <CheckCircle2 size={16} />
                Phone number
              </p>
            </div>
          </section>

          <section className="profile-card">
            <div className="profile-card-heading">
              <div>
                <h2>Account Information</h2>
                <p>Account overview</p>
              </div>
              <ShieldCheck size={21} />
            </div>

            <div className="profile-info-row">
              <span>Account status</span>
              <strong className="profile-status">Active</strong>
            </div>

            <div className="profile-info-row">
              <span>Member since</span>
              <strong>{memberSince}</strong>
            </div>

            <div className="profile-info-row">
              <span>Account type</span>
              <strong>Standard</strong>
            </div>

            <div className="profile-info-row">
              <span>Profile fields</span>
              <strong>{completionFields.filter((value) => value.trim()).length}/3</strong>
            </div>

            <div className="profile-member-note">
              <CalendarDays size={18} />
              <span>Your profile information is stored locally in this demo.</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Profile;
