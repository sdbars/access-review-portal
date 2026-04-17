import { useEffect, useState } from "react";
import {
  approveAccessRequest,
  getAllAccessRequests,
  getResources,
  rejectAccessRequest,
} from "../api/client";

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

export default function AdminRequests() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [resourceMap, setResourceMap] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      setError("");

      const [requestData, resourceData] = await Promise.all([
        getAllAccessRequests(token),
        getResources(token),
      ]);

      setRequests(Array.isArray(requestData) ? requestData.slice().reverse() : []);

      const map: Record<string, string> = {};
      (Array.isArray(resourceData) ? resourceData : []).forEach((resource: Resource) => {
        map[resource.id] = resource.name;
      });
      setResourceMap(map);
    } catch (err) {
      console.error("Failed to load admin requests:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load admin requests.");
      }
    }
  }

  async function handleApprove(requestId: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const updated = await approveAccessRequest(token, requestId);

      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? updated : r))
      );
    } catch (err) {
      console.error("Approve failed:", err);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  async function handleReject(requestId: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const updated = await rejectAccessRequest(token, requestId);

      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? updated : r))
      );
    } catch (err) {
      console.error("Reject failed:", err);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <div>
      <h1>Admin Requests</h1>

      {error && <p>{error}</p>}

      {requests.length === 0 && !error && <p>No requests found.</p>}

      {requests.map((req) => (
        <div
          key={req.id}
          style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <p><strong>ID:</strong> {req.id}</p>
          <p><strong>User:</strong> {req.userId}</p>
          <p>
            <strong>Resource:</strong>{" "}
            {resourceMap[req.resourceId] || req.resourceId}
          </p>
          <p><strong>Justification:</strong> {req.justification || "None"}</p>
          <p><strong>Status:</strong> {formatStatus(req.status)}</p>

          {req.status === "pending" && (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => handleApprove(req.id)}>Approve</button>
              <button onClick={() => handleReject(req.id)}>Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
