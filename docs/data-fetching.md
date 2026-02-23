# Data Fetching

## CRITICAL: Server Components Only

**ALL data fetching in this application MUST be done exclusively via React Server Components.**

This is a hard requirement. The following are strictly forbidden:

- **Route Handlers** (`app/api/` routes) must NOT be used to fetch or serve data to the UI
- **Client Components** (`"use client"`) must NOT perform any data fetching (no `useEffect` + fetch, no SWR, no React Query, etc.)
- **`fetch()` in client-side code** is not permitted for loading application data

Data flows in one direction: database → server component → rendered HTML (optionally passed as props to client components for interactivity).

## Database Queries: `/data` Directory

All database queries must be encapsulated in helper functions located in the **`/data`** directory (e.g., `src/data/`).

### Rules

1. **Use Drizzle ORM exclusively.** Raw SQL strings are strictly forbidden. Every query must go through the Drizzle query builder or Drizzle's relational query API.

2. **Never use raw SQL.** Do not use `db.execute(sql`...`)` or any form of string-based SQL. Use Drizzle's typed query methods at all times.

3. **Every helper function must be scoped to the authenticated user.** A logged-in user must only ever be able to access their own data. Every query that touches user-owned data must filter by the authenticated user's ID.

### User Data Isolation

This is a **security requirement**, not a suggestion.

Every data helper that returns user-owned records must:

- Accept the authenticated `userId` as a parameter (resolved in the server component from the session)
- Include a `where` clause that filters by that `userId`
- Never expose a query that returns records belonging to other users

**Example pattern:**

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

```tsx
// src/app/dashboard/page.tsx  (Server Component)
import { getWorkoutsForUser } from "@/data/workouts";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);

  return <WorkoutList workouts={workouts} />;
}
```

The `userId` is always sourced from the server-side session — it is never taken from URL params, query strings, or request bodies without verification.

## Summary

| Concern | Requirement |
|---|---|
| Where to fetch data | Server Components only |
| Route handlers for data | Not permitted |
| Client-side fetching | Not permitted |
| Query method | Drizzle ORM (no raw SQL) |
| Query location | `src/data/` helper functions |
| User data access | Strictly scoped to the authenticated user's ID |
