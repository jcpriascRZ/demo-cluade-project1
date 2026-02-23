"use client";

import { useRef, useState } from "react";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logWorkoutAction } from "./actions";

export function LogWorkoutButton({ date }: { date: Date }) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await logWorkoutAction(formData);
    setOpen(false);
    formRef.current?.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col items-start gap-3">
        <p className="text-muted-foreground text-sm">No workouts logged for this date.</p>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Log Workout
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Workout for {format(date, "do MMM yyyy")}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4 pt-2">
          <input type="hidden" name="date" value={format(date, "yyyy-MM-dd")} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Workout name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Push Day, Leg Day"
              required
            />
          </div>
          <Button type="submit" className="self-end">Save Workout</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
