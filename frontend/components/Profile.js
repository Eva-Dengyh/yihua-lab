"use client";

import Link from "next/link";
import siteConfig from "@/lib/config";
import { useState, useEffect } from "react";

export default function Profile({ lang, dict }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex flex-col justify-center items-center flex-1 px-4 overflow-hidden">
      {/* 浮动光晕背景 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute top-[15%] left-[20%] w-[340px] h-[340px] rounded-full blur-[100px]"
          style={{
            background: "var(--orb-1)",
            animation: "float-orb 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[40%] right-[15%] w-[280px] h-[280px] rounded-full blur-[90px]"
          style={{
            background: "var(--orb-2)",
            animation: "float-orb-reverse 25s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[20%] left-[40%] w-[200px] h-[200px] rounded-full blur-[80px]"
          style={{
            background: "var(--orb-3)",
            animation: "float-orb 18s ease-in-out infinite 3s",
          }}
        />
      </div>

      <div className="text-center relative z-10">
        {/* 头像 */}
        <div
          className="p-3"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(30px) scale(0.92)",
            transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Link href={`/${lang}/posts`}>
            <img
              src={siteConfig.avatar}
              alt="avatar"
              className="w-32 h-auto inline-block rounded-full transition-all ease-out duration-600 cursor-pointer hover:-translate-y-2"
              style={{
                boxShadow: "0 0 0 4px var(--bg), 0 0 0 5px var(--border), 0 8px 30px rgba(0,0,0,0.08)",
              }}
            />
          </Link>
        </div>

        {/* 昵称 */}
        <div
          className="mt-3"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.12s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.12s",
          }}
        >
          <span
            className="text-4xl font-light tracking-tight"
            style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
          >
            {dict.profile.nickname}
          </span>
        </div>

        {/* 描述 */}
        <div
          className="mt-3 leading-relaxed text-[--text-secondary] max-w-md mx-auto"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.24s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.24s",
            fontSize: "0.95em",
          }}
          dangerouslySetInnerHTML={{ __html: dict.profile.description }}
        />

        {/* 分隔线 */}
        <div
          className="mt-5 mb-4 mx-auto"
          style={{
            width: mounted ? "40px" : "0px",
            height: "1.5px",
            background: "var(--accent)",
            transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.35s",
          }}
        />

        {/* 社交链接 */}
        <div
          className="flex justify-center gap-5"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.42s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.42s",
          }}
        >
          {Object.entries(siteConfig.links).map(([name, href]) => {
            if (!href) return null;
            const label = dict.links?.[name] || name;
            return (
              <a
                key={name}
                href={href}
                title={label}
                className="text-sm tracking-wide text-[--text-secondary] hover:text-[--accent] transition-all duration-300 hover:-translate-y-0.5 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[--accent] after:transition-all after:duration-300 hover:after:w-full"
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
