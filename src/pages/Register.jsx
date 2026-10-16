
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, LockKeyhole, Eye, EyeOff, ShieldCheck } from "lucide-react";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must have at least 8 characters, one letter and one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const existingUser = JSON.parse(
        localStorage.getItem("accesshub_user") || "null"
      );

      if (existingUser && existingUser.email.toLowerCase() === email.trim().toLowerCase()) {
        setError("An account with this email already exists.");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "accesshub_user",
        JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          createdAt: new Date().toISOString()
        })
      );

      navigate("/login", {
        state: { registered: true }
      });
    } catch {
      setError("Unable to save your account. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <section className="register-visual">
        <Link to="/login" className="register-brand">
          <span className="register-brand-mark">A</span>
          AccessHub
        </Link>

        <div className="register-visual-content">
          <span className="register-eyebrow">
            <ShieldCheck size={16} />
            YOUR WORKSPACE STARTS HERE
          </span>

          <h1>
            Create your account.
            <br />
            Unlock your workspace.
          </h1>

          <p>
            Set up your account to manage your profile and access your
            personal dashboard.
          </p>

          <div className="register-benefit">
            <ShieldCheck size={19} />
            Simple account management
          </div>
          <div className="register-benefit">
            <User size={19} />
            Your personal workspace
          </div>
        </div>

        <p className="register-visual-footer">
          Secure access, simplified.
        </p>
      </section>

      <section className="register-panel">
        <div className="register-card">
          <Link to="/login" className="register-brand register-mobile-brand">
            <span className="register-brand-mark">A</span>
            AccessHub
          </Link>

          <span className="register-welcome">GET STARTED</span>
          <h2>Create your account</h2>
          <p className="register-description">
            Enter your details to set up your workspace.
          </p>

          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="register-name">Full name</label>
            <div className="register-input-wrapper">
              <User size={18} />
              <input
                id="register-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </div>

            <label htmlFor="register-email">Email address</label>
            <div className="register-input-wrapper">
              <Mail size={18} />
              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>

            <label htmlFor="register-password">Password</label>
            <div className="register-input-wrapper">
              <LockKeyhole size={18} />
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="register-eye-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label htmlFor="register-confirm-password">Confirm password</label>
            <div className="register-input-wrapper">
              <LockKeyhole size={18} />
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="register-eye-button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="register-hint">
              Use at least 8 characters, including a letter and a number.
            </p>

            {error && (
              <p className="register-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="register-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <p className="register-login-prompt">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
