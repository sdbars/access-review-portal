import { useEffect, useState } from "react";
import { getMyAccessRequests } from "../api/client";

type AccessRequest = {
  id: string;
  userId: string;
  resourceId: string;
  justification: string;
  status: string;
};

export default function MyRequests() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        setError("");
        const data = await getMyAccessRequests(token);
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch my access requests:", err);
        setError("Failed to load requests.");
      }
    }

    loadRequests();
  }, []);

  return (
    <div>
      <h1>My Requests</h1>

      {error && <p>{error}</p>}

      {!error && requests.length === 0 && <p>No access requests found.</p>}

      {requests.length > 0 && (
        <ul>
          {requests.map((request) => (
            <li key={request.id} style={{ marginBottom: "1.5rem" }}>
              <p><strong>Request ID:</strong> {request.id}</p>
              <p><strong>Resource ID:</strong> {request.resourceId}</p>
              <p><strong>Justification:</strong> {request.justification || "None provided"}</p>
              <p><strong>Status:</strong> {request.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
