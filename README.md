# Strong Log

A workout logging app for iPhone, inspired by the StrongLifts UX. Log exercises, track sets, view history and potential AI integration.

Built with React Native (Expo), Node/Express, Postgres (Supabase), and Drizzle ORM — TypeScript end-to-end.

---

## Stack

| Layer | Technology |
|---|---|
| Mobile app | React Native + Expo (TypeScript) |
| Backend API | Node.js + Express (TypeScript) |
| Database | PostgreSQL via Supabase |
| ORM | Drizzle |
| Auth | Supabase Auth |
| Deploy | Railway / Fly.io (coming) |

---

## Project Structure

```
strong-log/
├── api/                  Express backend
│   ├── src/
│   │   ├── db/           Drizzle schema + client
│   │   ├── middleware/   Auth (Supabase JWT verification)
│   │   └── routes/       Workout, exercise, set endpoints
│   └── drizzle/          SQL migrations
└── app/                  Expo mobile app
    └── src/
        ├── context/      Auth context (session management)
        ├── lib/          Supabase client + API client
        ├── navigation/   React Navigation stack
        └── screens/      SignIn, Home, ActiveWorkout, History
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- [Expo Go](https://expo.dev/go) on your iPhone

### 1. Clone the repo

```bash
git clone https://github.com/mjbalwi/strong-log.git
cd strong-log
```

### 2. Backend setup

```bash
cd api
cp .env.example .env
```

Fill in `api/.env`:
```
PORT=3000
DATABASE_URL=          # Supabase session pooler connection string
SUPABASE_URL=          # https://your-project.supabase.co
SUPABASE_ANON_KEY=     # your anon/public key
```

Then:
```bash
npm install
npm run db:generate    # generate SQL migration from schema
npm run db:migrate     # apply tables to Supabase Postgres
npm run dev            # API starts at http://localhost:3000
```

Verify it's running: `http://localhost:3000/health` should return `{"ok":true}`.

### 3. App setup

```bash
cd app
cp .env.example .env
```

Fill in `app/.env`:
```
EXPO_PUBLIC_SUPABASE_URL=       # same as SUPABASE_URL above
EXPO_PUBLIC_SUPABASE_ANON_KEY=  # same as SUPABASE_ANON_KEY above
EXPO_PUBLIC_API_URL=            # http://localhost:3000 (or your LAN IP for iPhone)
```

Then:
```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your iPhone, or press `w` to open in browser.

---

## API Endpoints

All endpoints except `/health` require `Authorization: Bearer <supabase_token>`.

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/workouts` | Start a new workout |
| GET | `/workouts` | List all workouts for the user |
| GET | `/workouts/:id` | Get workout detail with exercises + sets |
| PATCH | `/workouts/:id/finish` | Mark workout as finished |
| POST | `/workouts/:id/exercises` | Add an exercise to a workout |
| POST | `/workouts/exercises/:id/sets` | Log a set for an exercise |

---

## Roadmap

- [x] Auth (sign up / sign in via Supabase)
- [x] Core logging loop (workout → exercises → sets → history)
- [ ] Polish logging UX (retain values, swipe to delete, set counters)
- [ ] Progress tracking (PRs, per-exercise history)
- [ ] Backend deployment (Railway / Fly.io)
- [ ] Rest timer
- [ ] Plate calculator
- [ ] Program templates + auto weight progression
- [ ] AI coach / chat
- [ ] App Store release
