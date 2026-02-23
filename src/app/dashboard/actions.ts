"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createWorkout } from "@/data/workouts";

export async function logWorkoutAction(formData: FormData) {
  const { userId } = await auth();
  const name = formData.get("name") as string;
  const date = new Date(formData.get("date") as string);
  await createWorkout(userId!, name, date);
  revalidatePath("/dashboard");
}
