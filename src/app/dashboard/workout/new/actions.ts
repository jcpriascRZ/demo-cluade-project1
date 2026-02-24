"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
});

export async function createWorkoutAction(name: string, date: Date) {
  const { name: validatedName, date: validatedDate } = CreateWorkoutSchema.parse({ name, date });

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await createWorkout(userId, validatedName, validatedDate);
}
