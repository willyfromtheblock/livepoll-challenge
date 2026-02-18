# LivePoll

A live voting/poll application where users can create polls, share them via unique links, and see results update in real time.

## Features

- **Create polls** with a question and 2-5 answer options
- **Share polls** via unique links
- **Vote** on polls (one vote per browser)
- **Live results** with auto-updating charts (2-second polling via React Query)
- **Visual results** displayed with Recharts bar charts and progress bars

## Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| Framework      | TanStack Start (React, SSR)                   |
| Router         | TanStack Router (file-based)                  |
| Data Fetching  | TanStack React Query                          |
| Database       | PostgreSQL + Prisma ORM                       |
| Styling        | Tailwind CSS v4                               |
| Charts         | Recharts                                      |
| Build Tool     | Vite 7                                        |
| Language       | TypeScript (strict)                           |
| Lint/Format    | Biome                                         |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.0+
- PostgreSQL database

### Setup

1. **Clone and install dependencies:**

```bash
git clone <repo-url>
cd livepoll-challenge
bun install
```

2. **Configure the database:**

Copy the example environment file and set your PostgreSQL connection string:

```bash
# Edit .env.local with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/livepoll"
```

3. **Run database migrations:**

```bash
bun run db:migrate
```

4. **Optionally seed sample data:**

```bash
bun run db:seed
```

5. **Start the development server:**

```bash
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  server/          Server functions (API layer)
    polls.ts       Poll CRUD operations
  routes/          File-based routes
    __root.tsx     Root layout
    index.tsx      Create poll page
    poll.$pollId.tsx          Poll layout
    poll.$pollId.index.tsx    Vote page
    poll.$pollId.results.tsx  Results page
  components/      Shared React components
    Header.tsx     App header/navigation
  db.ts            Prisma client singleton
prisma/
  schema.prisma    Database schema
  seed.ts          Sample data seeder
```

## Architecture Decisions

### TanStack Start + Server Functions

Instead of a separate backend, the app uses TanStack Start's `createServerFn` for server-side logic. This provides type-safe RPC between client and server without manually defining API routes, while still supporting SSR for fast initial loads.

### React Query for Live Updates

The results page uses React Query's `refetchInterval` (2 seconds) to poll for updated vote counts. This is simpler than WebSockets for this scale and gracefully handles reconnection. The query key structure (`["poll", pollId, "results"]`) enables targeted cache invalidation.

### Vote Deduplication

Votes are deduplicated using a browser-generated UUID stored in `localStorage` (the "voter token"). A database-level unique constraint on `(pollId, voterToken)` serves as the authoritative guard against double voting. This avoids requiring user authentication while still preventing casual duplicate votes.

### Data Model

```
Poll 1──* PollOption
Poll 1──* Vote
PollOption 1──* Vote
Vote has unique constraint on (pollId, voterToken)
```

## Available Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `bun run dev`        | Start dev server (port 3000)   |
| `bun run build`      | Production build               |
| `bun run test`       | Run tests                      |
| `bun run check`      | Lint + format check (Biome)    |
| `bun run db:migrate` | Run Prisma migrations          |
| `bun run db:generate`| Generate Prisma client         |
| `bun run db:seed`    | Seed sample data               |
| `bun run db:studio`  | Open Prisma Studio             |

## Trade-offs & Future Improvements

**What was prioritized:**
- Clean, working MVP with all core features
- Type-safe server/client communication
- Live-updating results
- Input validation (client + server)
- Duplicate vote prevention

**What could be added with more time:**
- WebSocket/SSE for true real-time updates (instead of polling)
- User authentication for managing created polls
- Poll closing/expiration
- Comprehensive test suite
- Mobile-responsive design refinements
- Rate limiting on vote submissions
- Analytics (vote trends over time)
