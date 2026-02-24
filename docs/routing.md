# Routing

## Route Structure

**All application routes must be nested under `/dashboard`.**

The root route (`/`) is a public marketing or landing page. All authenticated app functionality lives under `/dashboard` and its sub-routes.

```
/                          → public (landing page)
/dashboard                 → protected (main app)
/dashboard/workout/new     → protected (log a new workout)
/dashboard/workout/[id]    → protected (view/edit a workout)
```

Do not create top-level app routes outside of `/dashboard`. If new functionality is needed, add it as a sub-route of `/dashboard`.

## Route Protection

**All `/dashboard` routes must be protected and only accessible by logged in users.**

Route protection is handled via Next.js middleware using Clerk's `clerkMiddleware`. Do not implement per-page auth guards as the primary protection mechanism — middleware is the single enforcement point.

### Middleware Setup

Create a `middleware.ts` file at the root of the project (alongside `src/`):

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
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

Any route not listed in `isPublicRoute` is automatically protected. When a new public route is added (e.g. a marketing page), it must be explicitly added to the `createRouteMatcher` list.

## Rules

1. **All app routes belong under `/dashboard`.** Do not create sibling top-level routes for authenticated features.
2. **Middleware is the enforcement point for route protection.** Do not rely solely on per-page `auth()` checks to gate access.
3. **New public routes must be explicitly declared** in the `createRouteMatcher` list in `middleware.ts`. Everything else is protected by default.
4. **Do not use client-side-only redirects** to protect routes. Middleware runs on the server before the page is rendered, preventing unauthorized access.

## Summary

| Concern | Requirement |
|---|---|
| App route prefix | `/dashboard` for all authenticated routes |
| Public routes | `/`, `/sign-in`, `/sign-up` only |
| Route protection mechanism | `clerkMiddleware` in `middleware.ts` |
| Per-page auth checks | Allowed as a secondary guard, not a replacement for middleware |
