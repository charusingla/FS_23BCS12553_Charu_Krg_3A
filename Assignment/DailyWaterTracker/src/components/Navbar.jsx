import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/dashboard/water">Water Tracker</Link>
      <button onClick={logout} style={{ marginLeft: "auto" }}>Logout</button>
    </nav>
  );
}