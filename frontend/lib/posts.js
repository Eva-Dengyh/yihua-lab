const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${path}`);
  }
  return res.json();
}

export async function getAllPosts(lang) {
  const params = lang ? `?lang=${lang}` : "";
  const data = await fetchJson(`/api/posts${params}`);
  return data.posts;
}

export async function getPostBySlug(slug, lang) {
  const params = lang ? `?lang=${lang}` : "";
  return fetchJson(`/api/posts/${encodeURIComponent(slug)}${params}`);
}

export async function getAdjacentPosts(slug, lang) {
  const params = lang ? `?lang=${lang}` : "";
  return fetchJson(`/api/posts/${encodeURIComponent(slug)}/adjacent${params}`);
}

export async function getAllTags() {
  const data = await fetchJson("/api/tags");
  return data.tags;
}

export async function getPostsByTag(tag, lang) {
  const params = lang ? `?lang=${lang}` : "";
  const data = await fetchJson(`/api/tags/${encodeURIComponent(tag)}/posts${params}`);
  return data.posts;
}

export async function getAllCategories(lang) {
  const params = lang ? `?lang=${lang}` : "";
  const data = await fetchJson(`/api/categories${params}`);
  return data.categories;
}

export async function getPostsByCategory(category, lang) {
  const params = lang ? `?lang=${lang}` : "";
  const data = await fetchJson(`/api/categories/${encodeURIComponent(category)}/posts${params}`);
  return data.posts;
}

export async function getNavVisibility() {
  const data = await fetchJson("/api/nav-visibility");
  return data;
}
