import { useEffect, useState } from "react";
import { getMyAccessRequests, getResources } from "../api/client";

type AccessRequest = {
  id: string;
  userId: string;
  resourceId: string;
  justification: string;
  status: string;
};

type Resource = {
  id: string;
  name: string;
  description: string;
  allowed: boolean;
  reason: string;
  allowedRoles: string[];
};

function formatStatus(status: string) {
  switch (status) {
    case "pending":
      return "Pending Approval";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
}

export default function MyRequests() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [resourceMap, setResourceMap] = useState<Record<string, string>>({});
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

        const [requestData, resourceData] = await Promise.all([
          getMyAccessRequests(token),
          getResources(token),
        ]);

        setRequests(Array.isArray(requestData) ? requestData.slice().reverse() : []);

        const map: Record<string, string> = {};
        (Array.isArray(resourceData) ? resourceData : []).forEach((resource: Resource) => {
          map[resource.id] = resource.name;
        });
        setResourceMap(map);
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
            <li
              key={request.id}
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <p><strong>Request ID:</strong> {request.id}</p>
              <p>
                <strong>Resource:</strong>{" "}
                {resourceMap[request.resourceId] || request.resourceId}
              </p>
              <p>
                <strong>Justification:</strong>{" "}
                {request.justification || "None provided"}
              </p>
              <p><strong>Status:</strong> {formatStatus(request.status)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
