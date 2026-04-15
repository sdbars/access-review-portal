import { useEffect, useState } from "react";
import { getResources } from "../api/client";

type Resource = {
  id: string;
  name: string;
  description: string;
  allowed: boolean;
  reason: string;
  allowedRoles: string[];
};

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    getResources(token)
      .then((data) => {
        setResources(data);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to fetch resources:", err);
        setError("Failed to load resources.");
      });
  }, []);

  return (
    <div>
      <h1>Resources</h1>

      {error && <p>{error}</p>}

      {resources.length > 0 && (
        <ul>
          {resources.map((resource) => (
            <li key={resource.id} style={{ marginBottom: "1rem" }}>
              <p><strong>{resource.name}</strong></p>
              <p>{resource.description}</p>
              <p>
                Access: {resource.allowed ? "Allowed" : "Denied"} ({resource.reason})
              </p>
              <p>Allowed roles: {resource.allowedRoles.join(", ")}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
