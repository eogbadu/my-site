# CLAUDE.md — Project Context

Read this first. It is loaded into context automatically each session.

## What this is

Personal portfolio site for Ekele Ogbadu. **Live at https://www.ekeleogbadu.io.**
Treat every change as production-facing.

Next.js 15.5.5 (App Router, Turbopack) · React 19.1 · TypeScript `strict` · Tailwind v4
(CSS-first) · zod 4 · nodemailer · lucide-react. Node >= 20.

## Deployment topology (verified, not assumed)

- **Vercel serves the site** — `A 216.198.79.1`, `server: Vercel` response header.
- **IONOS provides DNS + email only** — NS `ui-dns.*`, MX `mx*.ionos.com`.
- **`https://www.ekeleogbadu.io` is canonical.** The apex 307-redirects to `www`.
  Use the www origin for `metadataBase`, canonicals, sitemap URLs, and OAuth callbacks.
- **There is no production Docker.** `.devcontainer/` is a VS Code dev container only.
- An IONOS MariaDB 10.6 exists but holds **only leftover WordPress tables**. It is
  unused, deliberately not part of this project, and must not be modified.

## Where things are documented

| File | Purpose |
|---|---|
| `docs/PROGRESS.md` | **Read on resume.** Phase-by-phase status — what's done, what's next |
| `docs/DECISIONS.md` | Architecture decisions and *why*, including options rejected |
| `docs/ERRORS.md` | Bugs found, root causes, fixes, and gotchas that cost time |
| `docs/RUNBOOK.md` | Human action items, env vars, setup and deploy procedures |
| `~/.claude/plans/review-the-code-we-lively-melody.md` | The full approved plan |

**Keep these current as you work** — they are how state survives a context clear.
Update `PROGRESS.md` when a phase completes, `ERRORS.md` when a non-obvious bug is
found or fixed, and `DECISIONS.md` when a choice is made that a future reader would
otherwise second-guess.

## Working agreements

- **One commit per phase.** Phases 1–6 and 11–12 go straight to `main`;
  **phases 7–10 go via a branch** so Vercel builds a Preview to verify first.
- Verify with `npx tsc --noEmit && npx eslint . && npm run build` before committing.
- The user handles: Neon provisioning, GitHub OAuth apps, Vercel env vars, image
  compression, and running migrations against production. See `docs/RUNBOOK.md`.

## Landmines

- **`src/lib/tags.ts` `tagToSlug` is reused** for post slugs and the `tag_slugs`
  column. Don't duplicate the regex.
- **Static route segments beat dynamic ones.** `src/app/blog/hello-world/page.mdx`
  must be deleted in the *same commit* that adds `src/app/blog/[slug]/page.tsx`, or
  the static file silently keeps winning.
- **Unlayered CSS beats Tailwind's layered utilities.** The `body {}` rule in
  `globals.css` overrides `bg-white dark:bg-slate-950` — this must be removed before
  the dark-mode toggle can work.
- **Server Actions are publicly reachable POST endpoints.** Auth must be re-checked
  *inside* every action via `requireAdmin()`, not just on the page that renders the form.
- **MDX is executable code, not data.** Anything that can write `posts.body` gets
  server-side RCE. Keep `DATABASE_URL` server-only.
- Never set `runtime = "edge"` on blog routes — the MDX compiler needs Node.
- No route may read the database at build time (no `generateStaticParams` over DB
  data), so a DB outage can never fail a deploy.
