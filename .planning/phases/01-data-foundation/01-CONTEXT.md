# Phase 1: Data Foundation - Context

**Gathered:** 2026-02-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Database schema and static data infrastructure ready to store and serve filament spool inventory. Includes spool table schema, Bambu Lab color palette as TypeScript constants, and material type definitions. CRUD operations and UI are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Color palette scope
- Bambu Lab only for v1 — no other brand palettes
- Complete palette (all colors including basics, matte, silk, marble, glow, etc.)
- Organized by category (e.g., Basics, Matte, Silk, Special) — not a flat list
- Users can pick from Bambu palette OR enter custom color name + hex for non-Bambu spools

### Spool data model
- Status field with 3 states: Sealed (unused), In Use (opened), Empty (done)
- Weight: initial weight only (default 1000g), no remaining/usage tracking
- Notes: optional free-form text field (e.g., print settings, purchase location)
- Price: optional cost field per spool
- Core fields from roadmap: brand, material, color (name + hex), purchase date, weight

### Material types
- 6 base materials: PLA, PETG, ABS, TPU, ASA, Nylon
- Base + modifier structure (not flat list of variants)
- Modifiers: Carbon Fiber (CF), Silk, Matte, Glow-in-Dark, Wood-fill
- Users can add custom materials AND custom modifiers beyond the predefined lists

### Claude's Discretion
- Database table structure and relationships
- TypeScript constant file organization
- Drizzle schema design patterns
- How custom colors/materials are stored vs predefined ones

</decisions>

<specifics>
## Specific Ideas

- Color stored as multi-format object (name + hex) — decided in project setup
- Bambu Lab palette should include accurate hex values matching their actual filament colors
- Material modifier is optional — "PLA" is valid without a modifier

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-data-foundation*
*Context gathered: 2026-02-11*
