# Strong Log

A workout logging app, styled after StrongLifts' logging flow: start a workout, log sets one at a time, view history.

## Structure

- `app/` — React Native (Expo) mobile app
- `api/` — Express + TypeScript backend, Postgres via Drizzle ORM, auth via Supabase

## Getting started

### 1. Set up Supabase

Create a project at [supabase.com](https://supabase.com). You'll need:
- The project's Postgres connection string (Project Settings → Database)
- The project URL and anon key (Project Settings → API)

### 2. Backend (`api/`)

```
cd api
cp .env.example .env   # fill in DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY
npm install
npm run db:generate    # generate SQL migration from schema
npm run db:migrate     # apply it to your Supabase Postgres
npm run dev            # starts on http://localhost:3000
```

### 3. Mobile app (`app/`)

```
cd app
cp .env.example .env   # fill in EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, EXPO_PUBLIC_API_URL
npm install
npx expo start
```

Scan the QR code with the Expo Go app on your iPhone to run it live.

## v1 scope

- Sign up / log in
- Start a workout, add exercises, log sets (weight + reps)
- Finish workout
- View workout history

## Planned later

- Rest timer, plate calculator
- Program templates (e.g. 5x5 A/B) with auto weight progression
- Progress charts
- AI coach / chat features
