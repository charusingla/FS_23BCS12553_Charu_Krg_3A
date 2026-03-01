import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Outlet />
      </div>
    </div>
  );
}