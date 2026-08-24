"use client";

import { useState } from "react";

import { siteConfig, absoluteUrl } from "@/config/site";

export default function ResumeActions() {
  const [copied, setCopied] = useState<null | "ok" | "fail">(null);

  async function copyLink() {
    try {
      // Deliberately not window.location.origin: on the apex that yields a URL
      // which 307-redirects to www. Share the canonical origin instead.
      const url = absoluteUrl(siteConfig.resumePdf);
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
        href={siteConfig.resumePdf}
        target="_blank"
        className="rounded-2xl bg-ink text-paper px-5 py-2.5 text-sm font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Download PDF resume"
      >
        Download PDF
      </a>

      <button
        type="button"
        onClick={copyLink}
        className="rounded-2xl ring-1 ring-rule px-4 py-2 text-sm font-semibold hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
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
        className="rounded-2xl ring-1 ring-rule px-4 py-2 text-sm font-semibold hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Print this page
      </button>
    </div>
  );
}
