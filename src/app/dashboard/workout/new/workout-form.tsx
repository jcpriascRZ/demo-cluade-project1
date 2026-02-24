"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createWorkoutAction } from "./actions";

export function WorkoutForm({ initialDate }: { initialDate: Date }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date>(initialDate);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    await createWorkoutAction(name, date);
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Workout name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Push Day, Leg Day"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-55 justify-start gap-2">
              <CalendarIcon className="h-4 w-4" />
              {format(date, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(day) => day && setDate(day)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving..." : "Save Workout"}
      </Button>
    </form>
  );
}
