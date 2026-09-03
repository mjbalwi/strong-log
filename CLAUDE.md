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
- [ ] `npm run db:migrate` — failing silently, likely a DATABASE_URL connection issue to debug
- [ ] `npm run dev` (api)
- [ ] `npx expo start` (app)
