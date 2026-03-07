"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function formatDate(dateStr, months) {
  const d = new Date(dateStr);
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function RevealGroup({ children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}

export default function ArchiveList({ posts, lang, dict }) {
  const grouped = {};
  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  });

  const years = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <div className="post-wrap relative w-full max-w-[780px] mx-auto pt-8">
      {years.map((year, yearIdx) => (
        <RevealGroup key={year}>
          <div className="mb-2">
            <h3
              className="text-3xl font-light mt-10 mb-5 text-[--text-secondary]"
              style={{
                fontFamily: "'Crimson Pro', Georgia, serif",
                animationDelay: `${yearIdx * 100}ms`,
              }}
            >
              {year}
            </h3>
            <div className="space-y-0">
              {grouped[year].map((post, i) => (
                <article
                  key={post.slug}
                  className="group relative"
                  style={{
                    animation: "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  <Link
                    href={`/${lang}/posts/${encodeURIComponent(post.slug)}`}
                    className="flex items-baseline gap-4 py-3 px-3 -mx-3 rounded-lg no-underline transition-all duration-300 hover:bg-[--accent-soft] group"
                  >
                    <span className="text-xs text-[--text-secondary] shrink-0 tabular-nums tracking-wider min-w-[4.5em]">
                      {formatDate(post.date, dict.months)}
                    </span>
                    <span className="flex-1 min-w-0 truncate transition-colors duration-300 group-hover:text-[--accent]">
                      {post.title}
                    </span>
                    <span className="text-[--accent] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-4px] group-hover:translate-x-0 text-sm shrink-0">
                      &rarr;
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </RevealGroup>
      ))}
    </div>
  );
}
