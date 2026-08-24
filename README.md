# ekeleogbadu.io

Personal portfolio site — projects, research, résumé, and a blog.

**Live:** https://www.ekeleogbadu.io

## Stack

- **Next.js 15** (App Router, Turbopack) · **React 19** · **TypeScript** (`strict`)
- **Tailwind CSS v4** — CSS-first config; there is deliberately no `tailwind.config.ts`
  (v4 does not load one without an `@config` directive, so it was inert and misleading)
- **MDX** for blog content, **zod** for validation, **nodemailer** for the contact form
- **lucide-react** for icons, **next/font** for Geist

Deployed on **Vercel**. IONOS provides DNS and email only. Note the apex redirects to
`www`, so **`https://www.ekeleogbadu.io` is the canonical origin**.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the SMTP values
npm run dev                  # http://localhost:3000
```

## Scripts

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint

npx tsc --noEmit # type check

# Diagnose SMTP credentials without a deploy cycle:
node --env-file=.env.local scripts/check-smtp.mjs
node --env-file=.env.local scripts/check-smtp.mjs --send
```

## Environment

All variables are **server-only**. Never add a `NEXT_PUBLIC_` prefix to any of them —
that inlines the value into the browser bundle. `src/lib/env.ts` validates them at import
time with zod, so a missing key fails loudly and by name.

See `.env.example` for the full list.

## Project layout

```
src/
  app/                  routes (App Router)
    api/contact/        contact form endpoint — rate limited, honeypot, zod validated
    blog/               blog index, per-tag pages, and MDX posts
  components/           UI components
    mdx-components.tsx  styled element map for MDX content
  mdx-components.tsx    Next.js convention file — must be here and named-export
                        useMDXComponents, or MDX renders unstyled
  config/               site-wide configuration
  data/                 typed content: projects, research, résumé, posts
  lib/                  utilities: env, tags, grouping, rate limiting
  types/                shared content types
scripts/                operational scripts
docs/                   engineering docs — see below
```

## Documentation

| File | Purpose |
|---|---|
| `CLAUDE.md` | Project context and landmines |
| `docs/PROGRESS.md` | Phase-by-phase status and session log |
| `docs/DECISIONS.md` | Architecture decisions, including rejected alternatives |
| `docs/ERRORS.md` | Bugs found, root causes, fixes, gotchas |
| `docs/RUNBOOK.md` | Environment, commands, deploy, action items |

## Deploying

Vercel deploys `main` automatically on push. Roll back with `git revert` and push;
production redeploys in about ninety seconds.
