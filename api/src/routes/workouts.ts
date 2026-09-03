import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/client.js";
import { workouts, exercises, sets, users } from "../db/schema.js";
import type { AuthedRequest } from "../middleware/auth.js";

export const workoutsRouter = Router();

// Ensures a users row exists for the authenticated Supabase user (first request creates it).
async function ensureUser(userId: string, email: string | undefined) {
  await db.insert(users).values({ id: userId, email: email ?? "" }).onConflictDoNothing();
}

workoutsRouter.post("/", async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  await ensureUser(userId, undefined);

  const [workout] = await db.insert(workouts).values({ userId }).returning();
  res.status(201).json(workout);
});

workoutsRouter.get("/", async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const rows = await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .orderBy(desc(workouts.startedAt));
  res.json(rows);
});

workoutsRouter.get("/:id", async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const workoutId = String(req.params.id);
  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));

  if (!workout) return res.status(404).json({ error: "Workout not found" });

  const exerciseRows = await db
    .select()
    .from(exercises)
    .where(eq(exercises.workoutId, workout.id))
    .orderBy(exercises.orderIndex);

  const exerciseIds = exerciseRows.map((e) => e.id);

  // Fetch all sets for all exercises in this workout in one pass.
  const allSets = exerciseIds.length
    ? await Promise.all(exerciseIds.map((id) => db.select().from(sets).where(eq(sets.exerciseId, id))))
    : [];

  const exercisesWithSets = exerciseRows.map((ex, i) => ({
    ...ex,
    sets: (allSets[i] ?? []).sort((a, b) => a.orderIndex - b.orderIndex),
  }));

  res.json({ ...workout, exercises: exercisesWithSets });
});

workoutsRouter.patch("/:id/finish", async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const [workout] = await db
    .update(workouts)
    .set({ finishedAt: new Date() })
    .where(and(eq(workouts.id, String(req.params.id)), eq(workouts.userId, userId)))
    .returning();

  if (!workout) return res.status(404).json({ error: "Workout not found" });
  res.json(workout);
});

workoutsRouter.post("/:id/exercises", async (req: AuthedRequest, res) => {
  const { name, orderIndex } = req.body as { name: string; orderIndex?: number };
  if (!name) return res.status(400).json({ error: "name is required" });

  const [exercise] = await db
    .insert(exercises)
    .values({ workoutId: String(req.params.id), name, orderIndex: orderIndex ?? 0 })
    .returning();
  res.status(201).json(exercise);
});

workoutsRouter.post("/exercises/:exerciseId/sets", async (req: AuthedRequest, res) => {
  const { weight, reps, completed, orderIndex } = req.body as {
    weight: number;
    reps: number;
    completed?: boolean;
    orderIndex?: number;
  };
  if (weight == null || reps == null) {
    return res.status(400).json({ error: "weight and reps are required" });
  }

  const [set] = await db
    .insert(sets)
    .values({
      exerciseId: String(req.params.exerciseId),
      weight,
      reps,
      completed: completed ?? true,
      orderIndex: orderIndex ?? 0,
    })
    .returning();
  res.status(201).json(set);
});
