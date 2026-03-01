const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`API error: ${res.status} ${path}`);
  }
  return res.json();
}

export async function getAllPageSlugs() {
  const data = await fetchJson("/api/pages");
  return data?.slugs || [];
}

export async function getPageBySlug(slug) {
  return fetchJson(`/api/pages/${encodeURIComponent(slug)}`);
}
