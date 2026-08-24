# Architecture Decisions

Why things are the way they are — including options rejected, so a future reader
doesn't relitigate a settled choice or "fix" something that was deliberate.

---

## D1 — Neon Postgres, not the existing IONOS MariaDB

**Decision:** provision Neon through the Vercel Marketplace. Leave the MariaDB alone.

**The honest counterargument:** the MariaDB is already provisioned and paid for.

**Why Neon anyway:**
1. **Reachability.** IONOS shared MariaDB is firewalled to the IONOS network. Vercel
   functions have *dynamic* egress IPs (static egress is a paid add-on), so
   IP-allowlisting is impractical. The alternative is exposing MariaDB to `0.0.0.0/0`.
2. **Connection exhaustion.** Serverless + classic MySQL is a known trap: every cold
   instance opens its own TCP connection against a low shared `max_connections`.
   Neon's HTTP driver holds no persistent connection at all.
3. **The alternative is more work.** Reaching that DB privately means moving the app
   into an IONOS container — Dockerfile, process manager, reverse proxy, TLS renewal —
   and giving up the Vercel ISR/Data Cache this whole caching design depends on.
4. **There is no data to preserve** — only leftover WordPress tables.

**Rejected: Supabase.** Its free tier *pauses after 7 days idle* and needs a manual
dashboard unpause. A blog posted to monthly would be found paused and `/blog` would 500.
Neon autosuspends and resumes transparently in ~300-500 ms.

---

## D2 — Drizzle + `@neondatabase/serverless`, not Prisma

TypeScript-first (matches the existing hand-typed `src/types/content.ts` style), and
`drizzle-kit generate` emits **plain SQL files you commit and read before running**.

**Rejected: Prisma** — needs a `generate` step wired into `next build`, which can turn a
green deploy red for reasons unrelated to your change. Heavier serverless bundle.

**Known limitation, accepted:** `neon-http` has no interactive transactions. Every write
in this design is a single statement, including the view-count increment (see D6).

**Bonus:** the HTTP driver works from a laptop against the same Neon project, so there is
**no local Postgres and no Docker for development.** Use a Neon branch for local work.

---

## D3 — Auth.js v5 + GitHub OAuth, JWT sessions, zero auth tables

**Rejected: credentials + argon2** — you'd own login rate limiting, hash rotation, session
revocation, and CSRF, with no MFA. Four things easy to get subtly wrong, buying nothing
over "log in with the GitHub account you're already logged into."

**Rejected: Clerk** — a hosted identity platform for exactly one user, plus vendor lock-in.

**Allowlist on the numeric GitHub ID `70936452`, never the login string** — logins can be
renamed and then reclaimed by someone else.

**JWT sessions, deliberately:** no `users`/`accounts`/`sessions` tables, so the schema
stays at two tables and there are zero DB round-trips per request.
**Trade-off:** no server-side revocation before expiry (7 days).
**Panic button:** rotate `AUTH_SECRET` in Vercel — every session dies instantly.

**Pin `next-auth@5.0.0-beta.32` exactly, no caret.** It has been in beta a long time and
the API moves between betas; a routine `npm install` must not move you onto a break.

---

## D4 — Three auth layers, but only one is the security boundary

| Layer | Purpose |
|---|---|
| `src/middleware.ts` | **UX only.** Redirect before render. *Not* a boundary — Next middleware has had bypass CVEs |
| `src/app/admin/layout.tsx` | Defense in depth |
| `requireAdmin()` in **every** server action | **The actual boundary** |

The third row is what people get wrong. **Server Actions compile to publicly reachable
POST endpoints addressed by action ID.** Someone who knows the ID can invoke `deletePost`
without ever loading `/admin`. An auth check on the page that renders the form protects
nothing.

**CSRF needs no code:** Auth.js double-submits its own token on `/api/auth/*`, and Next 15
validates `Origin` against `Host` for Server Actions. This holds **only if all mutations
go through Server Actions** — so no custom mutating route handlers under `/admin`.

---

## D5 — Runtime MDX via `next-mdx-remote/rsc`, and why it's safe here

**MDX is not data — it is a program.** It compiles to JS and is evaluated with
`new Function` in the **Node server runtime**. So the question isn't "can this XSS a
visitor," it's **"who can write `posts.body`, because that person has server-side RCE"**
with access to `DATABASE_URL`, `SMTP_PASS`, and `AUTH_SECRET`.

Write paths to `posts.body`, all closed:
1. The authenticated, ID-allowlisted admin — intended.
2. Anyone holding `DATABASE_URL` — closed by `import "server-only"` in `src/db/index.ts`,
   which fails the build if a client component ever imports it. Never `NEXT_PUBLIC_`.
3. SQL injection — Drizzle parameterizes everything. Never string-concatenate into ``sql` ` ``.

**Verdict: acceptable for a single trusted author.**

**The thing most people get wrong:** `rehype-sanitize` does **not** fix this. It runs on
the HAST *after* compilation — by then any `{expression}` has already executed. It
protects against untrusted *markup*, not untrusted *MDX*. Don't reach for it as a
substitute for the trust boundary.

**Cheap hardening applied anyway:** a remark plugin that throws on `mdxjsEsm` nodes (no
`import`/`export` in post bodies), and `compileCheck()` on save so a post that would crash
the public page can never be stored.

**The downgrade switch is one line:** flipping `format: "mdx"` to `"md"` in
`src/lib/mdx.ts` disables JSX and expressions entirely. That is the correct migration if a
second author or comments ever appear — *not* adding sanitize.

**Rejected: storing compiled HTML.** Safest, but loses the styled component map (the very
thing E4 is about restoring) and freezes styling into old rows.

---

## D6 — Caching: `unstable_cache` + tags, and never revalidate on a view

Reads are wrapped in `unstable_cache` tagged `posts` / `post:${slug}`. Every mutation calls
`revalidateBlog()`, which fires **both** `revalidateTag` (Data Cache) and
`revalidatePath(pattern, "page")` (Full Route Cache). Publishing is therefore instant with
no rebuild, and steady-state reads cost zero DB queries.

**Rejected: `use cache` / `cacheLife`** — canary-only in Next 15.5. This is a live site.

**No route reads the DB at build time.** No `generateStaticParams` over DB data, and
migrations never run in `next build`. Consequences, all deliberate:
- A Neon outage can never fail a deploy.
- CI can run `next build` **without any secrets**.
- Cost: one HTTP query on first request after a cache miss (~30-80 ms warm).

**The view-count rule:** the increment endpoint **must never call `revalidateTag`** — that
would bust the page cache on every single pageview, which is worse than no cache at all.
Instead the endpoint *returns* the new count and the client component renders it, so the
number is live without the page cache ever knowing.

---

## D7 — Dual tag columns (`tags` + `tag_slugs`)

`tagToSlug` is lossy and `slugToLabel` is a guessing fallback that renders
`"Trustworthy AI"` as `"Trustworthy Ai"`. Storing both the display labels and their slugs
makes the tag page one GIN-indexed query **and** recovers the exact authored label.

**Rejected: normalized `tags` + `post_tags` join.** More correct for renames, but for one
author and <100 posts it's machinery you'd maintain and never benefit from.

---

## D8 — Plain MDX textarea, not a rich text editor

**Rejected: Tiptap/Lexical.** WYSIWYG editors serialize to their own document model;
round-tripping that to MDX loses exactly the things you use — code fences, tables, JSX.
You'd maintain a serializer instead of a blog.

Preview is a **server-rendered route** using the same `<MdxContent>` as the public page, so
it is byte-accurate by construction. A second client-side renderer would quietly disagree
with production.

---

## D9 — Hand-rolled dark mode, not `next-themes`

`next-themes` (~3 KB) would give the anti-flash script, system sync, and cross-tab
`storage` events for free. The hand-rolled version is ~50 lines you fully understand, and
the one thing genuinely given up — cross-tab sync — is cosmetic on a personal site.
Swapping to `next-themes` later is a ~15-minute change against the same CSS.

**Prerequisite:** the unlayered `body {}` rule must be removed first (see ERRORS E6), or
the toggle appears to do nothing.

---

## D10 — Vercel Analytics, not Plausible

Zero config on the existing host, free on Hobby, **cookieless so no consent banner**, and
Speed Insights gives real-user Core Web Vitals — which is how you verify the image and
`priority` work actually helped. Plausible is $9/mo and needs a first-party proxy subpath
to survive ad blockers.

**Both metrics are worth having:** Vercel tells you traffic shape; the DB `view_count` is
first-party and immune to ad blockers, so it's the number worth displaying.

---

## D11 — Visual direction: editorial, not product or terminal

**Brief:** the site serves two audiences — recruiters, and academic peers at conferences.
That constraint decided the direction.

Rejected **bold product** (large type, saturated gradients, motion): memorable, but it
undersells a PhD and reads as marketing to a conference audience.
Rejected **technical/terminal** (mono everything, dark-first, grid lines): distinctive, but
reads junior to recruiters and cold to academics.

**Chosen: editorial.** A high-contrast display serif (Instrument Serif) against a geometric
sans (Geist), warm paper ground, hairline rules, mono eyebrow labels, and numbered indices.
Typographic contrast between serif and sans is the single biggest reason the site no longer
reads as a default template — one sans everywhere is the tell.

The serif does specific work: it carries a publication register that a conference audience
recognises immediately, while the project cards, screenshots, and demo video carry the
industry story. Both audiences get served without the design shouting at either.

**Token system** in `globals.css`: values on `:root`, mapped through `@theme inline` so
Tailwind generates `bg-paper`, `text-ink-muted`, `border-rule`. Dark mode redefines the same
custom properties inside the media query — the utilities need no `dark:` variants at all,
which is also why the Phase 5 toggle will be a small change.

Palette is warm paper `#fbfaf8` / ink `#17171a` rather than pure white on slate, because
pure white plus default slate is precisely what every Tailwind starter looks like.

**Favicon:** serif "EO" on ink, matching the palette. Ships as `favicon.ico` (an ICO
container wrapping a 256px PNG, assembled by hand since sharp cannot write ICO), plus
`icon.png` and an unrounded `apple-icon.png` for iOS to mask itself.
