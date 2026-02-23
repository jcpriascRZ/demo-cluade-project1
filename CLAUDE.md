# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a **Next.js 16** app using the **App Router** with **React 19**, **TypeScript**, and **Tailwind CSS v4**.

- **`src/app/`** — App Router directory. `layout.tsx` is the root layout; `page.tsx` is the home route. New routes are added as folders with `page.tsx` files.
- **`public/`** — Static assets served at the root path.

### Key conventions

- Path alias `@/*` maps to `./src/*` (configured in `tsconfig.json`).
- Fonts are loaded via `next/font/google` (Geist family) in `layout.tsx`.
- Tailwind CSS v4 is configured through PostCSS (`@tailwindcss/postcss` plugin) — there is no `tailwind.config.js`; theme customization goes in `globals.css` using CSS variables.
- ESLint uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` presets (configured in `eslint.config.mjs`).
- TypeScript strict mode is enabled.
