# Suggested Commands

## Development
- `bun run dev` - Start dev server on port 3000
- `bun run build` - Build for production
- `bun run preview` - Preview production build

## Testing
- `bun run test` - Run tests (vitest run)

## Linting & Formatting
- `bun run lint` - Run Biome linter
- `bun run format` - Run Biome formatter
- `bun run check` - Run Biome check (lint + format)

## Database
- `bun run db:generate` - Generate Prisma client
- `bun run db:push` - Push schema changes to DB (no migration)
- `bun run db:migrate` - Create and run migrations
- `bun run db:studio` - Open Prisma Studio (DB GUI)
- `bun run db:seed` - Seed the database

All DB commands use `dotenv -e .env.local` to load environment variables.

## Package Manager
- Uses **bun** (not npm/yarn)
- `bun install` - Install dependencies
- `bun add <pkg>` - Add a dependency
