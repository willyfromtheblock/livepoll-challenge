# Suggested Commands

## Development
- `bun run dev` - Start dev server on port 3000
- `bun run build` - Build for production (includes db:generate)
- `bun run preview` - Preview production build

## Linting & Formatting
- `bun run lint` - Run Biome linter
- `bun run format` - Run Biome formatter
- `bun run check` - Run Biome check (lint + format)

## Database
- `bun run db:generate` - Generate Prisma client (required after clone)
- `bun run db:push` - Push schema changes to DB (no migration)
- `bun run db:migrate` - Create and run migrations
- `bun run db:studio` - Open Prisma Studio (DB GUI)

Bun loads `.env` natively — no dotenv prefix needed.

## Package Manager
- Uses **bun** (not npm/yarn)
- `bun install` - Install dependencies
- `bun add <pkg>` - Add a dependency
