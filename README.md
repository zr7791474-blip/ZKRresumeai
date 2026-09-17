# ZKR Resume AI — Demo

A UI-focused demo of an AI resume builder, built with Next.js 15 (App Router) and Tailwind CSS. This build has **no backend** — no database, no authentication, and no external API calls. Everything runs in the browser.

## What this is

Two demo experiences, sharing the same branding, components, and design system:

1. **Client demo** — landing page, browsable template gallery with a detail page per template, a dashboard with a resume list, a resume editor with a live preview, deterministic offline "AI" writing tools, and PDF/DOCX/JSON export. Resume data is stored in `localStorage` via a persisted Zustand store, seeded with one realistic sample resume.
2. **Admin demo** — a separate `/admin` section (overview stats, users table, template catalog) showing what an admin screen could look like. All admin data is static/mock — it is not connected to the client demo's local data.

There is no login, no registration, no real user accounts, and no server-side persistence of any kind.

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **UI:** Tailwind CSS + Radix UI primitives (shadcn/ui style), Framer Motion
- **State:** Zustand, persisted to `localStorage` for the resume data only
- **Validation:** Zod (used for the contact form only)
- **"AI" tools:** deterministic, offline heuristic functions in `src/lib/ai-tools.ts` — no API key, no network call, no cost
- **Exports:** `pdf-lib` (PDF) and `docx` (Word), built entirely client-side and downloaded via the browser

## Running locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`. No environment variables, database, or API keys are required.

`.env.example` lists two optional, non-secret variables that only affect page metadata (app name/URL used in `<title>`, Open Graph tags, and the sitemap). You can ignore it entirely for local development.

## Verification

```bash
npm run lint        # ESLint — clean
npx tsc --noEmit    # TypeScript — clean
npm run build       # Production build — all routes compile and prerender
```

## Project structure

```
src/
  app/
    (dashboard)/dashboard/...   client demo: dashboard, resumes, resume editor, templates picker
    (admin)/admin/...           admin demo: overview, users, templates
    templates/                  public template gallery + per-template detail page
    contact/, pricing/          marketing pages (contact form and pricing are simulated, no backend)
  components/
    ui/                         design-system primitives (buttons, dialogs, inputs, etc.)
    layout/                     navbar, sidebar, mobile nav, footer, theme toggle
    resume/                     section editor, AI tools panel, resume preview
    shared/                     misc shared UI (empty states, animated container, etc.)
  data/                         all mock/demo data lives here (templates, demo resume, mock users/activity)
  hooks/                        thin hooks over the local resumes store
  stores/                       persisted Zustand store for demo resumes
  lib/                          utilities: ai-tools (heuristic engine), resume-export, resume-text, utils
```

## Extending this into a real product

If you want to turn this back into a full product with real accounts and persistence, the natural next steps are: add an auth provider, put the resume store behind real API routes backed by a database, and swap the heuristic AI functions in `src/lib/ai-tools.ts` for real LLM calls. None of that exists in this build by design — it's intentionally a clean, dependency-light UI demo.
