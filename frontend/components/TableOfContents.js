"use client";

import { useEffect, useState } from "react";

export default function TableOfContents({ dict }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const content = document.querySelector(".post-content");
    if (!content) return;

    const elements = content.querySelectorAll("h1, h2, h3, h4, h5");
    const items = Array.from(elements).map((el) => ({
      id: el.id,
      text: el.textContent,
      level: parseInt(el.tagName.charAt(1)),
    }));
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="post-toc fixed top-24 right-8 w-60 text-xs hidden xl:block">
      <div className="max-h-[450px] max-w-[250px] overflow-auto pr-3.5 scrollbar-thin">
        <ul className="list-none">
          {headings.map((h) => (
            <li key={h.id} style={{ marginLeft: `${(h.level - 1) * 0.5}rem` }}>
              <a
                href={`#${h.id}`}
                className={`block py-0.5 transition-colors ${
                  activeId === h.id
                    ? "text-[--post-link] font-medium"
                    : "text-[--text-secondary] hover:text-[--text]"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 mx-3 text-xs">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="block my-1.5 text-gray-400 cursor-pointer hover:text-gray-600"
        >
          {dict.common.backToTop}
        </button>
        <button
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
          className="block my-1.5 text-gray-400 cursor-pointer hover:text-gray-600"
        >
          {dict.common.goToBottom}
        </button>
      </div>
    </div>
  );
}
