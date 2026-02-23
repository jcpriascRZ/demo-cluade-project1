# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

Do not create custom UI components. If a UI element is needed, find the appropriate shadcn/ui component and use it. The full list of available components is at [https://ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).

To add a new shadcn/ui component:

```bash
npx shadcn@latest add <component-name>
```

Components are installed into `src/components/ui/` and must not be modified.

## Date Formatting

All dates must be formatted using [date-fns](https://date-fns.org/).

Dates must be displayed in the following format: `do MMM yyyy`

| Date | Formatted Output |
|------|-----------------|
| 2025-09-01 | 1st Sep 2025 |
| 2025-08-02 | 2nd Aug 2025 |
| 2026-01-03 | 3rd Jan 2026 |
| 2024-06-04 | 4th Jun 2024 |

### Usage

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy");
```
