const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchJson(path) {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${path}`);
  }
  return res.json();
}

export async function getAllPosts() {
  const data = await fetchJson("/api/posts");
  return data.posts;
}

export async function getPostBySlug(slug) {
  return fetchJson(`/api/posts/${encodeURIComponent(slug)}`);
}

export async function getAdjacentPosts(slug) {
  return fetchJson(`/api/posts/${encodeURIComponent(slug)}/adjacent`);
}

export async function getAllTags() {
  const data = await fetchJson("/api/tags");
  return data.tags;
}

export async function getPostsByTag(tag) {
  const data = await fetchJson(`/api/tags/${encodeURIComponent(tag)}/posts`);
  return data.posts;
}

export async function getAllCategories() {
  const data = await fetchJson("/api/categories");
  return data.categories;
}

export async function getPostsByCategory(category) {
  const data = await fetchJson(`/api/categories/${encodeURIComponent(category)}/posts`);
  return data.posts;
}

export async function getNavVisibility() {
  const data = await fetchJson("/api/nav-visibility");
  return data;
}
