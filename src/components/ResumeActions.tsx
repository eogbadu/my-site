"use client";

import { useState } from "react";

export default function ResumeActions() {
  const [copied, setCopied] = useState<null | "ok" | "fail">(null);

  async function copyLink() {
    try {
      const url = `${window.location.origin}/resume.pdf`;
      await navigator.clipboard.writeText(url);
      setCopied("ok");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied("fail");
      setTimeout(() => setCopied(null), 2000);
    }
  }

  function printPage() {
    window.print();
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href="/resume.pdf"
        target="_blank"
        className="rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-2.5 text-sm font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400"
        aria-label="Download PDF resume"
      >
        Download PDF
      </a>

      <button
        type="button"
        onClick={copyLink}
        className="rounded-2xl ring-1 ring-slate-300 dark:ring-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
        aria-live="polite"
      >
        {copied === "ok"
          ? "Link copied!"
          : copied === "fail"
          ? "Copy failed"
          : "Copy share link"}
      </button>

      <button
        type="button"
        onClick={printPage}
        className="rounded-2xl ring-1 ring-slate-300 dark:ring-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        Print this page
      </button>
    </div>
  );
}
