const WORDPRESS_ROOT = String(
  import.meta.env.VITE_WP_URL || "https://app.exoticaitsolutions.com",
).replace(/\/+$/, "");

const API_BASE = String(
  import.meta.env.VITE_API_URL ||
    `${WORDPRESS_ROOT}/wp-json/exotica/v1`,
).replace(/\/+$/, "");

export const CONTACT_URL = `${API_BASE}/contact`;
export const SUBMIT_URL = `${API_BASE}/contact-submit`;

export async function fetchContact(signal) {
  const response = await fetch(CONTACT_URL, { signal });
  if (!response.ok) {
    throw new Error(`Contact API returned ${response.status}`);
  }
  return response.json();
}

export async function submitEnquiry({
  endpoint = SUBMIT_URL,
  type,
  values,
  file,
}) {
  const formData = new FormData();
  formData.append("type", type);
  Object.entries(values).forEach(([key, value]) => formData.append(key, value));
  if (file) formData.append("file", file);
  formData.append("website", "");

  let response;
  try {
    response = await fetch(endpoint, { method: "POST", body: formData });
  } catch {
    const error = new Error(
      "Network error. Please check your connection and try again.",
    );
    error.fields = {};
    error.status = 0;
    throw error;
  }

  let body = {};
  try {
    body = await response.json();
  } catch {
    // A non-JSON response is still valid for successful submissions.
  }

  if (!response.ok) {
    const error = new Error(
      body.message || "Something went wrong. Please try again.",
    );
    error.fields = body.data?.fields || {};
    error.status = response.status;
    throw error;
  }

  return body;
}
