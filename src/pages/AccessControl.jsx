
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  FileText,
  Settings,
  Download,
  Save,
  RotateCcw,
  ArrowLeft,
  LockKeyhole
} from "lucide-react";
import "./AccessControl.css";

const defaultPermissions = {
  Admin: {
    dashboard: true,
    viewUsers: true,
    createUsers: true,
    editUsers: true,
    deleteUsers: true,
    viewReports: true,
    exportReports: true,
    manageSettings: true
  },
  Editor: {
    dashboard: true,
    viewUsers: true,
    createUsers: true,
    editUsers: true,
    deleteUsers: false,
    viewReports: true,
    exportReports: false,
    manageSettings: false
  },
  Viewer: {
    dashboard: true,
    viewUsers: true,
    createUsers: false,
    editUsers: false,
    deleteUsers: false,
    viewReports: true,
    exportReports: false,
    manageSettings: false
  }
};

const permissionGroups = [
  {
    title: "Dashboard",
    description: "Access workspace overview and metrics.",
    icon: ShieldCheck,
    items: [
      { key: "dashboard", label: "View dashboard", description: "View workspace overview and summary cards." }
    ]
  },
  {
    title: "User Management",
    description: "Control access to workspace user records.",
    icon: Users,
    items: [
      { key: "viewUsers", label: "View users", description: "View the list of workspace users." },
      { key: "createUsers", label: "Create users", description: "Add new users to the workspace." },
      { key: "editUsers", label: "Edit users", description: "Update user details and status." },
      { key: "deleteUsers", label: "Delete users", description: "Remove users from the workspace." }
    ]
  },
  {
    title: "Reports",
    description: "Manage reporting and data exports.",
    icon: FileText,
    items: [
      { key: "viewReports", label: "View reports", description: "Access reports and analytics." },
      { key: "exportReports", label: "Export reports", description: "Download report data." }
    ]
  },
  {
    title: "Settings",
    description: "Control workspace configuration.",
    icon: Settings,
    items: [
      { key: "manageSettings", label: "Manage settings", description: "Update workspace configuration." }
    ]
  }
];

function AccessControl() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [permissions, setPermissions] = useState(() => {
    try {
      const saved = localStorage.getItem("accesshub_permissions");
      return saved ? JSON.parse(saved) : defaultPermissions;
    } catch {
      return defaultPermissions;
    }
  });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem("accesshub_permissions", JSON.stringify(permissions));
  }, [permissions]);

  const rolePermissions = permissions[selectedRole] || defaultPermissions[selectedRole];

  function togglePermission(key) {
    setPermissions((current) => ({
      ...current,
      [selectedRole]: {
        ...(current[selectedRole] || defaultPermissions[selectedRole]),
        [key]: !rolePermissions[key]
      }
    }));
    setNotice("");
  }

  function resetPermissions() {
    setPermissions((current) => ({
      ...current,
      [selectedRole]: { ...defaultPermissions[selectedRole] }
    }));
    setNotice(`${selectedRole} permissions restored to defaults.`);
  }

  function savePermissions() {
    localStorage.setItem("accesshub_permissions", JSON.stringify(permissions));
    setNotice(`${selectedRole} permissions saved successfully.`);
  }

  const enabledCount = Object.values(rolePermissions).filter(Boolean).length;
  const totalCount = Object.keys(rolePermissions).length;

  return (
    <main className="access-page">
      <header className="access-header">
        <div>
          <p className="access-eyebrow">WORKSPACE / SECURITY</p>
          <h1>Access Control</h1>
          <p className="access-subtitle">
            Manage roles and configure workspace permissions.
          </p>
        </div>
        <button className="access-back-button" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={17} /> Dashboard
        </button>
      </header>

      {notice && (
        <div className="access-notice" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">×</button>
        </div>
      )}

      <section className="access-overview">
        <div className="access-overview-icon">
          <LockKeyhole size={25} />
        </div>
        <div className="access-overview-copy">
          <h2>Role-Based Access Control</h2>
          <p>
            Select a role to review and configure its permissions.
            Changes are stored in this browser for this demo.
          </p>
        </div>
        <div className="access-overview-count">
          <strong>{enabledCount}/{totalCount}</strong>
          <span>Permissions enabled</span>
        </div>
      </section>

      <section className="access-role-card">
        <div className="access-role-heading">
          <div>
            <h2>Select a role</h2>
            <p>Choose which role you want to configure.</p>
          </div>
        </div>

        <div className="access-role-options">
          {Object.keys(defaultPermissions).map((role) => (
            <button
              key={role}
              className={`access-role-option ${selectedRole === role ? "selected" : ""}`}
              onClick={() => {
                setSelectedRole(role);
                setNotice("");
              }}
            >
              <span className="access-role-icon"><Users size={20} /></span>
              <span>
                <strong>{role}</strong>
                <small>
                  {role === "Admin"
                    ? "Full workspace access"
                    : role === "Editor"
                    ? "Manage selected resources"
                    : "Read-only access"}
                </small>
              </span>
              <span className="access-role-radio" />
            </button>
          ))}
        </div>
      </section>

      <section className="access-permissions-heading">
        <div>
          <h2>{selectedRole} Permissions</h2>
          <p>Turn permissions on or off for this role.</p>
        </div>
        <span className="access-count-badge">
          {enabledCount} of {totalCount} enabled
        </span>
      </section>

      <div className="access-permission-groups">
        {permissionGroups.map((group) => {
          const Icon = group.icon;

          return (
            <section className="access-permission-card" key={group.title}>
              <header>
                <span className="access-group-icon"><Icon size={20} /></span>
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
              </header>

              <div className="access-permission-list">
                {group.items.map((item) => (
                  <div className="access-permission-row" key={item.key}>
                    <div>
                      <strong>{item.label}</strong>
                      <p>{item.description}</p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(rolePermissions[item.key])}
                      aria-label={`${item.label} permission`}
                      className={`access-toggle ${rolePermissions[item.key] ? "enabled" : ""}`}
                      onClick={() => togglePermission(item.key)}
                    >
                      <span />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="access-actions">
        <div>
          <ShieldCheck size={18} />
          <span>Review changes before saving.</span>
        </div>
        <div className="access-action-buttons">
          <button className="access-reset-button" onClick={resetPermissions}>
            <RotateCcw size={16} /> Reset
          </button>
          <button className="access-save-button" onClick={savePermissions}>
            <Save size={16} /> Save Permissions
          </button>
        </div>
      </footer>
    </main>
  );
}

export default AccessControl;
