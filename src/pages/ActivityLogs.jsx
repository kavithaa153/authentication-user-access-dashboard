
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowDownUp,
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Search,
  ShieldCheck,
  UserRound,
  X
} from "lucide-react";
import "./ActivityLogs.css";

const initialActivities = [
  {
    id: 1,
    user: "Kavitha A",
    email: "kavitha@example.com",
    action: "Login",
    description: "Signed in to the workspace",
    type: "Authentication",
    status: "Success",
    timestamp: "2026-10-14T09:30:00"
  },
  {
    id: 2,
    user: "Arun Kumar",
    email: "arun@example.com",
    action: "User Created",
    description: "Created a new workspace user",
    type: "User Management",
    status: "Success",
    timestamp: "2026-10-14T09:15:00"
  },
  {
    id: 3,
    user: "Priya S",
    email: "priya@example.com",
    action: "Permission Updated",
    description: "Updated Editor role permissions",
    type: "Access Control",
    status: "Success",
    timestamp: "2026-10-13T16:45:00"
  },
  {
    id: 4,
    user: "Rahul M",
    email: "rahul@example.com",
    action: "Login Failed",
    description: "Sign-in attempt was unsuccessful",
    type: "Authentication",
    status: "Failed",
    timestamp: "2026-10-13T14:20:00"
  },
  {
    id: 5,
    user: "Divya R",
    email: "divya@example.com",
    action: "User Updated",
    description: "Updated user account details",
    type: "User Management",
    status: "Success",
    timestamp: "2026-10-12T11:10:00"
  },
  {
    id: 6,
    user: "Meena P",
    email: "meena@example.com",
    action: "Settings Changed",
    description: "Updated workspace settings",
    type: "Settings",
    status: "Success",
    timestamp: "2026-10-11T10:05:00"
  },
  {
    id: 7,
    user: "Vijay K",
    email: "vijay@example.com",
    action: "User Deleted",
    description: "Removed a workspace user",
    type: "User Management",
    status: "Success",
    timestamp: "2026-10-10T15:35:00"
  },
  {
    id: 8,
    user: "Anitha V",
    email: "anitha@example.com",
    action: "Export Attempt",
    description: "Report export could not be completed",
    type: "Reports",
    status: "Failed",
    timestamp: "2026-10-09T12:25:00"
  },
  {
    id: 9,
    user: "Suresh B",
    email: "suresh@example.com",
    action: "Logout",
    description: "Signed out of the workspace",
    type: "Authentication",
    status: "Success",
    timestamp: "2026-10-08T17:00:00"
  },
  {
    id: 10,
    user: "Nithya G",
    email: "nithya@example.com",
    action: "Permission Reviewed",
    description: "Reviewed Viewer role permissions",
    type: "Access Control",
    status: "Pending",
    timestamp: "2026-10-07T13:40:00"
  },
  {
    id: 11,
    user: "Karthik S",
    email: "karthik@example.com",
    action: "Login",
    description: "Signed in to the workspace",
    type: "Authentication",
    status: "Success",
    timestamp: "2026-10-06T09:20:00"
  }
];

function ActivityLogs() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem("accesshub_activity_logs");
      return saved ? JSON.parse(saved) : initialActivities;
    } catch {
      return initialActivities;
    }
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [notice, setNotice] = useState("");

  const pageSize = 6;

  useEffect(() => {
    localStorage.setItem(
      "accesshub_activity_logs",
      JSON.stringify(activities)
    );
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activities
      .filter((item) =>
        `${item.user} ${item.email} ${item.action} ${item.description}`
          .toLowerCase()
          .includes(query)
      )
      .filter((item) => typeFilter === "All" || item.type === typeFilter)
      .filter((item) => statusFilter === "All" || item.status === statusFilter)
      .filter((item) => {
        const date = item.timestamp.slice(0, 10);
        return (!startDate || date >= startDate) &&
          (!endDate || date <= endDate);
      })
      .sort((a, b) =>
        sortOrder === "newest"
          ? new Date(b.timestamp) - new Date(a.timestamp)
          : new Date(a.timestamp) - new Date(b.timestamp)
      );
  }, [
    activities,
    search,
    typeFilter,
    statusFilter,
    startDate,
    endDate,
    sortOrder
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredActivities.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleActivities = filteredActivities.slice(
    startIndex,
    startIndex + pageSize
  );

  const successCount = activities.filter(
    (item) => item.status === "Success"
  ).length;

  const failedCount = activities.filter(
    (item) => item.status === "Failed"
  ).length;

  const pendingCount = activities.filter(
    (item) => item.status === "Pending"
  ).length;

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setStartDate("");
    setEndDate("");
    setPage(1);
  }

  function formatDate(value) {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function formatTime(value) {
    return new Date(value).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  }

  function exportActivities() {
    const headers = [
      "User",
      "Email",
      "Action",
      "Description",
      "Type",
      "Status",
      "Timestamp"
    ];

    const rows = filteredActivities.map((item) => [
      item.user,
      item.email,
      item.action,
      item.description,
      item.type,
      item.status,
      item.timestamp
    ]);

    const csvCell = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "accesshub-activity-logs.csv";
    link.click();
    URL.revokeObjectURL(url);

    setNotice("Activity logs exported successfully.");
  }

  return (
    <main className="activity-page">
      <header className="activity-header">
        <div className="activity-header-copy">
          <p className="activity-eyebrow">WORKSPACE / MONITORING</p>
          <h1>Activity Logs</h1>
          <p className="activity-subtitle">
            Review workspace events, account activity, and security actions.
          </p>
        </div>

        <div className="activity-header-actions">
          <button
            className="activity-back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <button
            className="activity-export-button"
            onClick={exportActivities}
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>
      </header>

      {notice && (
        <div className="activity-notice" role="status">
          <span>{notice}</span>
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <section className="activity-stats">
        <article className="activity-stat-card">
          <span className="activity-stat-icon"><Activity size={21} /></span>
          <div>
            <p>Total Activities</p>
            <strong>{activities.length}</strong>
          </div>
        </article>

        <article className="activity-stat-card">
          <span className="activity-stat-icon success-icon"><ShieldCheck size={21} /></span>
          <div>
            <p>Successful</p>
            <strong>{successCount}</strong>
          </div>
        </article>

        <article className="activity-stat-card">
          <span className="activity-stat-icon failed-icon"><X size={21} /></span>
          <div>
            <p>Failed</p>
            <strong>{failedCount}</strong>
          </div>
        </article>

        <article className="activity-stat-card">
          <span className="activity-stat-icon pending-icon"><Clock3 size={21} /></span>
          <div>
            <p>Pending</p>
            <strong>{pendingCount}</strong>
          </div>
        </article>
      </section>

      <section className="activity-content-card">
        <div className="activity-content-heading">
          <div>
            <h2>All Activities</h2>
            <p>Search and filter recorded workspace events.</p>
          </div>
          <span className="activity-record-count">
            {filteredActivities.length} records
          </span>
        </div>

        <div className="activity-filters">
          <label className="activity-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => updateFilter(setSearch, event.target.value)}
              placeholder="Search user or action..."
            />
          </label>

          <select
            value={typeFilter}
            onChange={(event) => updateFilter(setTypeFilter, event.target.value)}
            aria-label="Filter by activity type"
          >
            <option value="All">All types</option>
            <option value="Authentication">Authentication</option>
            <option value="User Management">User Management</option>
            <option value="Access Control">Access Control</option>
            <option value="Settings">Settings</option>
            <option value="Reports">Reports</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => updateFilter(setStatusFilter, event.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>

          <button
            className="activity-sort-button"
            onClick={() =>
              setSortOrder((order) =>
                order === "newest" ? "oldest" : "newest"
              )
            }
          >
            <ArrowDownUp size={16} />
            {sortOrder === "newest" ? "Newest" : "Oldest"}
          </button>
        </div>

        <div className="activity-date-filters">
          <label>
            <CalendarDays size={16} />
            <span>From</span>
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => updateFilter(setStartDate, event.target.value)}
            />
          </label>

          <label>
            <CalendarDays size={16} />
            <span>To</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => updateFilter(setEndDate, event.target.value)}
            />
          </label>

          <button className="activity-clear-button" onClick={clearFilters}>
            Clear filters
          </button>
        </div>

        <div className="activity-table-scroll">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date & Time</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {visibleActivities.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="activity-person">
                      <span className="activity-avatar">
                        {item.user.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <strong>{item.action}</strong>
                        <span>{item.user}</span>
                        <small>{item.email}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="activity-type-badge">{item.type}</span>
                  </td>

                  <td>
                    <span className={`activity-status status-${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="activity-datetime">
                      <strong>{formatDate(item.timestamp)}</strong>
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                  </td>

                  <td>
                    <button
                      className="activity-details-button"
                      onClick={() => setSelectedActivity(item)}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}

              {visibleActivities.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <div className="activity-empty">
                      <Activity size={32} />
                      <strong>No activities found</strong>
                      <span>Try changing your search or filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="activity-pagination">
          <span>
            {filteredActivities.length === 0
              ? "No results"
              : `Showing ${startIndex + 1}–${Math.min(
                  startIndex + pageSize,
                  filteredActivities.length
                )} of ${filteredActivities.length} activities`}
          </span>

          <div>
            <button
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft size={18} />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              aria-label="Next page"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </footer>
      </section>

      <footer className="activity-footer">
        Activity data shown here is sample data for this frontend demo.
      </footer>

      {selectedActivity && (
        <div
          className="activity-modal-overlay"
          onClick={() => setSelectedActivity(null)}
        >
          <section
            className="activity-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="activity-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <p>ACTIVITY DETAILS</p>
                <h2 id="activity-modal-title">{selectedActivity.action}</h2>
              </div>
              <button
                aria-label="Close details"
                onClick={() => setSelectedActivity(null)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="activity-detail-list">
              <div><span>User</span><strong>{selectedActivity.user}</strong></div>
              <div><span>Email</span><strong>{selectedActivity.email}</strong></div>
              <div><span>Activity type</span><strong>{selectedActivity.type}</strong></div>
              <div>
                <span>Status</span>
                <strong className={`activity-status status-${selectedActivity.status.toLowerCase()}`}>
                  {selectedActivity.status}
                </strong>
              </div>
              <div><span>Date</span><strong>{formatDate(selectedActivity.timestamp)}</strong></div>
              <div><span>Time</span><strong>{formatTime(selectedActivity.timestamp)}</strong></div>
              <div className="activity-detail-description">
                <span>Description</span>
                <strong>{selectedActivity.description}</strong>
              </div>
            </div>

            <button
              className="activity-modal-close"
              onClick={() => setSelectedActivity(null)}
            >
              Close
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default ActivityLogs;
