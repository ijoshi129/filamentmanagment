# Filament Manager

## What This Is

A personal web app for managing 3D printer filament inventory. Tracks spools with brand, material, color, weight, and purchase date. Visual card-based UI with large color swatches and color-coded material badges for quick identification. Includes text search and multi-select filtering. Built for a single user running a Bambu Lab P1S.

## Core Value

Quickly see what filament you have — by color, brand, and material — so you never guess what's on the shelf.

## Requirements

### Validated

- ✓ Add, edit, and delete filament spools — v1.0
- ✓ Spool fields: Brand, Material, Color, Purchase Date, Initial Weight (default 1KG) — v1.0
- ✓ Pre-loaded Bambu Lab color palette with actual color swatches — v1.0
- ✓ Material type selection (PLA, PETG, ABS, TPU, etc.) — v1.0
- ✓ Visual card layout with color swatches for each spool — v1.0
- ✓ Material type as prominent badge on cards — v1.0
- ✓ Filter spools by material type and brand — v1.0
- ✓ Search spools by text across brand, material, and color name — v1.0
- ✓ Single-user, no authentication needed — v1.0

### Active

- [ ] Generic color picker for non-Bambu brands
- [ ] Pre-loaded brand list with "Add custom" option
- [ ] Export inventory as JSON for backup
- [ ] Import inventory from JSON backup
- [ ] Sort spools by date, brand, material, or color
- [ ] Inventory summary showing spool counts by material and brand

### Out of Scope

- Usage tracking / remaining weight calculation — deferred, revisit after v1
- Multi-user / authentication — single user only
- Mobile native app — web app works on mobile browsers
- Printer integration / OctoPrint / Bambu API — keep it simple
- Cloud sync — adds backend complexity, hosting costs
- Barcode/QR scanning — manual entry sufficient for spool counts < 100
- Print history / job logging — different product scope

## Context

Shipped v1.0 MVP with 3,502 LOC TypeScript across 24 files.
Tech stack: Next.js 16, Drizzle ORM, SQLite (WAL mode), Zod validation.
Bambu Lab color palette pre-loaded with 48 colors across 7 categories.
Brand-material-modifier cascading ensures only real product combos are selectable.
Sort controls with 5 options (Most Recent default). Multi-select chip filters for material and brand.

## Constraints

- **Platform**: Web app, accessible from any browser
- **Users**: Single user, no auth complexity
- **Scope**: Inventory only — no print tracking, no slicer integration

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Visual card UI over table | User wants to see colors at a glance, not scan rows | ✓ Good — cards with 100px swatches work well |
| Pre-loaded Bambu Lab colors | Primary brand, avoids manual hex entry | ✓ Good — 48 colors across 7 categories |
| Default weight 1KG | Most common spool size | ✓ Good |
| SQLite with Drizzle ORM | Simple, file-based, no server needed | ✓ Good — WAL mode for concurrent access |
| TypeScript constants for static data | Color palettes, materials as code not DB tables | ✓ Good — type-safe, no migration needed |
| Brand-material-modifier cascading | Only show real product combinations | ✓ Good — prevents invalid color selections |
| Multi-select chips over dropdowns | Better UX for selecting multiple filters | ✓ Good — more intuitive than dropdown multi-select |
| Zod for runtime validation | Type-safe, composable, works with server actions | ✓ Good |
| crypto.randomUUID for IDs | Globally unique, no coordination needed | ✓ Good |

---
*Last updated: 2026-02-13 after v1.0 milestone*
