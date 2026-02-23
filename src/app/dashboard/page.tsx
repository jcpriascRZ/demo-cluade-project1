import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "./date-picker";
import { LogWorkoutButton } from "./log-workout-button";
import { getWorkoutsForUser } from "@/data/workouts";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  const { date: dateParam } = await searchParams;
  const date = dateParam ? new Date(dateParam) : new Date();

  const workouts = await getWorkoutsForUser(userId!, date);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Workout Diary</h1>

      <div className="mb-6">
        <DatePicker />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Workouts for {format(date, "do MMM yyyy")}
        </h2>

        {workouts.length === 0 ? (
          <LogWorkoutButton date={date} />
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{workout.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {format(workout.performedAt, "do MMM yyyy")}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
