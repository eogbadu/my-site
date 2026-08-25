import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

export default async function AdminLoginPage() {
  const session = await auth();
  const adminId = process.env.ADMIN_GITHUB_ID;
  if (adminId && session?.user?.githubId === adminId) redirect("/admin");

  return (
    <section className="max-w-sm mx-auto py-20 space-y-6 text-center">
      <div className="space-y-2">
        <p className="eyebrow">Restricted</p>
        <h1 className="font-display text-3xl tracking-[-0.01em]">Sign in</h1>
        <p className="text-sm text-ink-muted">
          This area is limited to a single GitHub account.
        </p>
      </div>

      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/admin" });
        }}
      >
        <button
          type="submit"
          className="w-full rounded-full bg-ink text-paper px-5 py-2.5 text-sm font-medium hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper"
        >
          Continue with GitHub
        </button>
      </form>
    </section>
  );
}
