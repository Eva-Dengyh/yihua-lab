"use client";

import { useState, useEffect } from "react";
import { authHeaders } from "@/lib/auth";
import siteConfig from "@/lib/config";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const NAV_LABELS = Object.keys(siteConfig.nav);

export default function AdminNavigationPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchVisibility();
  }, []);

  async function fetchVisibility() {
    try {
      const res = await fetch(`${API_BASE}/api/nav-visibility`);
      if (res.ok) {
        setItems(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }

  function toggle(navKey) {
    setItems((prev) =>
      prev.map((item) =>
        item.nav_key === navKey ? { ...item, visible: !item.visible } : item
      )
    );
    setMessage("");
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/nav-visibility`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ items }),
      });
      if (res.ok) {
        setMessage("保存成功");
      } else {
        setMessage("保存失败");
      }
    } catch {
      setMessage("网络错误");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="p-8 text-gray-500">Loading...</p>;
  }

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">导航管理</h1>
      </div>
      <div className="flex-1 divide-y divide-gray-100">
        {NAV_LABELS.map((key) => {
          const item = items.find((i) => i.nav_key === key);
          const visible = item ? item.visible : false;
          return (
            <div
              key={key}
              className="flex items-center justify-between px-6 py-4"
            >
              <span className="text-sm text-gray-700 capitalize">{key}</span>
              <button
                type="button"
                onClick={() => toggle(key)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  visible ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                    visible ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
      <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "保存中..." : "保存"}
        </button>
        {message && (
          <span className={`text-sm ${message === "保存成功" ? "text-green-600" : "text-red-500"}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
