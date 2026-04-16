const API_BASE = "http://localhost:8080";

export async function login(userId: string) {
  const response = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error(`Login failed with status ${response.status}`);
  }

  return response.json();
}

export async function getMe(token: string) {
  const response = await fetch(`${API_BASE}/api/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Fetching user failed with status ${response.status}`);
  }

  return response.json();
}

export async function getResources(token: string) {
  const response = await fetch(`${API_BASE}/api/resources`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Fetching resources failed with status ${response.status}`);
  }

  return response.json();
}

export async function createAccessRequest(
  token: string,
  resourceId: string,
  justification: string
) {
  const response = await fetch(`${API_BASE}/api/access-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      resourceId,
      justification,
    }),
  });

  if (!response.ok) {
    throw new Error(`Creating access request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getMyAccessRequests(token: string) {
  const response = await fetch(`${API_BASE}/api/access-requests/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Fetching access requests failed with status ${response.status}`);
  }

  return response.json();
}

export async function getAllAccessRequests(token: string) {
  const response = await fetch(`${API_BASE}/api/admin/access-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Fetching admin access requests failed with status ${response.status}`);
  }

  return response.json();
}

export async function approveAccessRequest(token: string, requestId: string) {
  const response = await fetch(
    `${API_BASE}/api/admin/access-requests/${requestId}/approve`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to approve request");
  }

  return data;
}

export async function rejectAccessRequest(token: string, requestId: string) {
  const response = await fetch(
    `${API_BASE}/api/admin/access-requests/${requestId}/reject`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to reject request");
  }

  return data;
}
