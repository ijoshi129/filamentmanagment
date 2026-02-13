# Roadmap: Filament Manager

## Overview

This roadmap delivers a visual filament inventory management web app in four phases. Phase 1 establishes the database foundation and static data (color palettes, material types). Phase 2 implements full CRUD operations for spool management. Phase 3 builds the visual card-based UI with large color swatches. Phase 4 adds discovery features (filtering and search). The structure follows the natural build order identified in research: database layer → API layer → UI components → enhanced features.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Data Foundation** - Database schema and static data ready *(completed 2026-02-12)*
- [x] **Phase 2: Inventory Management** - Full CRUD operations for spools *(completed 2026-02-12)*
- [x] **Phase 3: Visual Display** - Card-based UI with color swatches *(completed 2026-02-12)*
- [ ] **Phase 4: Discovery** - Search and filter functionality

## Phase Details

### Phase 1: Data Foundation
**Goal**: Database and static data infrastructure ready to store and serve spool inventory
**Depends on**: Nothing (first phase)
**Requirements**: INV-04, INV-05, INV-06
**Success Criteria** (what must be TRUE):
  1. Database stores spool records with brand, material, color (name + hex), purchase date, and weight fields
  2. Bambu Lab color palette available with accurate hex values as TypeScript constants
  3. Material types available as validated dropdown options (PLA, PETG, ABS, TPU, ASA, Nylon)
  4. Server actions can read and write spool data via type-safe Drizzle queries
**Plans:** 3 plans

Plans:
- [x] 01-01-PLAN.md — Bootstrap Next.js with Drizzle/SQLite and define spool schema
- [x] 01-02-PLAN.md — Bambu Lab color palette and material type constants
- [x] 01-03-PLAN.md — Server actions for spool CRUD with Zod validation

### Phase 2: Inventory Management
**Goal**: User can create, edit, and delete filament spools with full field support
**Depends on**: Phase 1
**Requirements**: INV-01, INV-02, INV-03
**Success Criteria** (what must be TRUE):
  1. User can add a new spool with all fields (brand, material, color, purchase date, initial weight)
  2. User can edit any field on an existing spool via edit form
  3. User can delete a spool from inventory with confirmation
  4. Initial weight defaults to 1000g when adding a spool
  5. Form validates required fields and prevents submission with missing data
**Plans:** 2 plans

Plans:
- [x] 02-01-PLAN.md — SpoolForm component with Bambu Lab color picker and Add Spool page
- [x] 02-02-PLAN.md — Home page spool list, edit page, and delete with confirmation

### Phase 3: Visual Display
**Goal**: User can see their inventory as visual cards with color swatches
**Depends on**: Phase 2
**Requirements**: DISP-01, DISP-02, DISP-03
**Success Criteria** (what must be TRUE):
  1. Spools display as cards with large color swatches matching the stored hex color
  2. Material type appears as a prominent badge on each card
  3. Each card shows brand, color name, purchase date, and weight
  4. Card layout is responsive and works on mobile devices
  5. Empty state displays helpful message when no spools exist
**Plans:** 2 plans

Plans:
- [x] 03-01-PLAN.md — Extract SpoolCard component with prominent color-coded material badges
- [x] 03-02-PLAN.md — Sort controls, enhanced empty states, and missing-data handling

### Phase 4: Discovery
**Goal**: User can find spools by filtering and searching inventory
**Depends on**: Phase 3
**Requirements**: ORG-01, ORG-02, ORG-03
**Success Criteria** (what must be TRUE):
  1. User can filter visible spools by material type (single or multiple materials)
  2. User can filter visible spools by brand (single or multiple brands)
  3. User can search spools by text across brand, material, and color name
  4. Filters and search work together (combine constraints)
  5. Filter/search state persists during session (clearing form doesn't reset filters)
**Plans:** 1 plan

Plans:
- [ ] 04-01-PLAN.md — Text search bar and multi-select filter chips

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Data Foundation | 3/3 | ✓ Complete | 2026-02-12 |
| 2. Inventory Management | 2/2 | ✓ Complete | 2026-02-12 |
| 3. Visual Display | 2/2 | ✓ Complete | 2026-02-12 |
| 4. Discovery | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-11*
*Last updated: 2026-02-12 (Phase 3 complete)*
