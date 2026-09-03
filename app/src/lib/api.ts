import { supabase } from "./supabase";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

async function authedFetch(path: string, options: RequestInit = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token ?? ""}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status}: ${body}`);
  }
  return res.json();
}

export interface SetLog {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  completed: boolean;
  orderIndex: number;
}

export interface ExerciseLog {
  id: string;
  workoutId: string;
  name: string;
  orderIndex: number;
  sets: SetLog[];
}

export interface Workout {
  id: string;
  userId: string;
  startedAt: string;
  finishedAt: string | null;
}

export interface WorkoutDetail extends Workout {
  exercises: ExerciseLog[];
}

export const api = {
  startWorkout: (): Promise<Workout> => authedFetch("/workouts", { method: "POST" }),
  listWorkouts: (): Promise<Workout[]> => authedFetch("/workouts"),
  getWorkout: (id: string): Promise<WorkoutDetail> => authedFetch(`/workouts/${id}`),
  finishWorkout: (id: string): Promise<Workout> =>
    authedFetch(`/workouts/${id}/finish`, { method: "PATCH" }),
  addExercise: (workoutId: string, name: string, orderIndex: number): Promise<ExerciseLog> =>
    authedFetch(`/workouts/${workoutId}/exercises`, {
      method: "POST",
      body: JSON.stringify({ name, orderIndex }),
    }),
  addSet: (
    exerciseId: string,
    weight: number,
    reps: number,
    orderIndex: number
  ): Promise<SetLog> =>
    authedFetch(`/workouts/exercises/${exerciseId}/sets`, {
      method: "POST",
      body: JSON.stringify({ weight, reps, orderIndex }),
    }),
};
