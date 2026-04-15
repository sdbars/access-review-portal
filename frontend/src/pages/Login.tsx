import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/client";

export default function Login() {
  const [userId, setUserId] = useState("alice");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    console.log("Login button clicked");
    try {
      setError("");
      const data = await login(userId);
      console.log("Login response:", data);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed");
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
        />
        <button onClick={handleLogin}>Login</button>
      </div>

      {token && <p>Token: {token}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
