# LivePoll - Project Overview

## Purpose
A live voting/poll application where users can create polls, share them via unique links, and see results update in real time (2-second polling via React Query).

## Tech Stack
- **Framework**: TanStack Start (full-stack React with SSR)
- **Router**: TanStack Router (file-based routing)
- **Data Fetching**: TanStack React Query
- **Database**: PostgreSQL via Prisma 7 ORM (with `@prisma/adapter-pg`)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Env Validation**: envalid
- **Build Tool**: Vite 7
- **Language**: TypeScript (strict mode)
- **Linting/Formatting**: Biome
- **Icons**: Lucide React
- **Package Manager**: Bun

## Project Structure
```
src/
  components/       - React components (Header.tsx)
  routes/           - File-based routes
    __root.tsx      - Root layout
    index.tsx       - Create poll page
    poll.$pollId.tsx          - Poll layout
    poll.$pollId.index.tsx    - Vote page
    poll.$pollId.results.tsx  - Results page
  server/           - Server functions (API layer)
    polls.ts        - Poll CRUD operations
  generated/        - Prisma generated client (gitignored)
  env.ts            - Validated environment variables (envalid)
  db.ts             - Prisma client singleton
  router.tsx        - Router configuration
  styles.css        - Global styles (Tailwind)
prisma/
  schema.prisma     - Database schema (Poll, PollOption, Vote)
public/             - Static assets (logo, favicon, manifest)
```

## Key Patterns
- File-based routing in `src/routes/`
- Root route uses `createRootRouteWithContext` with QueryClient context
- Server functions via `createServerFn` from `@tanstack/react-start`
- Prisma client is a global singleton (cached in dev via `globalThis.__prisma`)
- Path alias: `#/*` maps to `./src/*`
- Vote deduplication via browser UUID in localStorage + DB unique constraint
- IDs use `cuid()` (sortable, shorter than UUID)
- `.env` is gitignored; `.env.example` is committed as template
- `src/generated/` and `src/routeTree.gen.ts` are gitignored
