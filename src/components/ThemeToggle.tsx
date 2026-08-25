"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

export type Theme = "light" | "dark" | "system";

const ORDER: Theme[] = ["light", "dark", "system"];

const ICONS = { light: Sun, dark: Moon, system: Monitor } as const;
const LABELS = {
  light: "Light theme",
  dark: "Dark theme",
  system: "System theme",
} as const;

/**
 * Applies the theme by setting data-theme on <html>. "system" removes the
 * attribute entirely so the prefers-color-scheme rules in globals.css take over —
 * which is why system mode needs no JS beyond clearing the attribute.
 */
function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
    root.style.colorScheme = "light dark";
  } else {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    setTheme(stored ?? "system");
    setMounted(true);
  }, []);

  function cycle() {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    setTheme(next);
    if (next === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", next);
    apply(next);
  }

  // Render a fixed-size placeholder before mount. The stored theme is unknown
  // during SSR, so rendering the real icon would guarantee a hydration mismatch.
  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden="true" />;
  }

  const Icon = ICONS[theme];

  return (
    <button
      type="button"
      onClick={cycle}
      className="w-9 h-9 grid place-items-center rounded-md text-ink-faint hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
      // The label states the *current* theme; the title explains what a click does.
      aria-label={LABELS[theme]}
      title={`${LABELS[theme]} — click to change`}
    >
      <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
