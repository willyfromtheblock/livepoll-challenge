# LivePoll Challenge - Project Overview

## Purpose
A TanStack Start (full-stack React) application scaffolded from a starter template. Currently contains a landing page with demo content. The name suggests it will be a live polling application.

## Tech Stack
- **Framework**: TanStack Start (full-stack React framework with SSR)
- **Router**: TanStack Router (file-based routing)
- **Data Fetching**: TanStack React Query
- **Database**: PostgreSQL via Prisma ORM (with `@prisma/adapter-pg`)
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 7
- **Language**: TypeScript (strict mode)
- **Linting/Formatting**: Biome
- **Testing**: Vitest + Testing Library
- **Icons**: Lucide React
- **Runtime**: Node.js (ESM modules)

## Project Structure
```
src/
  components/       - React components (Header.tsx)
  routes/           - File-based routes (__root.tsx, index.tsx)
  integrations/     - Third-party integrations (tanstack-query/)
  generated/        - Prisma generated client (auto-generated)
  db.ts             - Prisma client singleton
  router.tsx        - Router configuration
  styles.css        - Global styles (Tailwind)
prisma/
  schema.prisma     - Database schema (currently has Todo model)
  seed.ts           - Database seed script
public/             - Static assets
```

## Key Patterns
- File-based routing in `src/routes/`
- Root route uses `createRootRouteWithContext` with QueryClient context
- Server functions via `createServerFn` from `@tanstack/react-start`
- Prisma client is a global singleton (cached in dev via `globalThis.__prisma`)
- Path aliases: `@/*` maps to `./src/*`, `#/*` maps to `./src/*`
