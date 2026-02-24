"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const UpdateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
});

export async function updateWorkoutAction(workoutId: number, name: string, date: Date) {
  const { workoutId: validatedId, name: validatedName, date: validatedDate } =
    UpdateWorkoutSchema.parse({ workoutId, name, date });

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await updateWorkout(userId, validatedId, validatedName, validatedDate);
}
