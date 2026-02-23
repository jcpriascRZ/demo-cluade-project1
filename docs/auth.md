# Authentication

## Provider: Clerk

**This application uses [Clerk](https://clerk.com) exclusively for authentication.**

Do not implement custom authentication logic, roll your own session handling, or use any other auth library (e.g. NextAuth, Auth.js, Lucia). Clerk is the single source of truth for all identity and session management.

## Getting the Authenticated User

Retrieve the current user's ID in Server Components using Clerk's `auth()` helper:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
```

For pages that require authentication, use `auth()` to get the `userId` and handle the unauthenticated case:

```tsx
// src/app/dashboard/page.tsx  (Server Component)
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // pass userId to data helpers — never trust client-supplied IDs
}
```

## Route Protection

Use Clerk's `clerkMiddleware` in `middleware.ts` to protect routes. Define which routes are public (sign-in, sign-up, marketing pages) and treat everything else as protected.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
```

## UI Components

Use Clerk's pre-built components for all auth-related UI. Do not build custom sign-in or sign-up forms.

| Component | Purpose |
|-----------|---------|
| `<SignIn />` | Sign-in page |
| `<SignUp />` | Sign-up page |
| `<UserButton />` | Account menu / sign-out |
| `<SignedIn>` | Render children only when authenticated |
| `<SignedOut>` | Render children only when unauthenticated |

## Rules

1. **Never use `userId` from URL params, query strings, or request bodies** to scope data access. Always resolve the `userId` from the server-side Clerk session via `auth()`.
2. **Never expose unauthenticated routes** to data that belongs to a user. All user-owned data must be gated behind an authenticated `userId`.
3. **Do not store passwords or session tokens** manually. Clerk manages all credentials and sessions.
4. **Client Components must not call `auth()`** — it is a server-only API. Use Clerk's client-side hooks (`useUser`, `useAuth`) if user info is needed in a Client Component, but do not use them for data fetching (see `data-fetching.md`).

## Summary

| Concern | Requirement |
|---|---|
| Auth provider | Clerk exclusively |
| Getting `userId` on the server | `auth()` from `@clerk/nextjs/server` |
| Route protection | `clerkMiddleware` in `middleware.ts` |
| Auth UI components | Clerk built-in components only |
| Custom auth logic | Not permitted |
