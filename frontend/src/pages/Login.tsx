import { useEffect, useState } from "react";
import { getMe, login } from "../api/client";

export default function Login() {
  const [userId, setUserId] = useState("alice");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  async function handleLogin() {
    console.log("Login button clicked");
    try {
      setError("");

      const data = await login(userId);
      console.log("Login response:", data);

      localStorage.setItem("token", data.token);

      const user = await getMe(data.token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(data.token);

      window.location.href = "/";
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
