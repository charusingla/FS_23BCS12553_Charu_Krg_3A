import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header style={{ padding: "1rem", background: "#220594" }}>
      <h2>EcoTrack</h2>
      <nav>
        <Link to="/" style={{ marginRight: "1rem", color: "white" }}>
          Dashboard
        </Link>
        <Link to="/logs" style={{ marginRight: "1rem", color: "white" }}>
          Logs
        </Link>
        <Link to="/login" style={{ marginRight: "1rem", color: "white" }}>
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;
