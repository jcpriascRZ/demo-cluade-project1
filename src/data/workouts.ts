import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export async function createWorkout(userId: string, name: string, performedAt: Date) {
  return db.insert(workouts).values({ userId, name, performedAt }).returning();
}

export async function getWorkoutById(userId: string, workoutId: number) {
  const results = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
  return results[0] ?? null;
}

export async function updateWorkout(
  userId: string,
  workoutId: number,
  name: string,
  performedAt: Date
) {
  return db
    .update(workouts)
    .set({ name, performedAt })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}

export async function getWorkoutsForUser(userId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const nextDay = new Date(date);
  nextDay.setHours(0, 0, 0, 0);
  nextDay.setDate(nextDay.getDate() + 1);

  return db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.performedAt, startOfDay),
        lt(workouts.performedAt, nextDay)
      )
    );
}
