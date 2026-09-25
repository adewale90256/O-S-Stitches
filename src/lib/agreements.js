import { auth } from "./firebase";

async function getAuthHeaders() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAgreements() {
  const headers = await getAuthHeaders();

  const response = await fetch("/api/agreements", {
    method: "GET",
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to load agreements.");
  }

  return result.agreements || [];
}

export async function getAgreementByToken(token) {
  const response = await fetch(
    `/api/agreements?token=${encodeURIComponent(token)}`,
    {
      method: "GET",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Agreement not found.");
  }

  return result.agreement;
}

export async function createAgreement(data) {
  const headers = await getAuthHeaders();

  const response = await fetch("/api/agreements", {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text = await response.text();

  let result = {};

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Agreement API returned an invalid response (${response.status}).`,
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message || `Unable to create agreement (${response.status}).`,
    );
  }

  return result;
}

export async function updateAgreement(id, data) {
  const headers = await getAuthHeaders();

  const response = await fetch("/api/agreements", {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      ...data,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to update agreement.");
  }

  return result;
}

export async function respondToAgreement(token, status) {
  const response = await fetch("/api/agreements", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      status,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to respond to agreement.");
  }

  return result;
}

export async function deleteAgreement(id) {
  const headers = await getAuthHeaders();

  const response = await fetch(`/api/agreements?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to delete agreement.");
  }

  return result;
}
