import { useEffect, useState } from "react";
import {
  createAccessRequest,
  getMyAccessRequests,
  getResources,
} from "../api/client";

type Resource = {
  id: string;
  name: string;
  description: string;
  allowed: boolean;
  reason: string;
  allowedRoles: string[];
};

type AccessRequest = {
  id: string;
  userId: string;
  resourceId: string;
  justification: string;
  status: string;
};

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [myRequests, setMyRequests] = useState<AccessRequest[]>([]);
  const [error, setError] = useState("");
  const [justifications, setJustifications] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const [resourcesData, requestsData] = await Promise.all([
          getResources(token),
          getMyAccessRequests(token),
        ]);

        setResources(resourcesData);
        setMyRequests(requestsData);
      } catch (err) {
        console.error("Failed to load resources page data:", err);
        setError("Failed to load resources.");
      }
    })();
  }, []);

  async function handleRequestAccess(resourceId: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    const justification = justifications[resourceId] || "";

    try {
      setError("");

      const createdRequest = await createAccessRequest(
        token,
        resourceId,
        justification
      );

      setMyRequests((prev) => [...prev, createdRequest]);

      setJustifications((prev) => ({
        ...prev,
        [resourceId]: "",
      }));
    } catch (err) {
      console.error("Failed to create access request:", err);
      setError("Failed to submit access request.");
    }
  }

  function updateJustification(resourceId: string, value: string) {
    setJustifications((prev) => ({
      ...prev,
      [resourceId]: value,
    }));
  }

  function getLatestRequestForResource(resourceId: string) {
    const matchingRequests = myRequests.filter(
      (request) => request.resourceId === resourceId
    );

    if (matchingRequests.length === 0) {
      return null;
    }

    return matchingRequests[matchingRequests.length - 1];
  }

  return (
    <div>
      <h1>Resources</h1>

      {error && <p>{error}</p>}

      {resources.length > 0 && (
        <ul>
          {resources.map((resource) => {
            const latestRequest = getLatestRequestForResource(resource.id);
            const hasPendingRequest = latestRequest?.status === "pending";
            const hasApprovedRequest = latestRequest?.status === "approved";
            const hasRejectedRequest = latestRequest?.status === "rejected";

            let accessLabel = "Denied";
            let accessDetail = resource.reason;

            if (resource.allowed) {
              accessLabel = "Allowed";
              accessDetail = resource.reason;
            } else if (hasPendingRequest) {
              accessLabel = "Request Submitted";
              accessDetail = "pending approval";
            } else if (hasApprovedRequest) {
              accessLabel = "Approved";
              accessDetail = "approved request recorded";
            } else if (hasRejectedRequest) {
              accessLabel = "Denied";
              accessDetail = "request was rejected";
            }

            return (
              <li key={resource.id} style={{ marginBottom: "2rem" }}>
                <p>
                  <strong>{resource.name}</strong>
                </p>
                <p>{resource.description}</p>
                <p>
                  Access: {accessLabel} ({accessDetail})
                </p>
                <p>Allowed roles: {resource.allowedRoles.join(", ")}</p>

                {!resource.allowed && !hasPendingRequest && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <textarea
                      value={justifications[resource.id] || ""}
                      onChange={(e) =>
                        updateJustification(resource.id, e.target.value)
                      }
                      placeholder="Why do you need access?"
                      rows={3}
                      style={{
                        width: "100%",
                        maxWidth: "500px",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <br />
                    <button onClick={() => handleRequestAccess(resource.id)}>
                      Request Access
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
