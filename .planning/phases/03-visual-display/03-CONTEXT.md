# Phase 3: Visual Display - Context

**Gathered:** 2026-02-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Present spool inventory as visual cards with prominent color swatches. Users glance at their collection and immediately recognize spools by color. Includes sort controls for organizing the view. Search and advanced filtering are Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Layout & responsiveness
- CSS Grid with auto-fill and ~280px minimum card width — grid fills as many columns as fit
- On mobile, cards go full-width (single column) for easy tapping and big color swatches
- Sort dropdown with multiple options: by color family, most recent, oldest, by material, etc.

### Empty state
- Illustration + CTA when inventory is truly empty: friendly spool/shelf illustration with "Add your first spool" button
- Distinct "no results" state when filters return nothing: "No spools match your filters" with "Clear filters" button

### Missing data handling
- Hide fields that have no data rather than showing placeholders — cards may vary in height
- Only display fields that have values (purchase date, weight, etc.)

### Color contrast
- Fixed card style regardless of swatch color — text stays below the color swatch area, no adaptive text color needed

### Claude's Discretion
- Card design details (swatch prominence, shadow, border radius, spacing)
- Material badge style and placement
- Sort dropdown implementation approach
- Illustration choice for empty state
- Exact breakpoints for responsive grid

</decisions>

<specifics>
## Specific Ideas

- Phase 2 already has a card grid with color swatch headers — this phase refines and extracts into a proper SpoolCard component
- Workshop use case means mobile-first thinking: big touch targets, glanceable info

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-visual-display*
*Context gathered: 2026-02-12*
