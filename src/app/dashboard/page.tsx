import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "./date-picker";
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href={`/dashboard/workout/new?date=${format(date, "yyyy-MM-dd")}`}>
              <PlusIcon className="h-4 w-4" />
              Log Workout
            </Link>
          </Button>
        </div>

        {workouts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No workouts logged for this date.</p>
        ) : (
          workouts.map((workout) => (
            <Link key={workout.id} href={`/dashboard/workout/${workout.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {format(workout.performedAt, "do MMM yyyy")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
