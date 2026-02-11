# Project Research Summary

**Project:** Filament Manager
**Domain:** Personal inventory management (3D printing filament)
**Researched:** 2026-02-11
**Confidence:** MEDIUM-HIGH

## Executive Summary

This is a single-user filament inventory web application for tracking 3D printing filament spools. Based on research, the recommended approach is a Next.js full-stack application with SQLite database, emphasizing visual card-based UI with large color swatches. The core technical pattern is simple: React UI components consuming Next.js server actions that interact with a local SQLite database via Drizzle ORM. This architecture is proven for personal CRUD applications and avoids unnecessary complexity (no authentication, no external databases, no state management libraries).

The key insight from research is that **color is the primary key for users**. Unlike generic inventory apps, filament management is fundamentally visual—users think "I need that blue PETG" not "I need spool ID 47." This drives critical design decisions: large color swatches in cards, manufacturer color palettes pre-loaded (especially Bambu Lab), and color-aware search/filtering. The data model must treat color as multi-format data (name + hex + manufacturer) from day one, not as an afterthought.

The main risk is data quality degradation through poor validation. Without strict controls on brand/material/color entry, users will create duplicates ("Bambu Lab" vs "BambuLab" vs "bambu") that break filtering and search. Prevention requires Phase 1 validation with dropdowns, normalization, and duplicate detection. Secondary risks include mobile responsiveness (users check inventory from their printer/workshop on phones) and data loss (export/import must ship with v1). Both are addressable with standard patterns in Phase 1.

## Key Findings

### Recommended Stack

Next.js 15 with TypeScript provides the ideal foundation: file-based routing, API routes as server actions, SSR/SSG for optimal performance, and single deploy target. SQLite via better-sqlite3 is perfect for single-user use—zero configuration, file-based, no database server. Drizzle ORM offers type-safe queries without Prisma's complexity. Tailwind CSS handles responsive card layouts, and shadcn/ui provides pre-built components (cards, dialogs, forms, color pickers) that match the domain needs.

**Core technologies:**
- **Next.js 15 + React 19:** Full-stack framework with server actions — eliminates need for REST API, provides type-safe data flow
- **SQLite + Drizzle ORM:** Local file-based database with type-safe queries — zero config, perfect for single-user, no external dependencies
- **TypeScript + Zod:** Type safety and validation — prevents bugs in complex data model (color formats, material properties)
- **Tailwind CSS + shadcn/ui:** Utility-first styling with pre-built components — rapid development of card-based visual UI
- **react-hook-form:** Form handling with validation — clean forms for spool CRUD operations

**What to avoid:**
- MongoDB/PostgreSQL (overkill, requires server)
- Redux/Zustand (unnecessary state management)
- Firebase (external dependency, costs, vendor lock-in)
- Electron (huge bundle for simple web app)

### Expected Features

Research identified clear feature hierarchy, though confidence is LOW due to lack of web search tools (research based on training data only).

**Must have (table stakes):**
- Basic spool CRUD (create, read, update, delete)
- Material type tracking (PLA, PETG, ABS, TPU dropdown)
- Color tracking with name + hex value
- Brand/manufacturer tracking
- Weight tracking (initial weight, current weight for remaining filament)
- Purchase date tracking
- Visual card-based grid with large color swatches
- Search and filter by material, brand, color
- Spool status (active, stored, empty)

**Should have (competitive differentiators):**
- Pre-loaded Bambu Lab color palette (user requirement)
- Pre-loaded brand list (user requirement)
- Cost tracking (purchase price)
- Location tracking (which shelf/dry box)
- Filament diameter (1.75mm vs 2.85mm)
- Temperature settings per material (nozzle/bed temp)
- Dark mode
- Export/import functionality (JSON, CSV)

**Defer (v2+):**
- Printer integration (Bambu Connect, OctoPrint APIs)
- Filament usage tracking per print
- Print history
- Low stock alerts
- QR code labels for scanning
- Filament drying log
- Barcode scanning

**Anti-features (explicitly avoid):**
- Multi-user authentication
- Cloud sync (Phase 1)
- Social features
- E-commerce integration
- Advanced analytics dashboards
- Print job slicing
- 3D model library

### Architecture Approach

Single-page application with local database. Three-layer architecture: UI components (React) → API routes (Next.js server actions) → SQLite database (Drizzle ORM). Static data (Bambu Lab colors, brand lists, material types) stored as TypeScript constants, not in database—simpler, type-safe, zero latency. No REST API—Next.js server actions provide type-safe end-to-end data flow without fetch calls.

**Major components:**
1. **Spool Card Grid** — Visual inventory display with color swatches, filters applied client-side
2. **Spool Form (Add/Edit)** — Single-screen form with brand selector, color picker, material dropdown, pre-populated from static data
3. **Static Data Module** — TypeScript constants for Bambu Lab colors, brand list, material types (no database overhead)
4. **Server Actions Layer** — CRUD operations via Next.js server actions, not REST endpoints
5. **Drizzle ORM + SQLite** — Type-safe database queries against local file

**Key patterns:**
- Server components for data loading (avoid fetch waterfalls)
- Static data as constants (not database tables)
- Client-side filtering (no server round-trip)
- Optimistic UI for CRUD (instant feedback)

**Anti-patterns to avoid:**
- Over-normalizing database (separate tables for brands/colors with joins—overkill at this scale)
- Client-side state management library (Next.js handles data flow)
- Building REST API (server actions are simpler)

### Critical Pitfalls

From PITFALLS.md research (detailed analysis of common failures in inventory apps):

1. **Treating color as simple text** — Storing only hex or only name leads to search/filter breakage and color matching failures. Prevention: Store color as object (name + hex + manufacturer + family) from Phase 1. Pre-load manufacturer palettes with accurate hex codes.

2. **Poor validation on pre-loaded data** — Allowing free-form text for brands creates duplicates ("Bambu Lab" vs "BambuLab"). Prevention: Use dropdowns with strict validation, normalize input, detect duplicates before save.

3. **Over-complicated CRUD workflows** — Multi-step wizards for simple spool entry lead to user abandonment. Prevention: Single-screen form, smart defaults, keyboard shortcuts, "duplicate spool" quick action.

4. **No mobile consideration** — Desktop-only UI fails for workshop use cases (checking inventory from printer on phone). Prevention: Responsive design from Phase 1, touch-friendly targets (44x44px minimum), PWA for Phase 3.

5. **Missing data export/backup** — Users lose data when browser cache clears or they switch devices. Prevention: JSON export/import in Phase 1, CSV in Phase 2. Cloud sync deferred to Phase 3+.

6. **Ignoring partial spool tracking** — Only tracking full spools without remaining weight leads to "out of filament mid-print" surprises. Prevention: Store both purchaseWeight and currentWeight fields in Phase 1 schema (even if weight tracking UI comes later).

7. **No schema versioning** — Data structure changes break existing installations. Prevention: Include schemaVersion field from Phase 1, write migration functions for upgrades.

## Implications for Roadmap

Based on research findings, suggested phase structure prioritizes data model integrity and visual UI (the differentiating factors), then adds convenience features, finally advanced integrations.

### Phase 1: Core Inventory Foundation
**Rationale:** Establish data model, basic CRUD, and visual UI foundation. Phase 1 must address critical pitfalls (color data structure, validation, mobile responsive, data export) because these are hard to retrofit later.

**Delivers:** Working inventory app with spool CRUD, visual card grid with color swatches, basic search/filter.

**Addresses (from FEATURES.md):**
- Basic spool CRUD
- Material type, color, brand, weight, purchase date tracking
- Visual card-based UI with large color swatches
- Pre-loaded Bambu Lab color palette
- Pre-loaded brand list
- Search/filter by material, brand, color
- Mobile-responsive layout
- JSON export/import

**Avoids (from PITFALLS.md):**
- Multi-format color storage (name + hex + manufacturer) from day one
- Validation dropdowns for brand/material to prevent duplicates
- Simple single-screen CRUD (no multi-step wizards)
- Mobile-responsive design (workshop use case)
- Data export for backup (prevents data loss)
- Schema versioning field (enables future migrations)

**Phase 1 must include:**
- SQLite database setup with Drizzle schema
- Static data constants (Bambu colors, brands, materials)
- Server actions for CRUD operations
- Spool card component with visual hierarchy (large color swatch)
- Spool form with dropdowns and color picker
- Basic client-side filtering
- Export/import functionality

### Phase 2: Enhanced UX & Tracking
**Rationale:** Phase 1 delivered MVP. Phase 2 adds convenience features that improve daily usage: better search, location tracking, cost management, enhanced filtering.

**Delivers:** Refined inventory management with advanced search, location tracking, cost analysis, improved filters.

**Uses (from STACK.md):**
- react-hook-form for enhanced form validation
- Zod schemas for complex validation rules
- shadcn/ui additional components (advanced filters, multi-select)

**Implements (from ARCHITECTURE.md):**
- Enhanced filter bar component (multi-field search, visual color grid)
- Location/storage tracking system
- Cost calculation utilities

**Addresses (from FEATURES.md):**
- Spool status (active, stored, empty)
- Cost tracking and per-gram calculations
- Location tracking (shelf, dry box)
- Filament diameter (1.75mm vs 2.85mm)
- Temperature settings (nozzle/bed temp)
- Dark mode
- CSV export
- Enhanced search (multi-field, color family browsing)
- Duplicate merge utility

**Avoids (from PITFALLS.md):**
- Material-specific properties (hygroscopic warnings, storage recommendations)
- Opened date tracking (for filament aging awareness)
- Purchase URL tracking (for reordering)

### Phase 3: Advanced Integrations
**Rationale:** Core inventory is solid (Phase 1+2). Phase 3 adds optional advanced features that integrate with external systems or add complex tracking.

**Delivers:** Optional printer integration, usage tracking, offline support, cloud sync.

**Addresses (from FEATURES.md):**
- Bambu Lab printer integration (AMS status, print job tracking)
- Filament usage tracking per print
- Print history
- Low stock alerts
- PWA with offline support
- Cloud sync across devices
- QR code labels for scanning
- Weight tracking via printer integration

**Notes:**
- Phase 3 features are "nice to have" not "must have"
- User can defer indefinitely if basic inventory meets needs
- Each feature in Phase 3 is independently valuable (can pick and choose)

### Phase Ordering Rationale

**Why Phase 1 before Phase 2:**
- Data model must be correct first (color structure, validation, schema versioning). Retrofitting is expensive.
- Visual UI is the core differentiator. Without large color swatches and responsive design, app doesn't solve the user problem.
- Export/import prevents data loss incidents that destroy user trust.

**Why Phase 2 before Phase 3:**
- Location tracking and cost management are higher value than printer integration for most users.
- Enhanced search/filter improves daily usage; printer integration is "cool" but not essential.
- Phase 2 has lower technical risk (no external APIs, no complex integrations).

**Dependency chain:**
- Phase 3 printer integration requires Phase 1 weight tracking fields (even if UI comes later).
- Phase 3 print history requires Phase 2 spool status and location tracking.
- Phase 2 duplicate merge requires Phase 1 validation logic.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3 (Bambu Lab integration):** Bambu Connect API documentation may have changed since training cutoff (January 2025). Need to verify current API capabilities, authentication flow, AMS status endpoints.
- **Phase 3 (QR code workflow):** Need to research optimal QR code libraries, mobile scanning UX patterns, label printing workflows.

**Phases with standard patterns (skip research-phase):**
- **Phase 1:** Next.js + SQLite + Drizzle is well-documented. Standard CRUD patterns, no novel integration.
- **Phase 2:** Search/filter, location tracking, cost calculation are standard web app features. Established patterns available.

**Recommended action:**
- Proceed directly to requirements for Phase 1 and Phase 2.
- Trigger `/gsd:research-phase` when reaching Phase 3 planning to verify Bambu Lab API current state.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Next.js + SQLite + Drizzle is proven pattern for personal CRUD apps. All libraries mature and well-documented. |
| Features | LOW | Research conducted without web search tools. Based on training data only. Bambu Lab ecosystem may have evolved significantly in 2025-2026. Spoolman (popular open-source tool) features unknown. |
| Architecture | HIGH | Three-layer architecture (UI → Server Actions → SQLite) is standard for Next.js apps. Component boundaries clear, patterns well-established. |
| Pitfalls | MEDIUM-HIGH | Pitfalls derived from general web development and inventory app patterns. Domain-specific pitfalls (color accuracy, material properties) based on 3D printing knowledge. High confidence in identified risks, medium confidence that list is complete. |

**Overall confidence:** MEDIUM-HIGH

- Stack and Architecture are solid (HIGH confidence).
- Features research is the weak point (LOW confidence)—limited to training data, no web verification.
- Pitfalls research is strong on general patterns, but domain-specific issues may exist that weren't identified.

### Gaps to Address

**Feature landscape uncertainty (HIGH priority):**
- Spoolman current features (most popular open-source filament manager)—is it solving problems this app doesn't address?
- Bambu Lab official tools—has Bambu released native filament management in Bambu Studio or Handy app?
- Community expectations from 2025-2026—what features became "table stakes" in the past year?

**How to handle:**
- Accept LOW confidence for features in Phase 1.
- Focus on user's stated requirements (card UI, color swatches, Bambu palette, brand list).
- Build flexible data model that can accommodate discovered features later.
- Plan for Phase 1 user testing/feedback before committing to Phase 2 scope.

**Bambu Lab integration specifics (MEDIUM priority):**
- Bambu Connect API availability, authentication, rate limits
- AMS status data format
- Print job data structure
- Official vs community integration approaches

**How to handle:**
- Defer to Phase 3 research using `/gsd:research-phase` command.
- Phase 1 and Phase 2 don't depend on this knowledge.

**Color accuracy representation (LOW priority):**
- How other tools handle "hex code doesn't match physical spool" problem
- Whether photo uploads or color family tags are more effective
- User expectations for color matching

**How to handle:**
- Start with manufacturer hex codes (best available data).
- Add disclaimer in UI about color approximation.
- Gather feedback in Phase 1 testing, iterate in Phase 2.

**Data migration patterns (LOW priority):**
- Best practices for SQLite schema migrations in Next.js apps
- How to handle breaking changes in deployed local apps
- Whether to use Drizzle Kit migrations or custom scripts

**How to handle:**
- Follow Drizzle ORM migration documentation.
- Include schemaVersion field from Phase 1.
- Test migration path with sample data before each release.

## Sources

### Primary (HIGH confidence)
- Next.js official documentation — App Router, Server Actions, API routes
- Drizzle ORM documentation — SQLite integration, schema design
- shadcn/ui component library — UI patterns for forms, cards, dialogs

### Secondary (MEDIUM confidence)
- Training data on inventory management best practices — CRUD patterns, data modeling
- Training data on 3D printing domain knowledge — filament types, material properties, common user workflows
- Training data on single-user web app architecture patterns — local-first, SQLite usage, responsive design

### Tertiary (LOW confidence)
- Inference about Bambu Lab ecosystem — based on pre-2025 knowledge, may be outdated
- Inference about Spoolman features — based on general open-source inventory tools, not verified
- Inference about community preferences — based on historical patterns, not current discussions

**Critical limitation:** Research conducted WITHOUT web search tools (WebSearch, WebFetch unavailable). All findings are pre-January 2025 training data. Feature landscape and community expectations likely evolved in 2025-2026.

**Verification recommended:**
1. Manual search: Spoolman GitHub repository (check current features, issues, roadmap)
2. Manual search: r/3Dprinting and r/BambuLab subreddits (check community feature requests)
3. Manual search: Bambu Lab official documentation (check for native filament management tools)
4. Manual search: "filament inventory app 2025" (check for new tools launched recently)

---
*Research completed: 2026-02-11*
*Ready for roadmap: yes*
