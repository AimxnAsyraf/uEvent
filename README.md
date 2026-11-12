# uEvent

Event management for university clubs and societies, run with the Student Representative Council (SRC). Clubs submit event proposals, the SRC reviews them, and approved events appear on a public page.

## Documents

- [Design spec](docs/design-spec.md): what uEvent does.
- [Implementation plan](docs/implementation-plan.md): the 15 build tasks.
- [Team workflow](docs/team-workflow.md): how the team works and hands off tasks.

## Requirements

- Node.js 22
- Docker (for the local Supabase stack)

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start local Supabase (database, auth, storage, mail inbox):

   ```bash
   npm run db:start
   ```

3. Copy the environment file, then fill in `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` from the output of `npx supabase status`:

   ```bash
   cp .env.example .env.local
   ```

4. Run the app at http://localhost:3000:

   ```bash
   npm run dev
   ```

Local sign-up confirmation emails arrive in the Supabase mail inbox at http://127.0.0.1:54324.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the app in development mode |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (no database) |
| `npm run test:int` | Integration tests against local Supabase |
| `npm run test:e2e` | Browser tests with Playwright |
| `npm run db:start` | Start local Supabase |
| `npm run db:reset` | Recreate the local database from migrations and seed |
| `npm run db:types` | Regenerate `src/lib/database.types.ts` |
