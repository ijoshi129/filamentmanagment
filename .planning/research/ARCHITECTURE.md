# Architecture Patterns

**Domain:** Single-user filament inventory web app
**Researched:** 2026-02-11

## Recommended Architecture

Single-page application (SPA) with local database. No backend server — all data stored in SQLite via Next.js API routes running on the same process. Simple three-layer architecture: UI components → API routes → SQLite database.

```
┌─────────────────────────────────┐
│         Browser (React)         │
│  ┌───────────┐ ┌─────────────┐ │
│  │ Spool Cards│ │ Spool Form  │ │
│  └─────┬─────┘ └──────┬──────┘ │
│        │               │        │
│  ┌─────▼───────────────▼──────┐ │
│  │     Data Fetching Layer    │ │
│  │   (Server Actions / API)   │ │
│  └─────────────┬──────────────┘ │
└────────────────┼────────────────┘
                 │ HTTP (localhost)
┌────────────────▼────────────────┐
│       Next.js Server            │
│  ┌──────────────────────────┐   │
│  │    API Routes / Actions  │   │
│  └────────────┬─────────────┘   │
│  ┌────────────▼─────────────┐   │
│  │   Drizzle ORM + SQLite   │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │  Static Data (colors,    │   │
│  │  brands, materials)      │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| Spool Card Grid | Display inventory as visual cards with color swatches | Data fetching layer |
| Spool Form (Add/Edit) | Capture spool data with brand/color/material selectors | Data fetching layer, Static data |
| Filter Bar | Filter/sort spools by material, brand, color | Spool Card Grid (client-side filtering) |
| Color Picker | Bambu Lab palette + generic color picker | Spool Form |
| Brand Selector | Pre-loaded brands + custom entry | Spool Form |
| Material Selector | Material type dropdown (PLA, PETG, etc.) | Spool Form |
| API Routes | CRUD operations for spools | Drizzle ORM |
| Drizzle ORM | Type-safe database queries | SQLite file |
| Static Data Module | Bambu Lab colors, brand list, material types | Color Picker, Brand Selector, Material Selector |

### Data Flow

**Reading spools:**
1. Page loads → Server component fetches all spools via Drizzle
2. Spools rendered as cards with color swatches
3. Client-side filtering/sorting (no server round-trip for filters)

**Adding a spool:**
1. User clicks "Add Spool" → Form modal opens
2. User selects brand → Color palette loads for that brand
3. User fills form → Client validation (Zod)
4. Submit → Server action inserts via Drizzle → Revalidate page
5. New spool appears in grid

**Editing/Deleting:**
1. User clicks card → Edit form pre-populated
2. Submit → Server action updates/deletes → Revalidate

### Data Model

```
spools
├── id (primary key, auto-increment)
├── brand (text, required)
├── material (text, required - PLA, PETG, ABS, TPU, etc.)
├── colorName (text, required - "Bambu Orange", "Fire Engine Red")
├── colorHex (text, required - "#FF6600")
├── purchaseDate (date, required)
├── initialWeight (integer, default 1000 - grams)
├── notes (text, optional)
├── createdAt (datetime)
└── updatedAt (datetime)
```

## Patterns to Follow

### Pattern 1: Static Data as Constants
**What:** Store Bambu Lab colors, brand list, and material types as TypeScript constants, not in the database.
**When:** Data that changes rarely and is the same for all users.
**Why:** Simpler, no migration needed, type-safe, zero latency.

```typescript
// lib/data/bambu-colors.ts
export const BAMBU_COLORS = [
  { name: "Bambu Orange", hex: "#FF6600" },
  { name: "Bambu Green", hex: "#00AE42" },
  // ...
] as const;
```

### Pattern 2: Server Components for Data Loading
**What:** Use Next.js server components to load spool data, avoiding client-side fetch waterfalls.
**When:** Initial page load and after mutations.

### Pattern 3: Optimistic UI for CRUD
**What:** Show changes immediately in the UI before server confirms.
**When:** Add/edit/delete operations where instant feedback matters.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Over-Normalizing the Database
**What:** Creating separate tables for brands, materials, colors with foreign keys.
**Why bad:** This is a simple inventory app with < 1000 records. Normalization adds complexity (joins, migrations) with zero benefit at this scale.
**Instead:** Store brand/material/color as text fields on the spool record. Use application-level validation against the static data constants.

### Anti-Pattern 2: Client-Side State Management Library
**What:** Adding Redux/Zustand for spool state.
**Why bad:** Next.js server components + server actions handle the data flow. Adding a state library creates two sources of truth.
**Instead:** Let Next.js manage data flow. Use React state only for UI state (modal open/closed, active filters).

### Anti-Pattern 3: Building a REST API
**What:** Creating /api/spools endpoints with GET/POST/PUT/DELETE.
**Why bad:** Next.js server actions are simpler for this use case — no fetch calls, no response parsing, type-safe end-to-end.
**Instead:** Use server actions for mutations, server components for reads.

## Build Order

Based on component dependencies:

1. **Database setup** — SQLite + Drizzle schema + migrations
2. **Static data** — Bambu Lab colors, brand list, material types as constants
3. **API layer** — Server actions for CRUD operations
4. **Spool Card component** — Display a single spool with color swatch
5. **Spool Grid** — Layout of all spool cards
6. **Spool Form** — Add/edit with brand selector, color picker, material dropdown
7. **Filter/Sort** — Client-side filtering on the grid
8. **Polish** — Responsive design, empty states, loading states

## Sources

- Next.js App Router documentation
- Drizzle ORM with SQLite patterns
- shadcn/ui component architecture

---
*Architecture research for: filament inventory management*
*Researched: 2026-02-11*
