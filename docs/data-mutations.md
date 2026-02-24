# Data Mutations

## CRITICAL: Server Actions Only

**ALL data mutations in this application MUST be done exclusively via Next.js Server Actions.**

This is a hard requirement. The following are strictly forbidden:

- **Route Handlers** (`app/api/` routes) must NOT be used to mutate data
- **Client-side fetch/axios calls** to mutate data are not permitted
- **Direct database calls** from components or pages are not permitted

## Server Actions: `actions.ts` Files

Server Actions must be defined in colocated **`actions.ts`** files, placed alongside the route or component they serve.

```
src/app/workouts/
├── page.tsx
├── actions.ts       ✅ correct location
└── components/
    └── WorkoutForm.tsx
```

Do not place server actions in a shared global file. Each `actions.ts` lives next to the UI that uses it.

Every `actions.ts` file must begin with the `"use server"` directive:

```ts
"use server";
```

## Database Mutations: `/data` Directory

All direct database writes (insert, update, delete) must be encapsulated in helper functions located in the **`src/data/`** directory. Server Actions must not call Drizzle ORM directly — they delegate to these helpers.

### Rules

1. **Use Drizzle ORM exclusively.** Raw SQL strings are strictly forbidden. Every mutation must go through the Drizzle query builder.

2. **Never use raw SQL.** Do not use `db.execute(sql`...`)` or any form of string-based SQL.

3. **Every helper function must be scoped to the authenticated user.** Mutations on user-owned data must always include the authenticated user's ID to prevent cross-user data tampering.

**Example helper:**

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date });
}

export async function deleteWorkout(userId: string, workoutId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

## Server Action Parameters

### Typed Parameters — No `FormData`

Server Action parameters must be explicitly typed. **`FormData` is strictly forbidden as a parameter type.**

```ts
// ❌ Forbidden
export async function createWorkout(data: FormData) { ... }

// ✅ Required
export async function createWorkout(name: string, date: Date) { ... }
```

### Validation with Zod

**Every server action MUST validate all arguments using [Zod](https://zod.dev/) before performing any operation.**

Define a Zod schema for each action's input and call `.parse()` or `.safeParse()` at the top of the function body.

**Example:**

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
});

export async function createWorkoutAction(name: string, date: Date) {
  const { name: validatedName, date: validatedDate } = CreateWorkoutSchema.parse({ name, date });

  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await createWorkout(session.user.id, validatedName, validatedDate);
}
```

If validation fails, `z.parse()` will throw automatically and the action will not proceed. Use `safeParse()` if you need to return a structured error to the UI instead of throwing.

## Redirects After Mutations

**`redirect()` must NOT be called inside server actions.** Navigation after a mutation is the responsibility of the client.

After awaiting a server action in a Client Component, use Next.js's `useRouter` to redirect:

```ts
// ❌ Forbidden
export async function createWorkoutAction(name: string, date: Date) {
  await createWorkout(userId, name, date);
  redirect("/dashboard"); // never do this
}

// ✅ Required — redirect in the Client Component after the action resolves
async function handleSubmit() {
  await createWorkoutAction(name, date);
  router.push("/dashboard");
}
```

## Summary

| Concern | Requirement |
|---|---|
| Where to mutate data | Server Actions only |
| Server Action file location | Colocated `actions.ts` next to the route/component |
| Parameter types | Explicitly typed — `FormData` is forbidden |
| Input validation | Zod — required on every server action |
| Database calls | Drizzle ORM via `src/data/` helper functions only |
| Raw SQL | Strictly forbidden |
| User data writes | Always scoped to the authenticated user's ID |
| Redirects after mutations | Client-side via `useRouter` — `redirect()` is forbidden in server actions |
