"use client";

import { useState, useEffect } from "react";
import { authHeaders } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const EMPTY_FORM = {
  title: { zh: "", en: "" },
  content: { zh: "", en: "" },
  url: "",
  category_id: "",
  publish_time: "",
  tags: [],
};

const LANGS = [
  { key: "zh", label: "中文" },
  { key: "en", label: "English" },
];

function deepParse(val) {
  while (typeof val === "string") {
    try { val = JSON.parse(val); } catch { return val; }
  }
  return val;
}

function parseI18n(field) {
  if (!field) return { zh: "", en: "" };
  const val = deepParse(field);
  if (typeof val === "object" && val !== null) return { zh: val.zh || "", en: val.en || "" };
  return { zh: String(val), en: String(val) };
}

function getDisplayTitle(title) {
  if (!title) return "";
  const val = deepParse(title);
  if (typeof val === "object" && val !== null) return val.zh || val.en || "";
  return String(val);
}

function formatDatetime(isoStr) {
  if (!isoStr) return "-";
  const d = new Date(isoStr);
  return d.toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function toLocalDatetimeValue(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [contentLang, setContentLang] = useState("zh");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  async function fetchArticles() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/articles`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("获取文章失败");
      setArticles(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/categories`, {
        headers: authHeaders(),
      });
      if (res.ok) setCategories(await res.json());
    } catch {
      /* 分类加载失败不阻塞页面 */
    }
  }

  async function handleCreateCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    setCreatingCategory(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "创建分类失败");
        return;
      }
      const created = await res.json();
      await fetchCategories();
      setForm({ ...form, category_id: String(created.id) });
      setNewCategoryName("");
      setShowNewCategory(false);
    } catch {
      setError("创建分类失败");
    } finally {
      setCreatingCategory(false);
    }
  }

  function handleAddTag() {
    const tag = tagInput.trim();
    if (!tag || form.tags.includes(tag)) {
      setTagInput("");
      return;
    }
    setForm({ ...form, tags: [...form.tags, tag] });
    setTagInput("");
  }

  function handleRemoveTag(tag) {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  }

  function handleTagKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  }

  function getCategoryName(article) {
    if (article.categories?.name) return article.categories.name;
    return "-";
  }

  function openNew() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const localNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setForm({ ...EMPTY_FORM, tags: [], publish_time: localNow });
    setContentLang("zh");
    setTagInput("");
    setNewCategoryName("");
    setShowNewCategory(false);
    setEditing("new");
    setError("");
  }

  function openEdit(article) {
    const title = parseI18n(article.title);
    const content = parseI18n(article.content);
    setForm({
      title,
      content,
      url: article.url || "",
      category_id: article.category_id ?? "",
      publish_time: toLocalDatetimeValue(article.publish_time),
      tags: Array.isArray(article.tags) ? article.tags : [],
    });
    setContentLang("zh");
    setTagInput("");
    setNewCategoryName("");
    setShowNewCategory(false);
    setEditing(article.id);
    setError("");
  }

  function cancelEdit() {
    setEditing(null);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const isNew = editing === "new";
    const endpoint = isNew
      ? `${API_BASE}/api/admin/articles`
      : `${API_BASE}/api/admin/articles/${editing}`;

    const payload = {
      title: form.title,
      content: form.content,
      url: form.url || undefined,
      category_id: form.category_id || null,
      publish_time: form.publish_time ? new Date(form.publish_time).toISOString() : undefined,
      tags: form.tags.length > 0 ? form.tags : [],
    };

    try {
      const res = await fetch(endpoint, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "操作失败");
        return;
      }
      setEditing(null);
      await fetchArticles();
    } catch {
      setError("网络错误");
    }
  }

  async function handleDelete(id) {
    if (!confirm("确定删除该文章？")) return;
    try {
      await fetch(`${API_BASE}/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      await fetchArticles();
    } catch {
      setError("删除失败");
    }
  }

  if (loading) {
    return <p className="p-8 text-gray-500">Loading...</p>;
  }

  // 表单视图
  if (editing !== null) {
    return (
      <div className="h-full flex flex-col p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800">
            {editing === "new" ? "新建文章" : "编辑文章"}
          </h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm"
            >
              取消
            </button>
            <button
              form="article-form"
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              保存
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form
          id="article-form"
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-4 min-h-0"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* 标题：中英文 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标题（中文）*
              </label>
              <input
                type="text"
                value={form.title.zh}
                onChange={(e) =>
                  setForm({ ...form, title: { ...form.title, zh: e.target.value } })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (EN) *
              </label>
              <input
                type="text"
                value={form.title.en}
                onChange={(e) =>
                  setForm({ ...form, title: { ...form.title, en: e.target.value } })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL / Slug
              </label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="github-profile-readme"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              />
            </div>

            {/* 分类：下拉 + 内联新增 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分类
              </label>
              {showNewCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="输入新分类名称"
                    autoFocus
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleCreateCategory(); }
                      if (e.key === "Escape") { setShowNewCategory(false); setNewCategoryName(""); }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={creatingCategory || !newCategoryName.trim()}
                    className="px-3 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    确定
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNewCategory(false); setNewCategoryName(""); }}
                    className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100 transition-colors"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  >
                    <option value="">未分类</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(true)}
                    className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap"
                  >
                    + 新增
                  </button>
                </div>
              )}
            </div>

            {/* 发布时间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                发布时间
              </label>
              <input
                type="datetime-local"
                value={form.publish_time}
                onChange={(e) => setForm({ ...form, publish_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="回车添加标签"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  添加
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-red-500 text-xs leading-none"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Markdown 内容 */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm font-medium text-gray-700 mr-2">
                内容（Markdown）*
              </span>
              {LANGS.map((l) => (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => setContentLang(l.key)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    contentLang === l.key
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <textarea
              value={form.content[contentLang] || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: {
                    ...form.content,
                    [contentLang]: e.target.value,
                  },
                })
              }
              placeholder={
                contentLang === "zh"
                  ? "# 文章标题\n\n正文内容..."
                  : "# Article Title\n\nContent here..."
              }
              className="flex-1 w-full px-4 py-3 border border-gray-300 rounded font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-gray-500"
            />
          </div>
        </form>
      </div>
    );
  }

  // 列表视图
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">文章管理</h1>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-sm"
        >
          + 新建文章
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {articles.length === 0 ? (
        <p className="text-gray-500 text-center py-12">暂无文章</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  标题
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                  分类
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                  Tags
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                  发布时间
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 w-28">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{getDisplayTitle(article.title)}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {getCategoryName(article)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(article.tags || []).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {(!article.tags || article.tags.length === 0) && "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {formatDatetime(article.publish_time)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(article)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-500 hover:underline"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
