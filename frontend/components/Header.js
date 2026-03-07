"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import LangSwitch from "./LangSwitch";
import { useTheme } from "./ThemeProvider";
import { isAdmin, removeToken } from "@/lib/auth";
import siteConfig from "@/lib/config";

// 从 siteConfig.nav 生成全量路由
const ALL_ROUTES = Object.entries(siteConfig.nav).map(([key, href]) => ({
  key,
  href,
}));

export default function Header({ lang, dict, navVisibility = [] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [visibility, setVisibility] = useState(navVisibility);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setAdminMode(isAdmin());
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    removeToken();
    setAdminMode(false);
    window.location.reload();
  };

  // 管理员看到所有导航，普通访客按配置过滤
  const visibleRoutes = adminMode
    ? ALL_ROUTES
    : ALL_ROUTES.filter((route) => {
        const config = visibility.find((v) => v.nav_key === route.key);
        return config ? config.visible : false;
      });

  return (
    <header className="select-none">
      {/* Desktop navbar */}
      <nav
        className={`navbar hidden sm:block h-16 leading-[4rem] w-full transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-[--bg]/75 shadow-[0_1px_0_var(--border)]"
            : ""
        }`}
        style={{
          position: scrolled ? "sticky" : "relative",
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center text-center">
          <div>
            <Link
              href={`/${lang}`}
              className="text-base font-medium tracking-tight transition-colors duration-300 hover:text-[--accent]"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "1.2rem" }}
            >
              {dict.profile.navname}
            </Link>
          </div>
          <div className="flex items-center gap-1">
            {visibleRoutes.map(({ key, href }) => (
              <Link
                key={key}
                href={`/${lang}${href}`}
                className="relative px-3 text-sm tracking-wide text-[--text-secondary] hover:text-[--text] transition-colors duration-300 after:content-[''] after:absolute after:bottom-[14px] after:left-1/2 after:w-0 after:h-[1.5px] after:bg-[--accent] after:transition-all after:duration-400 after:ease-out after:-translate-x-1/2 hover:after:w-[50%]"
              >
                {dict.nav[key]}
              </Link>
            ))}
            <div className="ml-2 pl-3 border-l border-[--border] flex items-center gap-2">
              <LangSwitch lang={lang} />
              <ThemeToggle />
            </div>
            {adminMode && (
              <div className="relative ml-3 flex items-center gap-2">
                <Link
                  href="/admin"
                  className="px-2.5 py-1 text-xs border border-[--border] rounded-md hover:text-[--accent] hover:border-[--accent] transition-all duration-300"
                >
                  Manage
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs border border-[--border] rounded-md hover:text-red-500 hover:border-red-400 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile navbar */}
      <nav className="sm:hidden fixed w-full z-50 bg-[--bg]/90 backdrop-blur-xl transition-all duration-500">
        <div className="flex justify-between items-center px-4 leading-[3.5rem]">
          <div>
            <Link
              href={`/${lang}`}
              className="font-medium"
              style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontSize: "1.1rem" }}
            >
              {dict.profile.navname}
            </Link>
            <button
              onClick={toggleTheme}
              className="ml-1.5 text-xs text-[--text-secondary]"
            >
              &middot;&nbsp;{theme === "light" ? dict.theme.light : dict.theme.dark}
            </button>
          </div>
          <div className="flex items-center">
            <LangSwitch lang={lang} />
            {adminMode && (
              <>
                <Link
                  href="/admin"
                  className="ml-2 px-2 py-0.5 text-xs border border-[--border] rounded-md hover:text-[--accent] transition-colors"
                >
                  Manage
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-2 py-0.5 text-xs border border-[--border] rounded-md hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center cursor-pointer ml-2"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
                  <path fill="currentColor" d="m12 12.708l-5.246 5.246q-.14.14-.344.15t-.364-.15t-.16-.354t.16-.354L11.292 12L6.046 6.754q-.14-.14-.15-.344t.15-.364t.354-.16t.354.16L12 11.292l5.246-5.246q.14-.14.345-.15q.203-.01.363.15t.16.354t-.16.354L12.708 12l5.246 5.246q.14.14.15.345q.01.203-.15.363t-.354.16t-.354-.16z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M4.5 17.27q-.213 0-.356-.145T4 16.768t.144-.356t.356-.143h15q.213 0 .356.144q.144.144.144.357t-.144.356t-.356.143zm0-4.77q-.213 0-.356-.144T4 11.999t.144-.356t.356-.143h15q.213 0 .356.144t.144.357t-.144.356t-.356.143zm0-4.77q-.213 0-.356-.143Q4 7.443 4 7.23t.144-.356t.356-.143h15q.213 0 .356.144T20 7.23t-.144.356t-.356.144z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        <div
          className="border-t border-[--border] px-4 bg-[--bg]/90 backdrop-blur-xl whitespace-nowrap overflow-x-auto transition-all duration-400 ease-out origin-top"
          style={{
            maxHeight: mobileMenuOpen ? "200px" : "0",
            paddingTop: mobileMenuOpen ? "0.75rem" : "0",
            paddingBottom: mobileMenuOpen ? "0.75rem" : "0",
            opacity: mobileMenuOpen ? 1 : 0,
            overflow: "hidden",
          }}
        >
          {visibleRoutes.map(({ key, href }, i) => (
            <Link
              key={key}
              href={`/${lang}${href}`}
              className="inline-block mx-4 leading-10 text-sm"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                transitionDelay: mobileMenuOpen ? `${i * 50}ms` : "0ms",
              }}
            >
              {dict.nav[key]}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
