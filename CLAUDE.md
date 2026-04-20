# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start with hot reload (tsx watch)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled server

# Database
npm run db:migrate   # Apply Prisma migrations
npm run db:seed      # Seed 73 Catholic Bible books
npm run db:studio    # Open Prisma Studio GUI

# Code quality
npm run lint         # ESLint
npm run format       # Prettier (width: 100, semi: true, singleQuote: true)
```

## Initial Setup

```bash
cp .env.example .env    # Configure DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID, APPLE_CLIENT_ID
docker compose up -d    # Start PostgreSQL 16
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev             # API on http://localhost:3000
```

## Architecture

Feature modules in `src/modules/` (auth, users, books, progress) each own their routes and service logic. Shared infrastructure lives in:

- `src/config/env.ts` — Zod-validated environment variables (fails fast on startup)
- `src/lib/errors.ts` — `AppError`, `NotFoundError`, `UnauthorizedError`, `BadRequestError` (extend for new error types)
- `src/lib/jwt.ts` — Custom JWT sign/verify
- `src/middlewares/auth.middleware.ts` — `requireAuth`: extracts `userId` from Bearer token, attaches to `res.locals`
- `src/middlewares/validate.middleware.ts` — Wraps Zod schemas to validate `body`/`params`/`query`
- `src/middlewares/error.middleware.ts` — Catches `ZodError` (400), `AppError` (custom status), generic errors (500)

## Auth Flow

OAuth2 (Google/Apple) → verify external ID token → upsert user in DB → issue custom 30-day JWT. Protected routes use `requireAuth` middleware which attaches `userId` to `res.locals`.

## Database

Prisma + PostgreSQL. Schema at `prisma/schema.prisma`. Key constraint: `ChapterRead` has a unique index on `(userId, bookId, chapter)` to prevent duplicate reads. `Follow` uses a composite PK `(followerId, followingId)`.

The 73 Catholic Bible books (Old & New Testament) are immutable seed data — never modify them via API, only via seed script.

## API Endpoints

| Method | Route | Auth |
|--------|-------|------|
| GET | `/health` | — |
| POST | `/auth/google` | — |
| POST | `/auth/apple` | — |
| GET/PATCH | `/me` | JWT |
| GET | `/books` | — |
| GET | `/books/:slug` | JWT |
| POST/DELETE | `/progress/:bookId/:chapter` | JWT |
| GET | `/progress/summary` | JWT |