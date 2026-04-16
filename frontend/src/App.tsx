
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import MyRequests from "./pages/MyRequests";
import AdminRequests from "./pages/AdminRequests";

type User = {
  id: string;
  name: string;
  role: string;
  team: string;
};

function getStoredUser(): User | null {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = getStoredUser();

  if (!user || user.role !== "admin") {
    return <p>Access denied.</p>;
  }

  return <>{children}</>;
}

export default function App() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";
  console.log('isAdmin', isAdmin);
  console.log('user', user);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Link to="/">Dashboard</Link>
        <Link to="/login">Login</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/requests">My Requests</Link>
        {isAdmin && <Link to="/admin/requests">Admin Requests</Link>}
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/requests" element={<MyRequests />} />
        <Route
          path="/admin/requests"
          element={
            <AdminRoute>
              <AdminRequests />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}
