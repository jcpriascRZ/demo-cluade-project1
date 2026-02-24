import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { WorkoutForm } from "./workout-form";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { date } = await searchParams;
  const initialDate = date ? new Date(date) : new Date();

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">New Workout</h1>
      <WorkoutForm initialDate={initialDate} />
    </div>
  );
}
