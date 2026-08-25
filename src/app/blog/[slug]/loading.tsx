export default function Loading() {
  return (
    <div className="py-8 space-y-6 animate-pulse" role="status" aria-label="Loading post">
      <div className="h-10 w-3/4 rounded bg-rule" />
      <div className="h-4 w-40 rounded bg-rule" />
      <div className="space-y-3 pt-6">
        <div className="h-4 w-full rounded bg-rule" />
        <div className="h-4 w-11/12 rounded bg-rule" />
        <div className="h-4 w-4/5 rounded bg-rule" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
