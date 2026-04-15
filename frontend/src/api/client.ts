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
