# Filament Manager

A self-hosted web app for tracking your 3D printing filament inventory. Built with Next.js, SQLite, and Tailwind CSS.

## Features

- **Spool Inventory** — Add, edit, and delete filament spools with brand, material, color, weight, price, and status tracking
- **Color Catalog** — Pre-loaded Bambu Lab color catalog with hex swatches for quick spool entry. Add your own brands and colors through Settings
- **Filtering & Search** — Filter by status, brand, material, or modifier. Full-text search across all spool fields
- **Sorting** — Sort by date added, material, color family, or brand
- **Settings Panel** — Manage brands, materials, modifiers, and color catalogs without touching the database directly

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Actions)
- **Database:** SQLite via better-sqlite3
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS 4
- **Validation:** Zod
- **Language:** TypeScript

## Quick Start (Docker)

The easiest way to run this is with Docker.

```bash
git clone <your-repo-url>
cd filamentmanagment
docker compose up -d
```

That's it. Open `http://<your-server-ip>:3000`.

The database is created and seeded automatically on first launch. Data is stored in a Docker volume (`filament-data`) so it persists across container restarts and rebuilds.

### Updating

```bash
git pull
docker compose up -d --build
```

Your data is safe — the database only gets created on first run.

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
cp .env.example .env.local
npm run db:setup   # creates tables + seeds Bambu Lab color catalog
npm run dev        # http://localhost:3000
```

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Push schema changes to SQLite database |
| `npm run db:seed` | Seed database with default brands, materials, and Bambu Lab color catalog |
| `npm run db:setup` | Run `db:push` + `db:seed` (first-time setup) |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── actions/          # Server actions (spools CRUD, settings CRUD)
├── app/
│   ├── api/          # API routes (settings data endpoint)
│   ├── settings/     # Settings page (manage brands, materials, colors)
│   ├── spools/       # Spool pages (new, edit)
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page (spool inventory)
├── components/       # React components (SpoolForm, SpoolCard, SpoolList)
├── db/
│   ├── schema.ts     # Drizzle schema (spools, brands, materials, modifiers, catalog_colors)
│   └── seed.ts       # Database seed script
└── lib/              # Shared utilities (db connection, validation, formatting)
```

## Notes

- Data is stored in a local SQLite file — no external database needed
- The app is designed for single-user, self-hosted use. There is no authentication
- The seed script includes the full Bambu Lab filament color catalog. You can add more brands and colors through the Settings UI
