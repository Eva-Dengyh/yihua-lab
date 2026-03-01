"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="theme-toggle" onClick={toggleTheme}>
      <span className="sr-only">Toggle theme</span>
      <span
        className={`theme-toggle-track ${theme === "dark" ? "active" : ""}`}
      >
        <span className="theme-toggle-thumb" />
      </span>
    </label>
  );
}
