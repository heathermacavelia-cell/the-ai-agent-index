## The AI Agent Index

[![smithery badge](https://smithery.ai/badge/heather-macavelia/ai-agent-index)](https://smithery.ai/servers/heather-macavelia/ai-agent-index)

**The structured index of AI agents for business automation.**

### Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (Postgres)
- **Deployment target**: Vercel

### Getting started

1. Install dependencies:

```bash
pnpm install # or npm install / yarn
```

2. Create `.env.local` from the example and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (used for sitemap generation)

3. Run the dev server:

```bash
pnpm dev
```

4. Open the app at `http://localhost:3000`.

### Supabase schema

Create the `agents` table and policies as described in your Supabase SQL editor, then the app will read from it for all pages and the `/api/agents` JSON API.

### Routing overview

- `/` – Homepage with search, featured agents, and category cards
- `/:category` – Category listing page (e.g. `/ai-sales-agents`)
- `/:category/:industry` – Category + industry filtered page (e.g. `/ai-sales-agents/real-estate`)
- `/agents/[slug]` – Individual agent detail page
- `/api/agents` – Public JSON API (supports `category`, `industry`, `pricing`, `segment` query params)

### Notes for deployment

- Set the same environment variables in Vercel.
- Optionally set `NEXT_PUBLIC_SITE_URL` to your production URL (e.g. `https://ai-agent-index.vercel.app`) for correct sitemap URLs.

