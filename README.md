# ClickRush — 60-Second Click Challenge

A full-stack click-counting game: sign up (or jump in as a guest), click as fast as you
can before the timer runs out, and see where you land on the global/daily/weekly
leaderboard — live, without refreshing.

Built as a staged, incremental project — each feature layered on top of a working,
verified previous one rather than built all at once.

## Features

- Email/password signup & login, plus instant "Continue as guest" accounts
- Three game modes: Classic (60s), Blitz (30s), Endurance (120s)
- **Server-authoritative scoring** — the browser's timer is cosmetic only; the server
  independently times every game and flags implausible submissions (see
  [Anti-cheat design](#anti-cheat-design) below)
- Global, daily, and weekly leaderboards, ranked per player (best score, not every game)
- Real-time leaderboard updates over Socket.IO — a score submitted in one tab updates an
  already-open leaderboard in another, with no manual refresh
- Personal profile: stats per mode (best score, rank, games played) and full game history
- Personal-best celebration on the results screen

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite + TypeScript, Tailwind CSS v4, Motion (Framer Motion) |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Real-time | Socket.IO |
| Auth | JWT in an httpOnly cookie (not localStorage — inaccessible to page JS) |
| Validation | Zod, on every request body/query |

## Local setup

### Prerequisites

- Node.js 20+
- Docker (for MongoDB — or point `MONGODB_URI` at your own instance/Atlas cluster instead)

### 1. Database

```bash
docker compose up -d
```

Starts MongoDB 7 on `localhost:27017` with a persisted volume (`docker-compose.yml` at
the repo root).

### 2. Backend

```bash
cd server
cp .env.example .env      # fill in MONGODB_URI / JWT_SECRET if not using the defaults
npm install
npm run dev                # http://localhost:4000
```

Optional: populate demo data (8 demo users, ~5 games each spread over 10 days) so the
leaderboard/profile aren't empty:

```bash
npm run seed
```

**Warning:** `npm run seed` deletes all existing users and game sessions first, for a
clean, predictable dataset. Don't run it against data you want to keep.

### 3. Frontend

```bash
cd client
cp .env.example .env      # VITE_API_URL, defaults to http://localhost:4000
npm install
npm run dev                # http://localhost:5173
```

### 4. Try it

Open `http://localhost:5173`, sign up (or "Continue as guest"), play a game, and check
the leaderboard.

### Other useful commands

```bash
cd server && npm test      # vitest
cd server && npm run build # tsc -> dist/
cd client && npm run build # production client build
```

## Project structure

```
server/
  src/
    config/       db connection, game mode durations (single source of truth)
    models/       Mongoose schemas — User, GameSession
    validation/   Zod request schemas
    services/     business logic (auth, scoring/anti-cheat, leaderboard queries, user stats)
    controllers/  thin HTTP layer — parse, call a service, shape the response
    routes/       wiring only, mounted in index.ts
    middleware/   requireAuth, centralized error handler, rate limiting
    sockets/      Socket.IO setup + the leaderboard room handlers
    scripts/      seed.ts (demo data)
    errors.ts     one class per case that needs a specific HTTP status

client/
  src/
    api/          typed wrappers around each backend endpoint
    context/      AuthContext, SocketContext
    hooks/        useLeaderboard, useCountUp
    components/   grouped by feature: layout/, game/, leaderboard/, profile/
    pages/        one per route
    config/       client-side mirror of game mode durations (display only)
```

## Database schema

### `User`

| Field | Type | Notes |
|---|---|---|
| `username` | String | unique, 3–20 chars, shown publicly on leaderboards |
| `email` | String | unique, lowercased |
| `passwordHash` | String | bcrypt, never the plaintext password |
| `createdAt` / `updatedAt` | Date | via Mongoose `timestamps` |

### `GameSession`

One document per played game — created when a game starts, updated once when it's
submitted. Doubles as both the anti-cheat record and the profile history/leaderboard
source data.

| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId (ref `User`) | who played |
| `mode` | String | `classic60` \| `blitz30` \| `endurance120` |
| `clicks` / `score` | Number | `0` until submitted; `score` currently equals `clicks` |
| `startedAt` | Date | stamped by the **server**, not the client, when `/game/start` is called |
| `submittedAt` | Date | stamped by the server on `/game/submit` |
| `status` | String | `active` → `submitted` |
| `isSuspicious` | Boolean | set by the anti-cheat check on submit (see below) — the game is still saved, just flagged |

**Indexes:**
- `{ userId: 1, submittedAt: -1 }` — a user's own history, newest first
- `{ mode: 1, submittedAt: 1, score: -1 }` — covers the leaderboard aggregation for all
  three periods: global matches on `mode` alone (an index prefix), daily/weekly add the
  `submittedAt` range on top of that same prefix

## API reference

All routes are unprefixed (`/auth`, not `/api/auth`). Endpoints marked **[auth]** require
the session cookie set by signup/login/guest.

### Health

| Method | Path | Response |
|---|---|---|
| GET | `/health` | `{ status: "ok" }` |

### Auth

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/auth/signup` | `{ username, email, password }` | `201` `{ id, username, email }`, sets cookie |
| POST | `/auth/login` | `{ email, password }` | `200` `{ id, username, email }`, sets cookie |
| POST | `/auth/logout` | — | `204`, clears cookie |
| POST | `/auth/guest` | — | `201` `{ id, username, email }` for a fresh throwaway account, sets cookie |
| GET | `/auth/me` **[auth]** | — | `200` `{ id, username, email }` |

`/auth/signup`, `/auth/login`, and `/auth/guest` are rate-limited (20 requests / 15 min /
IP) — the three routes that could otherwise be brute-forced or spammed.

### Game

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/game/start` **[auth]** | `{ mode }` | `201` `{ sessionId, mode, durationSeconds, startedAt }` |
| POST | `/game/submit` **[auth]** | `{ sessionId, clicks }` | `200` `{ score, clicks, clicksPerSecond, isSuspicious }` |

### Leaderboard

| Method | Path | Query params | Response |
|---|---|---|---|
| GET | `/leaderboard/:period` | `period` = `global` \| `daily` \| `weekly` (path); `mode` (default `classic60`), `page` (default 1), `limit` (default 20, max 100) | `200` `{ period, mode, entries: [{ rank, userId, username, bestScore, achievedAt }], page, limit }` |

Public — no auth required to view a leaderboard, only to submit a score onto it.

### User

| Method | Path | Query params | Response |
|---|---|---|---|
| GET | `/user/history` **[auth]** | `mode` (optional filter), `page`, `limit` | `200` `{ items: [{ id, mode, clicks, score, submittedAt, isSuspicious }], page, limit, total }` |
| GET | `/user/stats` **[auth]** | — | `200` `{ byMode: [{ mode, bestScore, gamesPlayed, rank }], totalGamesPlayed }` |

`byMode` only includes modes the user has actually played. `rank` is 1 + the number of
*other* distinct players with a higher best score in that mode.

### Socket.IO events

| Direction | Event | Payload | Purpose |
|---|---|---|---|
| Client → Server | `leaderboard:join` | `{ mode }` | Subscribe to live updates for one mode |
| Client → Server | `leaderboard:leave` | `{ mode }` | Unsubscribe |
| Server → Client | `leaderboard:update` | `{ mode }` | A score was submitted in this mode — clients react by refetching, not by reading fields off the event |

## Anti-cheat design

The click counter itself is pure client-side state — every click is just a local React
state update, no network call. What makes the final score trustworthy isn't policing
individual clicks; it's that the server, not the browser, decides how much time actually
passed:

1. `POST /game/start` has the server stamp its own `startedAt` on a new `GameSession`.
   The client gets back a `sessionId` and a duration for display purposes only.
2. `POST /game/submit` sends the final click count. The server computes
   `elapsed = now - startedAt` itself — a value the client never controlled.
3. **Too early → rejected (400).** Finishing a 60-second game in 10 real seconds is not
   suspicious, it's impossible under honest play.
4. **Too late, or an implausible click rate (>20 clicks/sec) → accepted, but flagged**
   (`isSuspicious: true`). These *could* be cheating, but could also be a backgrounded tab
   or a genuinely fast clicker — rejecting outright risks losing a legitimate score to a
   false positive, so the data is kept and marked for review instead.
5. A session can only be submitted once (`409` on replay), and is scoped to the user who
   started it (`404`, not `403`, if someone else's session ID is submitted — so the
   endpoint can't be used to probe which session IDs exist).

## Other deliberate design decisions

- **Leaderboard boundaries are UTC**, not per-user timezone. "Today" and "this week" mean
  the same instant for every player; the tradeoff is a player near a UTC day boundary
  might see a game land on what feels like the "wrong" day locally.
- **Real-time updates reconcile via debounced refetch, not insert-and-resort.** On a
  `leaderboard:update` event, the client waits 500ms (in case several updates arrive in a
  burst) and then just re-fetches the current view. Simpler and avoids a class of
  pagination/tie-breaking bugs that come with patching a list in place.
- **No denormalized "best score" collection.** The leaderboard is a live aggregation over
  `GameSession` on every request. At this scale that's simpler and fast enough (it's
  index-covered); a materialized best-score-per-user collection or Redis sorted set would
  be the next step if this needed to scale further.
- **JWT lives in an httpOnly cookie**, not localStorage, so it's inaccessible to any
  JavaScript running on the page — a mitigation against XSS-based token theft.

## Known limitations

- Mobile/narrow-viewport rendering uses standard responsive Tailwind utilities
  (`flex-wrap`, relative `max-w-*` constraints, no fixed pixel widths) but hasn't been
  manually verified on an actual small screen.
- No password reset / email verification flow.
- Score currently equals raw click count; no scoring multipliers or power-ups.

## Deployment

- **Frontend:** Vercel — https://click-rush-nine.vercel.app
- **Backend:** Render — https://click-rush-chf3.onrender.com
- **Database:** MongoDB Atlas

**Live app:** https://click-rush-nine.vercel.app

Note: the backend is on Render's free tier, which spins down after ~15 minutes of
inactivity. The first request after it's been idle can take 30–60 seconds while it wakes
back up — not a bug, just the free tier.

## License

ISC
