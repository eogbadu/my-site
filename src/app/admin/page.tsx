import { requireAdmin } from "@/lib/admin";

export default async function AdminHomePage() {
  const session = await requireAdmin();

  return (
    <section className="space-y-4">
      <p className="eyebrow">Dashboard</p>
      <p className="text-ink-muted">
        Signed in as {session.user?.name ?? "admin"}.
      </p>
      <p className="text-sm text-ink-faint">
        Post management arrives in the next phase.
      </p>
    </section>
  );
}
