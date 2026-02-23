import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export async function createWorkout(userId: string, name: string, performedAt: Date) {
  return db.insert(workouts).values({ userId, name, performedAt }).returning();
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
