import { pgTable, uuid, text, timestamp, integer, real, boolean } from "drizzle-orm/pg-core";

// One row per Supabase-authenticated user. id matches the Supabase auth user id.
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const workouts = pgTable("workouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  finishedAt: timestamp("finished_at"),
});

export const exercises = pgTable("exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  workoutId: uuid("workout_id").notNull().references(() => workouts.id),
  name: text("name").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

export const sets = pgTable("sets", {
  id: uuid("id").primaryKey().defaultRandom(),
  exerciseId: uuid("exercise_id").notNull().references(() => exercises.id),
  weight: real("weight").notNull(),
  reps: integer("reps").notNull(),
  completed: boolean("completed").notNull().default(true),
  orderIndex: integer("order_index").notNull().default(0),
});
