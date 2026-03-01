"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import siteConfig from "@/lib/config";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="select-none">
      {/* Desktop navbar */}
      <nav className="navbar hidden sm:block h-16 leading-[4rem] w-full">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center text-center">
          <div className="font-semibold">
            <Link href="/">{siteConfig.navname}</Link>
          </div>
          <div className="flex items-center">
            {Object.entries(siteConfig.nav).map(([name, href]) => (
              <Link key={name} href={href} className="px-2 hover:text-[--link-hover]">
                {name}
              </Link>
            ))}
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile navbar */}
      <nav className="sm:hidden fixed w-full z-50 bg-[--bg] transition-all duration-600">
        <div className="flex justify-between items-center px-4 leading-[3.5rem]">
          <div>
            <Link href="/" className="font-semibold">{siteConfig.navname}</Link>
            <button
              onClick={toggleTheme}
              className="ml-1 text-sm text-[--text-secondary]"
            >
              &middot;&nbsp;{theme === "light" ? "Light" : "Dark"}
            </button>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center cursor-pointer"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                <path fill="currentColor" d="m12 12.708l-5.246 5.246q-.14.14-.344.15t-.364-.15t-.16-.354t.16-.354L11.292 12L6.046 6.754q-.14-.14-.15-.344t.15-.364t.354-.16t.354.16L12 11.292l5.246-5.246q.14-.14.345-.15q.203-.01.363.15t.16.354t-.16.354L12.708 12l5.246 5.246q.14.14.15.345q.01.203-.15.363t-.354.16t-.354-.16z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                <path fill="currentColor" d="M4.5 17.27q-.213 0-.356-.145T4 16.768t.144-.356t.356-.143h15q.213 0 .356.144q.144.144.144.357t-.144.356t-.356.143zm0-4.77q-.213 0-.356-.144T4 11.999t.144-.356t.356-.143h15q.213 0 .356.144t.144.357t-.144.356t-.356.143zm0-4.77q-.213 0-.356-.143Q4 7.443 4 7.23t.144-.356t.356-.143h15q.213 0 .356.144T20 7.23t-.144.356t-.356.144z"/>
              </svg>
            )}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="text-center border-t border-[--border] px-4 py-3 bg-[--bg] shadow-md whitespace-nowrap overflow-x-auto">
            {Object.entries(siteConfig.nav).map(([name, href]) => (
              <Link
                key={name}
                href={href}
                className="inline-block mx-4 leading-10"
                onClick={() => setMobileMenuOpen(false)}
              >
                {name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
