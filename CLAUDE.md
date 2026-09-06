# Strong Log

Workout logging app inspired by the StrongLifts app UX (not the 5x5 program specifically).

## Project structure

```
strong-log/
  api/       Express + TypeScript backend
  app/       React Native (Expo) mobile app
```

## Stack

- **Frontend:** React Native + Expo (TypeScript), targets iPhone via Expo Go for dev, EAS Build for App Store
- **Backend:** Node/Express (TypeScript), standalone service
- **Database:** Postgres hosted on Supabase (session pooler connection)
- **ORM:** Drizzle
- **Auth:** Supabase Auth — client logs in via supabase-js, token is sent as Bearer header to the Express API, Express verifies it by calling Supabase's `/auth/v1/user` endpoint
- **Deploy:** Railway or Fly.io (backend, not yet set up)

## v1 scope

- Sign up / log in
- Start a workout
- Add exercises by name, log sets (weight + reps) one at a time
- Finish workout
- View workout history + workout detail

## Planned later (not built yet)

- Rest timer between sets
- Plate calculator
- Program templates (A/B, auto weight progression)
- AI coach / chat features

## DB schema (Drizzle, see api/src/db/schema.ts)

- `users` — mirrors Supabase auth user (id = Supabase user UUID)
- `workouts` — belongs to user, has startedAt / finishedAt
- `exercises` — belongs to workout, has name + orderIndex
- `sets` — belongs to exercise, has weight / reps / completed / orderIndex

## Environment variables

**`api/.env`** (never commit):
```
PORT=3000
DATABASE_URL=postgresql://postgres.xxx:password@aws-region.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

Use the **session pooler** connection string from Supabase (port 5432), not direct or transaction pooler.

**`app/.env`** (never commit):
```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=http://localhost:3000
```

`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are the same values as in `api/.env`.
`EXPO_PUBLIC_API_URL` points to the running Express server (use your machine's LAN IP instead of localhost when testing on a physical iPhone).

## Expo note

Expo SDK 57 is in use. When writing any Expo/React Native code, reference the versioned docs at https://docs.expo.dev/versions/v57.0.0/ — APIs change between versions.

## Getting started

```bash
# 1. Backend
cd api
cp .env.example .env   # fill in real values
npm install
npm run db:generate    # generate SQL migration from schema
npm run db:migrate     # apply tables to Supabase Postgres
npm run dev            # starts on http://localhost:3000

# 2. App
cd app
cp .env.example .env   # fill in real values
npm install
npx expo start         # scan QR with Expo Go on iPhone
```

## Current status

- [x] Expo app scaffolded with React Navigation
- [x] Express API scaffolded with Drizzle schema + auth middleware + workout/exercise/set routes
- [x] Both projects type-check clean
- [x] Supabase project created
- [x] `api/.env` filled in
- [x] `app/.env` filled in
- [x] `npm run db:migrate` — tables created in Supabase
- [x] `npm run dev` (api) — running, /health returns ok
- [x] iPhone connected via Expo Go (tunnel mode with ngrok — new URL each session, update `EXPO_PUBLIC_API_URL` in `app/.env`)
- [x] Sign up / sign in working (Supabase email confirmation disabled for dev)
- [x] Full workout loop verified end-to-end on iPhone (start → exercises → sets → finish → history)
- [x] Data confirmed in Supabase Table Editor (users, workouts, exercises, sets)
- [x] Bottom tab navigator (Home, Programs, History)
- [x] Dark purple theme applied across all screens (shared `src/theme/colors.ts`)
- [x] History tab refreshes on focus with `useFocusEffect`
- [x] Auth middleware passes email to `ensureUser` so users table saves email correctly

## Dev startup sequence (each session)
1. `cd api` → `npm run dev` (port 3000)
2. New terminal → `ngrok http 3000` → copy HTTPS URL → paste into `app/.env` as `EXPO_PUBLIC_API_URL`
3. `cd app` → `npx expo start --tunnel`

---

## Milestone Roadmap

### Milestone 1 — Auth + Core Loop ✅ COMPLETE

### Milestone 2 — Polish the logging UX (current)
Make logging sets feel fast and natural, like StrongLifts.

- [ ] Weight/reps inputs retain last used values per exercise (don't clear between sets)
- [ ] Set counter shows "Set 1 of 5" style indicator
- [ ] Swipe to delete a set
- [ ] Edit/delete an exercise from a workout
- [ ] Confirm before finishing workout if sets are incomplete
- [ ] Error handling: show user-friendly messages when API calls fail
- [ ] Replace `Alert.alert` with inline error messages throughout (web-compatible)

### Milestone 3 — Workout History + Progress
Make past data useful.

- [ ] History screen shows exercise names + set count per workout (not just date)
- [ ] Workout detail shows duration (finishedAt - startedAt)
- [ ] Per-exercise history: see all past sets for a given exercise across workouts
- [ ] Personal records: track and display heaviest weight per exercise

### Milestone 4 — Deploy backend
Make the API accessible from anywhere, not just localhost.

- [ ] Deploy Express API to Railway or Fly.io
- [ ] Update `EXPO_PUBLIC_API_URL` in app to point to deployed URL
- [ ] Set production environment variables on the hosting platform
- [ ] Verify health check + auth flow against deployed API

### Milestone 5 — Rest Timer
A StrongLifts staple — auto-start a countdown between sets.

- [ ] Configurable rest duration (default 90s)
- [ ] Timer auto-starts after logging a set
- [ ] Vibrate + sound when timer ends
- [ ] Timer persists if you navigate away mid-rest

### Milestone 6 — Plate Calculator
Show which plates to load on the bar for a given weight.

- [ ] Input target weight → output plates per side
- [ ] Configurable available plate set
- [ ] Accessible from the set logging row

### Milestone 7 — Program Templates + Auto Progression
The feature that makes this a real training tool, not just a logger.

- [ ] Schema additions: `programs`, `program_workouts`, `program_exercises` tables
- [ ] Built-in StrongLifts A/B template (Squat/Bench/Row + Squat/OHP/Deadlift)
- [ ] Per-exercise working weight tracked across sessions
- [ ] Auto-suggest next session weight: +5lb on completion, hold on fail
- [ ] Deload logic: -10% after 3 consecutive failures on same weight
- [ ] Custom program builder (user-defined exercises, sets, reps)

### Milestone 8 — AI Coach / Chat
The differentiating feature for recruiting + product value.

- [ ] `/api/chat` endpoint on the Express backend (keeps API key server-side)
- [ ] Context-aware: sends user's recent workout history to the LLM
- [ ] Suggestions: form tips, progression advice, deload recommendations
- [ ] Chat UI in the app: floating button → chat sheet
- [ ] Streaming responses (Server-Sent Events from Express → app)

### Milestone 9 — App Store release
Ship it.

- [ ] EAS Build set up (`eas.json`, Expo account)
- [ ] App icons + splash screen finalized
- [ ] App name updated in `app.json` (currently "app")
- [ ] Apple Developer account enrolled
- [ ] TestFlight build for internal testing
- [ ] App Store listing (screenshots, description, keywords)
- [ ] Production Supabase project (separate from dev)
