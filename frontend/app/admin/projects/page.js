"use client";

import { useState, useEffect, useRef } from "react";
import { authHeaders } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const EMPTY_FORM = {
  name: { zh: "", en: "" },
  url: "",
  description: { zh: "", en: "" },
  tech_stack: "",
  media_url: "",
  media_type: "image",
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

function getDisplayName(name) {
  if (!name) return "";
  const val = deepParse(name);
  if (typeof val === "object" && val !== null) return val.zh || val.en || "";
  return String(val);
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [descLang, setDescLang] = useState("zh");
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/projects`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("获取项目失败");
      setProjects(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDragStart(index) {
    dragItem.current = index;
  }

  function handleDragEnter(index) {
    dragOverItem.current = index;
  }

  async function handleDragEnd() {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    const reordered = [...projects];
    const [removed] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, removed);

    dragItem.current = null;
    dragOverItem.current = null;

    setProjects(reordered);

    const items = reordered.map((p, i) => ({ id: p.id, sort_order: i }));
    try {
      await fetch(`${API_BASE}/api/admin/projects/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ items }),
      });
    } catch {
      setError("排序保存失败");
      await fetchProjects();
    }
  }

  function openNew() {
    setForm(EMPTY_FORM);
    setDescLang("zh");
    setEditing("new");
    setError("");
  }

  function parseI18n(field) {
    if (!field) return { zh: "", en: "" };
    const val = deepParse(field);
    if (typeof val === "object" && val !== null) return { zh: val.zh || "", en: val.en || "" };
    return { zh: String(val), en: String(val) };
  }

  function openEdit(project) {
    const name = parseI18n(project.name);
    const description = parseI18n(project.description);

    setForm({
      name,
      url: project.url || "",
      description,
      tech_stack: project.tech_stack || "",
      media_url: project.media_url || "",
      media_type: project.media_type || "image",
    });
    setDescLang("zh");
    setEditing(project.id);
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
      ? `${API_BASE}/api/admin/projects`
      : `${API_BASE}/api/admin/projects/${editing}`;

    try {
      const res = await fetch(endpoint, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "操作失败");
        return;
      }
      setEditing(null);
      await fetchProjects();
    } catch {
      setError("网络错误");
    }
  }

  async function handleDelete(id) {
    if (!confirm("确定删除该项目？")) return;
    try {
      await fetch(`${API_BASE}/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      await fetchProjects();
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
            {editing === "new" ? "新建项目" : "编辑项目"}
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
              form="project-form"
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              保存
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form
          id="project-form"
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-4 min-h-0"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                项目名称（中文）*
              </label>
              <input
                type="text"
                value={form.name.zh}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: { ...form.name, zh: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name (EN) *
              </label>
              <input
                type="text"
                value={form.name.en}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: { ...form.name, en: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                项目 URL *
              </label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                技术栈（逗号分隔）
              </label>
              <input
                type="text"
                value={form.tech_stack}
                onChange={(e) =>
                  setForm({ ...form, tech_stack: e.target.value })
                }
                placeholder="React, Flask, Supabase"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  图片/视频 URL
                </label>
                <input
                  type="url"
                  value={form.media_url}
                  onChange={(e) =>
                    setForm({ ...form, media_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  类型
                </label>
                <select
                  value={form.media_type}
                  onChange={(e) =>
                    setForm({ ...form, media_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                >
                  <option value="image">图片</option>
                  <option value="video">视频</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm font-medium text-gray-700 mr-2">
                项目描述（支持 Markdown）
              </span>
              {LANGS.map((l) => (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => setDescLang(l.key)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    descLang === l.key
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <textarea
              value={form.description[descLang] || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: {
                    ...form.description,
                    [descLang]: e.target.value,
                  },
                })
              }
              placeholder={
                descLang === "zh"
                  ? "## 项目简介\n\n描述你的项目...\n\n## 主要功能\n\n- 功能一\n- 功能二"
                  : "## Introduction\n\nDescribe your project...\n\n## Features\n\n- Feature 1\n- Feature 2"
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
        <h1 className="text-xl font-semibold text-gray-800">项目管理</h1>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-sm"
        >
          + 新建项目
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {projects.length === 0 ? (
        <p className="text-gray-500 text-center py-12">暂无项目</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-10 px-2 py-3"></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  名称
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">
                  技术栈
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 w-28">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((project, index) => (
                <tr
                  key={project.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className="hover:bg-gray-50 cursor-grab active:cursor-grabbing"
                >
                  <td className="px-2 py-3 text-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="inline-block"
                    >
                      <circle cx="9" cy="6" r="1.5" />
                      <circle cx="15" cy="6" r="1.5" />
                      <circle cx="9" cy="12" r="1.5" />
                      <circle cx="15" cy="12" r="1.5" />
                      <circle cx="9" cy="18" r="1.5" />
                      <circle cx="15" cy="18" r="1.5" />
                    </svg>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {getDisplayName(project.name)}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {project.tech_stack || "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(project)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
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
