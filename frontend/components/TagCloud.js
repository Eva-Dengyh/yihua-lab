"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TagCloud({ tags, lang }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="my-3 pt-8 flex flex-wrap gap-2.5">
      {tags.map((tag, i) => (
        <Link
          key={tag.name}
          href={`/${lang}/tags/${encodeURIComponent(tag.name)}`}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border border-[--border] text-[--text-secondary] hover:text-[--accent] hover:border-[--accent]/40 hover:bg-[--accent-soft] transition-all duration-300 hover:-translate-y-0.5"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(12px) scale(0.95)",
            transition: `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 30}ms, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 30}ms, color 0.3s ease, border-color 0.3s ease, background-color 0.3s ease`,
          }}
        >
          <span>{tag.name}</span>
          <small className="text-[10px] opacity-50">{tag.count}</small>
        </Link>
      ))}
    </div>
  );
}
