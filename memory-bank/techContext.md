# Technical Context

## Primary Technologies
- **Next.js 14+ (TypeScript)** – Full-stack React framework providing SSR/SSG, API routes, and edge runtime.
- **Tailwind CSS** – Utility-first styling with JIT compilation.
- **Shadcn/ui** – Unstyled component library layered on top of Tailwind for consistent UI primitives.
- **React Context API / Zustand** – Client-side state management.
- **Prisma ORM** – Type-safe DB layer targeting **PostgreSQL**.
- **NextAuth.js** – Auth with OAuth & email magic links.
- **OpenAI & Anthropic APIs** – LLM providers for core AI capability.
- **Jest + React Testing Library** – Unit & integration testing.
- **Vercel** – Hosting, preview deployments, and analytics.

## Development Setup
1. Node.js 20 LTS recommended.
2. Install dependencies via `pnpm install`.
3. Environment variables stored in `.env.local` (OpenAI_KEY, DATABASE_URL, etc.).
4. `prisma migrate dev` for local DB migrations.
5. `pnpm dev` launches Next.js on localhost:3000.

## Constraints & Considerations
- Postgres is the single source of truth; avoid long-running transactions.
- Vector embeddings may exceed 1MB per user; plan partitioning or external service if data grows.
- API keys must never reach the client – use server routes/edge functions as proxy.
- Budget token usage with model selection (gpt-3.5-turbo vs gpt-4o).
- Prefer edge-compatible code where possible to utilise Vercel Edge Functions.

## Dependencies Summary (semver targets)
```
next@^14
react@^18
typescript@^5
prisma@^5
@prisma/client@^5
next-auth@^4
tailwindcss@^3
zustand@^4
openai@^4
anthropic@^1
jest@^29
@testing-library/react@^14
```

## Recommended VSCode Extensions
- Prisma
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Jest Runner 