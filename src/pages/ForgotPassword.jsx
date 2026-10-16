
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import "./AuthPages.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const user = JSON.parse(
        localStorage.getItem("accesshub_user") || "null"
      );

      if (!user || user.email.toLowerCase() !== cleanEmail) {
        setError("No account was found with this email address.");
        return;
      }

      localStorage.setItem("accesshub_reset_email", cleanEmail);
      navigate("/reset-password");
    } catch {
      setError("Unable to continue. Please try again.");
    }
  }

  return (
    <main className="simple-auth-page">
      <section className="simple-auth-card">
        <Link to="/login" className="simple-brand">
          <span className="simple-brand-mark">A</span>
          AccessHub
        </Link>

        <div className="simple-auth-icon"><Mail size={25} /></div>
        <span className="simple-eyebrow">ACCOUNT RECOVERY</span>
        <h1>Forgot password?</h1>
        <p className="simple-description">
          Enter the email address you used to register your account.
        </p>

        <form onSubmit={handleSubmit} className="simple-auth-form">
          <label htmlFor="recovery-email">Email address</label>
          <div className="simple-input">
            <Mail size={18} />
            <input
              id="recovery-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          {error && <p className="simple-error" role="alert">{error}</p>}

          <button className="simple-primary-button" type="submit">
            Continue <span>→</span>
          </button>
        </form>

        <Link to="/login" className="simple-back-link">
          <ArrowLeft size={16} /> Back to sign in
        </Link>

        <p className="simple-security-note">
          <ShieldCheck size={15} /> AccessHub account recovery
        </p>
      </section>
    </main>
  );
}

export default ForgotPassword;
