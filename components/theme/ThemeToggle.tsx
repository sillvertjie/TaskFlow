"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();

  return (
    <button
      suppressHydrationWarning
      onClick={toggleTheme}
      className="
        rounded
        border
        px-3
        py-2
        text-sm
        bg-white
        text-gray-900
        dark:bg-gray-900
        dark:text-white
      "
    >
      {dark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
