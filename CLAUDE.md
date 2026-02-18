# LivePoll - Project Conventions

## Tech Stack

- **Framework**: TanStack Start (full-stack React with SSR)
- **Router**: TanStack Router (file-based routing in `src/routes/`)
- **Data Fetching**: TanStack React Query (with `refetchInterval` for live updates)
- **Database**: PostgreSQL via Prisma ORM (`@prisma/adapter-pg`)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Build Tool**: Vite 7
- **Language**: TypeScript (strict mode)
- **Linting/Formatting**: Biome
- **Package Manager**: Bun

## Commands

```bash
bun run dev          # Start dev server on port 3000
bun run build        # Build for production
bun run test         # Run tests (vitest)
bun run check        # Biome lint + format check
bun run db:migrate   # Run Prisma migrations
bun run db:generate  # Generate Prisma client
bun run db:seed      # Seed sample data
```

## Code Style

- **Indentation**: Tabs
- **Quotes**: Double quotes
- **Imports**: Use `import type` for type-only imports (`verbatimModuleSyntax`)
- **Components**: Function components, PascalCase filenames
- **Server functions**: Defined in `src/server/` using `createServerFn`

## Architecture

- **Server functions** (`src/server/`): Backend logic via TanStack Start `createServerFn`
- **Routes** (`src/routes/`): File-based routing, each route file exports a `Route` constant
- **Components** (`src/components/`): Shared React components
- **Database** (`src/db.ts`): Prisma client singleton, schema in `prisma/schema.prisma`
- **Path alias**: `@/*` maps to `./src/*`

## After Making Changes

1. Run `bun run check` to verify linting and formatting
2. Run `bun run test` if tests exist for the modified area
3. If schema changed: `bun run db:generate` then `bun run db:migrate`
