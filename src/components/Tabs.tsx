"use client";

import { useId, useRef, useState, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

/**
 * Accessible tabs following the WAI-ARIA tabs pattern.
 *
 * Panels are passed in as already-rendered JSX from a server component, so their
 * content ships as HTML and stays crawlable — only the show/hide toggle is
 * client-side. Inactive panels use `hidden` rather than being unmounted, so the
 * text is present in the DOM for search engines and in-page find.
 *
 * Keyboard: Arrow keys move between tabs (wrapping), Home/End jump to the ends.
 */
export default function Tabs({
  tabs,
  label,
}: {
  tabs: TabItem[];
  /** Accessible name for the tablist. */
  label: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id);
  const uid = useId();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = (id: string) => `${uid}-panel-${id}`;

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const i = tabs.findIndex((t) => t.id === active);
    if (i < 0) return;

    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;

    e.preventDefault();
    const id = tabs[next].id;
    setActive(id);
    refs.current[id]?.focus();
  }

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="inline-flex rounded-full border border-rule p-1 bg-surface backdrop-blur"
      >
        {tabs.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={tabId(t.id)}
              aria-selected={selected}
              aria-controls={panelId(t.id)}
              // Roving tabindex: only the active tab is in the tab order, so Tab
              // moves past the whole tablist rather than through every tab.
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition focus:outline-none focus:ring-2 focus:ring-accent ${
                selected
                  ? "bg-ink text-paper"
                  : "text-ink-muted hover:bg-surface"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={panelId(t.id)}
          aria-labelledby={tabId(t.id)}
          hidden={t.id !== active}
          tabIndex={0}
          className="rounded-3xl border border-rule bg-surface p-6 space-y-4 text-sm leading-relaxed text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
