# Stack Research

**Domain:** Single-user filament inventory web app
**Researched:** 2026-02-11
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x | Full-stack React framework | File-based routing, API routes, SSR/SSG, single deploy target. Perfect for single-user CRUD apps. |
| React | 19.x | UI library | Component model ideal for card-based visual UI with color swatches |
| TypeScript | 5.x | Type safety | Prevents bugs in data models (spool fields, color definitions) |
| SQLite via better-sqlite3 | 11.x | Database | Zero-config, file-based, perfect for single-user. No database server needed. |
| Drizzle ORM | 0.38.x | Database toolkit | Lightweight, type-safe SQL. Better than Prisma for SQLite (no binary, faster). |
| Tailwind CSS | 4.x | Styling | Utility-first, great for visual card layouts and responsive design |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | latest | UI components | Pre-built cards, dialogs, forms, selects, color pickers |
| react-hook-form | 7.x | Form handling | Spool add/edit forms with validation |
| zod | 3.x | Schema validation | Validate spool data on client and server |
| lucide-react | latest | Icons | UI icons for add, edit, delete, filter actions |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Node.js | Runtime | v20 LTS or v22 |
| npm/pnpm | Package manager | pnpm preferred for speed |

## Installation

```bash
# Create Next.js project
npx create-next-app@latest filament-manager --typescript --tailwind --app --src-dir

# Core
npm install drizzle-orm better-sqlite3
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react

# Dev dependencies
npm install -D drizzle-kit @types/better-sqlite3
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js | Vite + React | If you want client-only SPA (no server routes). But Next gives you API routes for free. |
| SQLite | localStorage | Only if data is truly ephemeral. SQLite survives better and handles larger datasets. |
| SQLite | PostgreSQL | If multi-user later. Overkill for single-user local app. |
| Drizzle | Prisma | If you need more advanced relations. Drizzle is lighter for simple CRUD. |
| Tailwind | CSS Modules | If you prefer scoped CSS. Tailwind faster for prototyping visual layouts. |
| shadcn/ui | Material UI | If you want opinionated design system. shadcn is lighter, more customizable. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| MongoDB | Overkill for structured inventory data, requires server | SQLite |
| Redux / Zustand | Unnecessary state management complexity for CRUD app | React state + server actions |
| Firebase | External dependency, costs money at scale, vendor lock-in | Local SQLite |
| Electron | Desktop wrapper adds huge bundle, not needed for web app | Plain Next.js |

## Sources

- Next.js official documentation
- Drizzle ORM documentation
- shadcn/ui component library
- Community patterns for personal inventory apps

---
*Stack research for: filament inventory management*
*Researched: 2026-02-11*
