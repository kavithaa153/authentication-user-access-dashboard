
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Settings,
  Bell,
  Search,
  LogOut,
  UserRound,
  Activity,
  ArrowUpRight,
  Eye
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("accesshub_user") || "null");
  } catch {
    user = null;
  }

  function handleLogout() {
    localStorage.removeItem("accesshub_session");
    navigate("/login", { replace: true });
  }

  const stats = [
    { title: "Total Users", value: "2,450", change: "+12.5%", icon: Users },
    { title: "Active Sessions", value: "1,284", change: "+8.2%", icon: Activity },
    { title: "Security Score", value: "98.5%", change: "+2.4%", icon: ShieldCheck },
    { title: "Access Requests", value: "36", change: "+5.1%", icon: UserRound }
  ];

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span className="dashboard-brand-icon">
            <ShieldCheck size={23} />
          </span>
          <span>AccessHub</span>
        </div>

        <p className="sidebar-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          <button className="sidebar-link active" onClick={() => navigate("/dashboard")}>
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          <button className="sidebar-link" onClick={() => navigate("/users")}>
            <Users size={19} />
            <span>Users</span>
          </button>

          <button className="sidebar-link" onClick={() => navigate("/access-control")}>
            <ShieldCheck size={19} />
            <span>Access Control</span>
          </button>

          <button className="sidebar-link" onClick={() => navigate("/activity-logs")}>
            <Activity size={19} />
            <span>Activity Logs</span>
          </button>

          <button className="sidebar-link" onClick={() => navigate("/settings")}>
            <Settings size={19} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-security">
            <ShieldCheck size={22} />
            <div>
              <strong>Account protected</strong>
              <p>Your workspace is active.</p>
            </div>
          </div>

          <button className="sidebar-link" onClick={() => navigate("/profile")}>
            <UserRound size={19} />
            <span>My Profile</span>
          </button>

          <button className="sidebar-link logout-link" onClick={handleLogout}>
            <LogOut size={19} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">WORKSPACE OVERVIEW</p>
            <h1>Dashboard</h1>
          </div>

          <div className="dashboard-header-actions">
            <label className="dashboard-search">
              <Search size={18} />
              <input placeholder="Search..." aria-label="Search dashboard" />
            </label>

            <button
              className="notification-button"
              aria-label="View activity logs"
              onClick={() => navigate("/activity-logs")}
            >
              <Bell size={20} />
              <span />
            </button>

            <button
              className="dashboard-avatar"
              aria-label="Open profile"
              onClick={() => navigate("/profile")}
            >
              {(user?.name || "U").charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        <section className="dashboard-welcome">
          <div>
            <p>WELCOME BACK</p>
            <h2>Hello, {user?.name || "User"}! 👋</h2>
            <span>Here is what's happening in your workspace today.</span>
          </div>

          <div className="welcome-shield">
            <ShieldCheck size={76} strokeWidth={1.2} />
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Overview</h2>
              <p>Key workspace metrics</p>
            </div>

            <span className="live-status">
              <span />
              Live overview
            </span>
          </div>

          <div className="dashboard-stats">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article className="stat-card" key={stat.title}>
                  <div className="stat-card-top">
                    <span className="stat-icon">
                      <Icon size={21} />
                    </span>
                    <ArrowUpRight size={18} className="stat-arrow" />
                  </div>

                  <p>{stat.title}</p>
                  <h3>{stat.value}</h3>

                  <span className="stat-change">
                    {stat.change} <span>from last month</span>
                  </span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="dashboard-bottom-grid">
          <article className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent Activity</h2>
                <p>Latest workspace events</p>
              </div>
              <Activity size={20} />
            </div>

            <div className="activity-empty">
              <Activity size={30} />
              <strong>No recent activity</strong>
              <p>Workspace activity will appear here.</p>

              <button
                className="view-profile-button"
                onClick={() => navigate("/activity-logs")}
              >
                <Activity size={16} />
                View Activity Logs
              </button>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h2>Account Overview</h2>
                <p>Your account information</p>
              </div>
              <UserRound size={20} />
            </div>

            <div className="account-details">
              <div className="account-detail-row">
                <span>Full name</span>
                <strong>{user?.name || "User"}</strong>
              </div>

              <div className="account-detail-row">
                <span>Email address</span>
                <strong>{user?.email || "Not available"}</strong>
              </div>

              <div className="account-detail-row">
                <span>Account status</span>
                <strong className="account-active">Active</strong>
              </div>
            </div>

            <button
              className="view-profile-button"
              onClick={() => navigate("/profile")}
            >
              <Eye size={16} />
              View Profile
            </button>
          </article>
        </section>

        <footer className="dashboard-footer">
          © 2026 AccessHub. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
