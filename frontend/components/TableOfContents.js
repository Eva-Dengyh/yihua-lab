"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export default function TableOfContents({ dict }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const tocListRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    const content = document.querySelector(".post-content");
    if (!content) return;

    const elements = content.querySelectorAll("h1, h2, h3, h4, h5");
    const items = Array.from(elements)
      .filter((el) => el.id)
      .map((el) => ({
        id: el.id,
        text: el.textContent,
        level: parseInt(el.tagName.charAt(1)),
      }));
    setHeadings(items);

    if (items.length === 0) return;

    /* 滚动时根据 heading 在视口中的位置确定当前章节 */
    const handleScroll = () => {
      const headingEls = Array.from(elements).filter((el) => el.id);
      const scrollY = window.scrollY;
      const offset = 120;

      let current = headingEls[0]?.id || "";
      for (const el of headingEls) {
        if (el.getBoundingClientRect().top + window.scrollY - offset <= scrollY) {
          current = el.id;
        }
      }
      setActiveId(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* 活跃条目自动滚入 TOC 可视区 */
  useEffect(() => {
    if (activeRef.current && tocListRef.current) {
      const container = tocListRef.current;
      const el = activeRef.current;
      const elTop = el.offsetTop;
      const elH = el.offsetHeight;
      const cScroll = container.scrollTop;
      const cH = container.clientHeight;

      if (elTop < cScroll || elTop + elH > cScroll + cH) {
        container.scrollTo({ top: elTop - cH / 2 + elH / 2, behavior: "smooth" });
      }
    }
  }, [activeId]);

  if (headings.length === 0) return null;

  const minLevel = Math.min(...headings.map((h) => h.level));

  return (
    <nav className="post-toc w-52 hidden xl:block fixed top-36 left-[calc((100vw-780px)/2-14rem)]" aria-label="Table of contents">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className="w-4 h-[2px] bg-[--accent] rounded-full opacity-60" />
        <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[--text-secondary]">
          Contents
        </span>
      </div>

      {/* 目录列表 */}
      <div ref={tocListRef} className="relative max-h-[420px] overflow-y-auto pr-2 toc-scroll">
        {/* 左侧轨道线 */}
        <div className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-[--border] rounded-full opacity-50" />

        <ul className="list-none relative">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            const indent = (h.level - minLevel) * 0.75;

            return (
              <li
                key={h.id}
                ref={isActive ? activeRef : undefined}
                className="relative"
              >
                {/* 活跃指示器 - 始终渲染，靠 opacity/scale 动画 */}
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[1.5px] bg-[--accent] rounded-full transition-all duration-300 ease-out"
                  style={{
                    height: isActive ? "16px" : "0px",
                    opacity: isActive ? 1 : 0,
                  }}
                />
                <a
                  href={`#${h.id}`}
                  className={`toc-link block py-[5px] text-[12px] leading-snug rounded-r-md transition-all duration-300 ${
                    isActive
                      ? "text-[--accent] font-semibold bg-[--accent-soft]"
                      : "text-[--text-secondary] hover:text-[--text]"
                  }`}
                  style={{ paddingLeft: `${0.75 + indent}rem` }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 底部快捷操作 */}
      <div className="mt-4 pt-3 border-t border-[--border]/50 flex items-center gap-3 px-1">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="toc-action-btn group flex items-center gap-1.5 text-[11px] text-[--text-secondary] hover:text-[--accent] transition-colors duration-300 cursor-pointer"
          title={dict.common.backToTop}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-0.5">
            <path d="M12 19V5M5 12L12 5L19 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{dict.common.backToTop}</span>
        </button>
        <span className="text-[--border] text-[10px] select-none">&middot;</span>
        <button
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
          className="toc-action-btn group flex items-center gap-1.5 text-[11px] text-[--text-secondary] hover:text-[--accent] transition-colors duration-300 cursor-pointer"
          title={dict.common.goToBottom}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0.5">
            <path d="M12 5V19M19 12L12 19L5 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{dict.common.goToBottom}</span>
        </button>
      </div>
    </nav>
  );
}
