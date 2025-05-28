# Active Context

_Last updated: {{DATE}}

## Current Work Focus
We are at **Phase 1 – Project Setup and Basic Infrastructure** according to `roadmap.md`.

Immediate tasks:
1. Scaffold a new Next.js 14 project with TypeScript support.
2. Configure ESLint, Prettier, and commit hooks (lint-staged + husky).
3. Initialise Git repository and push to remote.
4. Set up Tailwind CSS and Shadcn/ui.
5. Add environment variable placeholder files (`.env.example`).

## Recent Changes
- Memory Bank initialised with core files reflecting the roadmap.

## Next Steps
- Complete Phase 1 tasks listed above.
- Commit baseline project to repository.
- Update `progress.md` upon completion of Phase 1 subtasks.
- Begin Phase 2 planning (AI integration interfaces) once setup is stable.

## Active Decisions & Considerations
- Will start with Prisma + SQLite locally, migrate to PostgreSQL in staging/production.
- Will use `pnpm` as the package manager for workspace speed and lockfile size.
- Aim for end-to-end skeleton app running on Vercel preview by end of Phase 1. 