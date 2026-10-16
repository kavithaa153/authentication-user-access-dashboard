
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import AccessControl from "../pages/AccessControl";
import ActivityLogs from "../pages/ActivityLogs";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";

function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("accesshub_session") === "true";

  return isLoggedIn
    ? children
    : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />

      <Route
        path="/users"
        element={<ProtectedRoute><Users /></ProtectedRoute>}
      />

      <Route
        path="/access-control"
        element={<ProtectedRoute><AccessControl /></ProtectedRoute>}
      />

      <Route
        path="/activity-logs"
        element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>}
      />

      <Route
        path="/settings"
        element={<ProtectedRoute><Settings /></ProtectedRoute>}
      />

      <Route
        path="/profile"
        element={<ProtectedRoute><Profile /></ProtectedRoute>}
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;
