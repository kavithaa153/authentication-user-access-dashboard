
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users as UsersIcon,
  X,
  ArrowLeft
} from "lucide-react";
import "./Users.css";

const initialUsers = [
  { id: 1, name: "Arun Kumar", email: "arun@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Priya S", email: "priya@example.com", role: "Editor", status: "Active" },
  { id: 3, name: "Rahul M", email: "rahul@example.com", role: "Viewer", status: "Inactive" },
  { id: 4, name: "Divya R", email: "divya@example.com", role: "Editor", status: "Active" },
  { id: 5, name: "Vijay K", email: "vijay@example.com", role: "Viewer", status: "Pending" },
  { id: 6, name: "Meena P", email: "meena@example.com", role: "Admin", status: "Active" },
  { id: 7, name: "Karthik S", email: "karthik@example.com", role: "Viewer", status: "Inactive" },
  { id: 8, name: "Anitha V", email: "anitha@example.com", role: "Editor", status: "Pending" },
  { id: 9, name: "Suresh B", email: "suresh@example.com", role: "Viewer", status: "Active" },
  { id: 10, name: "Nithya G", email: "nithya@example.com", role: "Editor", status: "Active" },
  { id: 11, name: "Manoj T", email: "manoj@example.com", role: "Viewer", status: "Inactive" }
];

const emptyForm = {
  name: "",
  email: "",
  role: "Viewer",
  status: "Active"
};

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("accesshub_users");
      return saved ? JSON.parse(saved) : initialUsers;
    } catch {
      return initialUsers;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const pageSize = 5;

  useEffect(() => {
    localStorage.setItem("accesshub_users", JSON.stringify(users));
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users
      .filter((user) =>
        `${user.name} ${user.email}`.toLowerCase().includes(query)
      )
      .filter(
        (user) => statusFilter === "All" || user.status === statusFilter
      )
      .filter(
        (user) => roleFilter === "All" || user.role === roleFilter
      )
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
  }, [users, search, statusFilter, roleFilter, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleUsers = filteredUsers.slice(
    startIndex,
    startIndex + pageSize
  );

  const activeCount = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveCount = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  function openAddModal() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setModalOpen(true);
  }

  function openEditModal(user) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setError("");
    setModalOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name || !email) {
      setError("Please enter the name and email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const duplicate = users.some(
      (user) =>
        user.email.toLowerCase() === email &&
        user.id !== editingId
    );

    if (duplicate) {
      setError("This email address already exists.");
      return;
    }

    if (editingId !== null) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingId
            ? { ...user, ...form, name, email }
            : user
        )
      );
      setNotice("User updated successfully.");
    } else {
      setUsers((current) => [
        ...current,
        { ...form, name, email, id: Date.now() }
      ]);
      setNotice("User added successfully.");
      setPage(1);
    }

    setModalOpen(false);
  }

  function handleDelete(user) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) return;

    setUsers((current) =>
      current.filter((item) => item.id !== user.id)
    );
    setNotice("User deleted successfully.");
  }

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusFilter(value) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleRoleFilter(value) {
    setRoleFilter(value);
    setPage(1);
  }

  return (
    <main className="users-page">
      <header className="users-header">
        <div className="users-header-title">
          <p className="users-eyebrow">WORKSPACE / MANAGEMENT</p>
          <h1>User Management</h1>
          <p className="users-subtitle">
            Manage workspace users, roles, and account status.
          </p>
        </div>

        <div className="users-header-actions">
          <button
            className="users-back-button users-top-back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <button
            className="users-primary-button"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add User
          </button>
        </div>
      </header>

      {notice && (
        <div className="users-notice" role="status">
          <span>{notice}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <section className="users-summary">
        <article>
          <span className="users-summary-icon">
            <UsersIcon size={20} />
          </span>
          <div>
            <p>Total Users</p>
            <strong>{users.length}</strong>
          </div>
        </article>

        <article>
          <span className="users-summary-icon">
            <UsersIcon size={20} />
          </span>
          <div>
            <p>Active Users</p>
            <strong>{activeCount}</strong>
          </div>
        </article>

        <article>
          <span className="users-summary-icon">
            <UsersIcon size={20} />
          </span>
          <div>
            <p>Inactive Users</p>
            <strong>{inactiveCount}</strong>
          </div>
        </article>
      </section>

      <section className="users-table-card">
        <div className="users-toolbar">
          <label className="users-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search name or email..."
            />
          </label>

          <div className="users-filters">
            <select
              value={statusFilter}
              onChange={(event) => handleStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              value={roleFilter}
              onChange={(event) => handleRoleFilter(event.target.value)}
              aria-label="Filter by role"
            >
              <option value="All">All roles</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>

            <button
              className="users-sort-button"
              onClick={() =>
                setSortOrder((order) =>
                  order === "asc" ? "desc" : "asc"
                )
              }
            >
              <ArrowDownUp size={16} />
              Sort
            </button>
          </div>
        </div>

        <div className="users-table-scroll">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="users-person">
                      <span className="users-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`users-role role-${user.role.toLowerCase()}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`users-status status-${user.status.toLowerCase()}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <div className="users-row-actions">
                      <button
                        aria-label={`Edit ${user.name}`}
                        onClick={() => openEditModal(user)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="users-delete"
                        aria-label={`Delete ${user.name}`}
                        onClick={() => handleDelete(user)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleUsers.length === 0 && (
                <tr>
                  <td colSpan="4">
                    <div className="users-empty">
                      <UsersIcon size={30} />
                      <strong>No users found</strong>
                      <span>
                        Try changing your search or filters.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="users-pagination">
          <span>
            {filteredUsers.length === 0
              ? "No results"
              : `Showing ${startIndex + 1}–${Math.min(
                  startIndex + pageSize,
                  filteredUsers.length
                )} of ${filteredUsers.length} users`}
          </span>

          <div>
            <button
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
            >
              <ChevronLeft size={18} />
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              aria-label="Next page"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setPage((current) =>
                  Math.min(totalPages, current + 1)
                )
              }
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </footer>
      </section>

      {modalOpen && (
        <div
          className="users-modal-overlay"
          onClick={() => setModalOpen(false)}
        >
          <section
            className="users-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="users-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <h2 id="users-modal-title">
                  {editingId !== null ? "Edit User" : "Add New User"}
                </h2>
                <p>Enter the user's account details below.</p>
              </div>

              <button
                aria-label="Close modal"
                onClick={() => setModalOpen(false)}
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <label>
                Full name
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Enter full name"
                  autoFocus
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="name@example.com"
                />
              </label>

              <div className="users-modal-fields">
                <label>
                  Role
                  <select
                    value={form.role}
                    onChange={(event) =>
                      setForm({ ...form, role: event.target.value })
                    }
                  >
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                </label>

                <label>
                  Status
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Pending</option>
                  </select>
                </label>
              </div>

              {error && (
                <p className="users-form-error" role="alert">
                  {error}
                </p>
              )}

              <footer>
                <button
                  type="button"
                  className="users-cancel-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="users-primary-button"
                >
                  {editingId !== null ? "Save Changes" : "Add User"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default Users;
