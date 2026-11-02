const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "https://app.exoticaitsolutions.com/wp-json/exotica/v1"
).replace(/\/+$/, "");

export async function fetchAbout(signal) {
  const response = await fetch(`${API_BASE}/about`, { signal });

  if (!response.ok) {
    throw new Error(`Could not load About page (${response.status})`);
  }

  return response.json();
}

export async function sendAboutContact(payload) {
  const response = await fetch(`${API_BASE}/about-contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    // The endpoint may return an empty or non-JSON success response.
  }

  if (!response.ok) {
    throw new Error(
      body?.message || "Something went wrong. Please try again.",
    );
  }

  return body;
}
