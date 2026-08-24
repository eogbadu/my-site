"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const links = siteConfig.nav;

  // Escape closes the menu and returns focus to the trigger, so keyboard users
  // aren't stranded inside a dismissed panel.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
      <nav
        aria-label="Main"
        className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between"
      >
        <Link
          href="/"
          className="font-semibold tracking-tight rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          {siteConfig.shortName}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="hover:text-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                {l.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          ref={toggleRef}
          type="button"
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {/* lucide icons set aria-hidden themselves; the button carries the label */}
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <ul
          id="mobile-menu"
          className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                onClick={() => setOpen(false)}
              >
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
