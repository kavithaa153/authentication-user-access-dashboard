
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import "./AuthPages.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Use at least 8 characters, including a letter and a number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const resetEmail = localStorage.getItem("accesshub_reset_email");
      const user = JSON.parse(
        localStorage.getItem("accesshub_user") || "null"
      );

      if (!resetEmail || !user || user.email.toLowerCase() !== resetEmail) {
        setError("Your reset session has expired. Please start again.");
        return;
      }

      localStorage.setItem(
        "accesshub_user",
        JSON.stringify({ ...user, password })
      );
      localStorage.removeItem("accesshub_reset_email");
      navigate("/login", {
        replace: true,
        state: { passwordReset: true }
      });
    } catch {
      setError("Unable to reset your password. Please try again.");
    }
  }

  return (
    <main className="simple-auth-page">
      <section className="simple-auth-card">
        <Link to="/login" className="simple-brand">
          <span className="simple-brand-mark">A</span>
          AccessHub
        </Link>

        <div className="simple-auth-icon"><LockKeyhole size={25} /></div>
        <span className="simple-eyebrow">ACCOUNT SECURITY</span>
        <h1>Reset password</h1>
        <p className="simple-description">
          Create a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="simple-auth-form">
          <label htmlFor="new-password">New password</label>
          <div className="simple-input">
            <LockKeyhole size={18} />
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="simple-eye-button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <label htmlFor="confirm-new-password">Confirm new password</label>
          <div className="simple-input">
            <LockKeyhole size={18} />
            <input
              id="confirm-new-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="simple-eye-button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="simple-hint">
            Include at least one letter and one number.
          </p>

          {error && <p className="simple-error" role="alert">{error}</p>}

          <button className="simple-primary-button" type="submit">
            Update password <span>→</span>
          </button>
        </form>

        <Link to="/login" className="simple-back-link">
          <ArrowLeft size={16} /> Back to sign in
        </Link>

        <p className="simple-security-note">
          <ShieldCheck size={15} /> AccessHub account security
        </p>
      </section>
    </main>
  );
}

export default ResetPassword;
