import React from "react";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome! Go to the tracker:</p>
      <Link to="/dashboard/water">Open Water Tracker</Link>
    </div>
  );
}