# Filament Manager

## What This Is

A personal web app for managing 3D printer filament inventory. Tracks spools with brand, material, color, weight, and purchase date. Visual card-based UI with color swatches for quick identification. Built for a single user running a Bambu Lab P1S.

## Core Value

Quickly see what filament you have — by color, brand, and material — so you never guess what's on the shelf.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Add, edit, and delete filament spools
- [ ] Spool fields: Brand, Material, Color, Purchase Date, Initial Weight (default 1KG)
- [ ] Pre-loaded Bambu Lab color palette with actual color swatches
- [ ] Generic color picker for non-Bambu brands
- [ ] Pre-loaded brand list (Bambu Lab, Hatchbox, eSUN, etc.) with "Add custom" option
- [ ] Material type selection (PLA, PETG, ABS, TPU, etc.)
- [ ] Visual card layout with color swatches for each spool
- [ ] Single-user, no authentication needed

### Out of Scope

- Usage tracking / remaining weight calculation — deferred, revisit after v1
- Multi-user / authentication — single user only
- Mobile native app — web app works on mobile browsers
- Printer integration / OctoPrint / Bambu API — keep it simple

## Context

- Owner runs a Bambu Lab P1S printer
- Primarily uses Bambu Lab filament with some generic brands
- Wants a visual way to browse inventory, not just a spreadsheet
- Color selection is important — Bambu Lab has a specific color lineup that should be pre-loaded

## Constraints

- **Platform**: Web app, accessible from any browser
- **Users**: Single user, no auth complexity
- **Scope**: Inventory only — no print tracking, no slicer integration

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Visual card UI over table | User wants to see colors at a glance, not scan rows | — Pending |
| Pre-loaded Bambu Lab colors | Primary brand, avoids manual hex entry | — Pending |
| Default weight 1KG | Most common spool size | — Pending |

---
*Last updated: 2026-02-11 after initialization*
