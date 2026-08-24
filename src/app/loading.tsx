/**
 * Route-level loading fallback. Every page is statically prerendered today, so
 * this rarely appears — it matters once blog routes read from the database.
 */
export default function Loading() {
  return (
    <div className="py-16 space-y-4 animate-pulse" role="status" aria-label="Loading">
      <div className="h-8 w-1/3 rounded bg-rule" />
      <div className="h-4 w-2/3 rounded bg-rule" />
      <div className="h-4 w-1/2 rounded bg-rule" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
