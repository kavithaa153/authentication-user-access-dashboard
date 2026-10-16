import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Bell,
  ShieldCheck,
  Palette,
  Save,
  RotateCcw,
  CheckCircle2,
  LockKeyhole
} from "lucide-react";
import "./Settings.css";

const defaultSettings = {
  name: "",
  email: "",
  emailNotifications: true,
  securityAlerts: true,
  productUpdates: false,
  twoFactorReminder: true,
  theme: "Light",
  sessionTimeout: "30 minutes"
};

function readStorage(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function applyTheme(theme) {
  const isDark =
    theme === "Dark" ||
    (theme === "System" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
}

function Settings() {
  const navigate = useNavigate();

  const [user] = useState(() => readStorage("accesshub_user"));

  const [settings, setSettings] = useState(() => {
    const saved = readStorage("accesshub_settings", {});

    return {
      ...defaultSettings,
      name: user?.name || "",
      email: user?.email || "",
      ...saved
    };
  });

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    applyTheme(settings.theme);

    if (settings.theme !== "System") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("System");

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [settings.theme]);

  function updateSetting(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value
    }));

    setNotice("");
    setError("");
  }

  function handleToggle(key) {
    updateSetting(key, !settings[key]);
  }

  function handleSave(event) {
    event.preventDefault();
    setNotice("");
    setError("");

    const name = settings.name.trim();
    const email = settings.email.trim().toLowerCase();

    if (!name || !email) {
      setError("Please enter your name and email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const updatedSettings = {
      ...settings,
      name,
      email
    };

    try {
      localStorage.setItem(
        "accesshub_settings",
        JSON.stringify(updatedSettings)
      );

      if (user) {
        localStorage.setItem(
          "accesshub_user",
          JSON.stringify({
            ...user,
            name,
            email
          })
        );
      }

      setSettings(updatedSettings);
      applyTheme(updatedSettings.theme);
      setNotice("Your settings have been saved successfully.");
    } catch {
      setError("Unable to save settings. Please try again.");
    }
  }

  function handleReset() {
    const resetSettings = {
      ...defaultSettings,
      name: user?.name || "",
      email: user?.email || ""
    };

    setSettings(resetSettings);
    applyTheme(resetSettings.theme);
    setNotice("");
    setError("");
  }

  return (
    <main className="settings-page">
      <header className="settings-header">
        <div>
          <p className="settings-eyebrow">WORKSPACE / PREFERENCES</p>
          <h1>Settings</h1>
          <p className="settings-subtitle">
            Manage your profile, notifications, security, and appearance.
          </p>
        </div>

        <button
          type="button"
          className="settings-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>
      </header>

      {notice && (
        <div className="settings-message settings-success" role="status">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="settings-message settings-error" role="alert">
          <ShieldCheck size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-icon">
              <UserRound size={21} />
            </span>
            <div>
              <h2>Profile Settings</h2>
              <p>Update your personal account information.</p>
            </div>
          </div>

          <div className="settings-profile-avatar">
            {(settings.name || "U").charAt(0).toUpperCase()}
          </div>

          <div className="settings-fields">
            <label>
              Full name
              <input
                value={settings.name}
                onChange={(event) =>
                  updateSetting("name", event.target.value)
                }
                placeholder="Enter your full name"
                required
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                value={settings.email}
                onChange={(event) =>
                  updateSetting("email", event.target.value)
                }
                placeholder="Enter your email address"
                required
              />
            </label>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-icon">
              <Bell size={21} />
            </span>
            <div>
              <h2>Notifications</h2>
              <p>Choose which notifications you want to receive.</p>
            </div>
          </div>

          <div className="settings-option-list">
            {[
              {
                key: "emailNotifications",
                title: "Email notifications",
                description: "Receive workspace updates by email."
              },
              {
                key: "securityAlerts",
                title: "Security alerts",
                description: "Get alerts about unusual sign-in activity."
              },
              {
                key: "productUpdates",
                title: "Product updates",
                description: "Receive news about features and improvements."
              },
              {
                key: "twoFactorReminder",
                title: "Two-factor reminders",
                description: "Remind me to review account protection options."
              }
            ].map((item) => (
              <div className="settings-option" key={item.key}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-label={item.title}
                  aria-checked={Boolean(settings[item.key])}
                  className={`settings-toggle ${
                    settings[item.key] ? "enabled" : ""
                  }`}
                  onClick={() => handleToggle(item.key)}
                >
                  <span />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-icon">
              <ShieldCheck size={21} />
            </span>
            <div>
              <h2>Security Preferences</h2>
              <p>Set your preferred session behavior.</p>
            </div>
          </div>

          <label className="settings-select-label">
            Session timeout
            <select
              value={settings.sessionTimeout}
              onChange={(event) =>
                updateSetting("sessionTimeout", event.target.value)
              }
            >
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>4 hours</option>
            </select>
          </label>

          <div className="settings-security-note">
            <LockKeyhole size={19} />
            <div>
              <strong>Account security</strong>
              <p>
                These are local demo preferences. Session timeout is saved
                as a preference but does not yet enforce automatic logout.
              </p>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-icon">
              <Palette size={21} />
            </span>
            <div>
              <h2>Appearance</h2>
              <p>Choose your preferred dashboard theme.</p>
            </div>
          </div>

          <div className="settings-theme-options">
            {["Light", "Dark", "System"].map((theme) => (
              <button
                type="button"
                key={theme}
                className={`settings-theme-option ${
                  settings.theme === theme ? "selected" : ""
                }`}
                aria-pressed={settings.theme === theme}
                onClick={() => updateSetting("theme", theme)}
              >
                <span
                  className={`settings-theme-preview theme-${theme.toLowerCase()}`}
                />
                <span>{theme}</span>
                <span className="settings-theme-radio" />
              </button>
            ))}
          </div>

          <p className="settings-theme-note">
            Your selected theme applies immediately and is saved when you
            click Save Changes.
          </p>
        </section>

        <footer className="settings-actions">
          <button
            type="button"
            className="settings-reset-button"
            onClick={handleReset}
          >
            <RotateCcw size={16} />
            Reset Form
          </button>

          <button type="submit" className="settings-save-button">
            <Save size={17} />
            Save Changes
          </button>
        </footer>
      </form>
    </main>
  );
}

export default Settings;