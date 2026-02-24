import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import { WorkoutEditForm } from "./workout-edit-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workoutId } = await params;
  const id = parseInt(workoutId, 10);
  if (isNaN(id)) notFound();

  const workout = await getWorkoutById(userId, id);
  if (!workout) notFound();

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Workout</h1>
      <WorkoutEditForm
        workoutId={workout.id}
        initialName={workout.name}
        initialDate={workout.performedAt}
      />
    </div>
  );
}
