import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const login = () => {
    localStorage.setItem("token", "demo-token");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Login</h2>
      <p>Fake login for assignment.</p>
      <button onClick={login}>Login</button>
    </div>
  );
}