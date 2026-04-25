import { useContext } from "react";
import UserContext from "./UserContext";

function Profile() {
  const { username, isLoggedIn, login, logout } = useContext(UserContext);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Username: {username}</h2>
      <p>Status: {isLoggedIn ? "Logged In" : "Logged Out"}</p>

      {isLoggedIn ? (
        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      ) : (
        <button
          onClick={login}
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      )}
    </div>
  );
}

export default Profile;