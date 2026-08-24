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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-paper/85 border-b border-rule">
      <nav
        aria-label="Main"
        className="mx-auto max-w-5xl px-5 sm:px-8 h-16 flex items-center justify-between"
      >
        <Link
          href="/"
          className="font-display text-xl tracking-tight rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {siteConfig.shortName}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7 text-[0.9rem]">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-ink-muted hover:text-ink link-underline rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
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
          className="md:hidden p-2 rounded-md text-ink-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent"
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
          className="md:hidden px-5 pb-4 space-y-1 bg-paper border-t border-rule"
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block py-2.5 text-ink-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent rounded-sm"
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
