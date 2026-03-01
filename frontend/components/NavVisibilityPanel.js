"use client";

import { useState } from "react";
import { authHeaders } from "@/lib/auth";
import siteConfig from "@/lib/config";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const NAV_LABELS = Object.keys(siteConfig.nav);

export default function NavVisibilityPanel({ navVisibility, onUpdate }) {
  const [items, setItems] = useState(navVisibility);
  const [saving, setSaving] = useState(false);

  const toggle = (navKey) => {
    setItems((prev) =>
      prev.map((item) =>
        item.nav_key === navKey ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/nav-visibility`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ items }),
      });
      if (res.ok) {
        onUpdate?.(items);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 bg-[--bg] border border-[--border] rounded-lg shadow-lg p-4 z-50 min-w-[200px]">
      <p className="text-sm font-semibold mb-3">Nav Visibility</p>
      {NAV_LABELS.map((key) => {
        const item = items.find((i) => i.nav_key === key);
        const visible = item ? item.visible : false;
        return (
          <label key={key} className="flex items-center justify-between py-1.5 cursor-pointer">
            <span className="text-sm capitalize">{key}</span>
            <button
              type="button"
              onClick={() => toggle(key)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                visible ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  visible ? "translate-x-5" : ""
                }`}
              />
            </button>
          </label>
        );
      })}
      <button
        onClick={save}
        disabled={saving}
        className="mt-3 w-full py-1.5 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
