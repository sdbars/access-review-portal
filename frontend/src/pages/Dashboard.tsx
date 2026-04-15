import { useEffect, useState } from "react";
import { getMe } from "../api/client";

type User = {
  id: string;
  name: string;
  role: string;
  team: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    getMe(token)
      .then((data) => {
        setUser(data);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setError("Failed to load user.");
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {error && <p>{error}</p>}

      {user && (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Team:</strong> {user.team}</p>
        </div>
      )}
    </div>
  );
}
