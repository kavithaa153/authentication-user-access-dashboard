
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck
} from "lucide-react";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(
    location.state?.registered
      ? "Account created successfully. Please sign in."
      : ""
  );
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(
        localStorage.getItem("accesshub_user") || "null"
      );

      if (
        !user ||
        typeof user.email !== "string" ||
        typeof user.password !== "string" ||
        user.email.toLowerCase() !== cleanEmail ||
        user.password !== password
      ) {
        setError("Incorrect email or password. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("accesshub_session", "true");
      localStorage.setItem("accesshub_remember", String(remember));
      localStorage.setItem(
        "accesshub_last_login",
        new Date().toISOString()
      );

      navigate("/dashboard", { replace: true });
    } catch {
      setError("Unable to sign in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link to="/login" className="brand">
          <span className="brand-mark">A</span>
          AccessHub
        </Link>

        <div className="visual-content">
          <span className="eyebrow">
            <ShieldCheck size={16} />
            SECURE ACCESS MANAGEMENT
          </span>

          <h1>
            One account.
            <br />
            Many possibilities.
          </h1>

          <p>
            A smarter, safer way to access your workspace,
            manage your profile, and stay connected.
          </p>
        </div>

        <div className="visual-footer">
          <span className="status-dot" />
          Your security is our priority
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand brand">
            <span className="brand-mark">A</span>
            AccessHub
          </div>

          <span className="welcome-label">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="auth-description">
            Enter your details to continue to your workspace.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Email address</label>

            <div className="input-wrapper">
              <Mail size={18} />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="password-label">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <div className="input-wrapper">
              <LockKeyhole size={18} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="remember-option">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <span>Remember me</span>
            </label>

            {success && (
              <p className="form-success" role="status">
                {success}
              </p>
            )}

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <p className="signup-prompt">
            Don't have an account?{" "}
            <Link to="/register">Create account</Link>
          </p>

          <p className="security-note">
            <LockKeyhole size={14} />
            Secure access to your personal workspace
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
