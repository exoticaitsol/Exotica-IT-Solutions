// API helper for the Service page (WordPress plugin "Exotica Service").
// Set VITE_WP_URL in your .env, e.g.  VITE_WP_URL=https://app.exoticaitsolutions.com
// (Create React App: use process.env.REACT_APP_WP_URL instead of import.meta.env.VITE_WP_URL.)

const BASE = String(
  import.meta.env.VITE_WP_URL || "https://app.exoticaitsolutions.com",
).replace(/\/+$/, "");

export const SERVICE_URL = `${BASE}/wp-json/exotica/v1/service`;

/** GET page content. */
export async function fetchService(signal) {
  const res = await fetch(SERVICE_URL, { signal });
  if (!res.ok) throw new Error(`Service API returned ${res.status}`);
  return res.json();
}
