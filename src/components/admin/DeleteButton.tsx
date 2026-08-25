"use client";

import { useState, useTransition } from "react";

/**
 * Typed-slug confirmation rather than a bare confirm(). There are very few posts
 * and each is irreplaceable, so a click-through dialog is too easy to dismiss.
 */
export default function DeleteButton({
  slug,
  onDelete,
}: {
  slug: string;
  onDelete: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-danger hover:underline underline-offset-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-danger/40 p-3">
      <p className="text-sm text-ink-muted">
        Type <code className="font-mono text-ink">{slug}</code> to confirm deletion.
      </p>
      <input
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        className="w-full rounded-lg border border-rule bg-surface px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label={`Type ${slug} to confirm`}
        autoFocus
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={typed !== slug || pending}
          onClick={() => startTransition(async () => { await onDelete(); })}
          className="text-sm text-danger disabled:opacity-40 hover:underline underline-offset-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {pending ? "Deleting…" : "Delete permanently"}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setTyped(""); }}
          className="text-sm text-ink-faint hover:text-ink rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
