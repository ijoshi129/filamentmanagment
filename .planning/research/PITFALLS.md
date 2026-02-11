# PITFALLS - Filament Management Web App

Common mistakes and critical failures in filament management and personal inventory web applications, with domain-specific prevention strategies.

---

## 1. DATA MODEL PITFALLS

### 1.1 Treating Color as Simple Text Instead of Multi-Format Data

**The Mistake:**
Storing color only as a hex code or only as a name, without considering that users need both visual representation and manufacturer naming conventions.

**Warning Signs:**
- Color picker doesn't match manufacturer swatches
- Users can't find "Matte PLA Black" vs "Basic PLA Black"
- Sorting/filtering by color becomes meaningless
- Color comparison between brands is impossible

**Prevention Strategy:**
- Store color as an object: `{ name, hex, manufacturer, family }`
- Pre-load manufacturer palettes with accurate hex codes (like Bambu Lab colors)
- Allow visual color family grouping (all blues together)
- Support both hex-based and name-based search

**Phase to Address:** Phase 1 (Foundation) - Data model design

---

### 1.2 Not Planning for Partial Spool Tracking

**The Mistake:**
Only tracking full spools without accounting for remaining material, leading to "out of filament mid-print" surprises.

**Warning Signs:**
- Users asking "how much is left?"
- No way to mark spools as "low" or "empty"
- Purchase weight is stored but never decremented
- Print planning fails due to inaccurate inventory

**Prevention Strategy:**
- Store both `purchaseWeight` and `currentWeight` fields
- Add optional `estimatedRemaining` percentage for quick visual feedback
- Include "low stock" threshold warnings
- Consider adding weight update workflow (manual or Bambu Lab AMS integration)

**Phase to Address:** Phase 1 (Foundation) - Include in initial schema, even if weight tracking comes later

---

### 1.3 Ignoring Material-Specific Properties

**The Mistake:**
Treating all filament types identically, when PLA, PETG, TPU, ABS have vastly different storage requirements, print settings, and shelf life.

**Warning Signs:**
- No differentiation between material types in storage recommendations
- Users can't filter by material properties (flexible, support material, etc.)
- No warnings about hygroscopic materials (Nylon, TPU) needing dry storage
- Missing temperature ranges for print planning

**Prevention Strategy:**
- Make `material` a first-class field with enum validation
- Store material properties: `{ type, printTemp, bedTemp, isFlexible, isHygroscopic }`
- Surface storage recommendations per material type
- Enable filtering by material characteristics

**Phase to Address:** Phase 1-2 - Core material field in Phase 1, extended properties in Phase 2

---

### 1.4 Poor Date Handling for Filament Aging

**The Mistake:**
Only storing purchase date without considering opened date, storage conditions, or material degradation timelines.

**Warning Signs:**
- Users don't know which spool to use first
- No "age warning" for moisture-sensitive materials
- Unopened vs opened spools treated identically
- FIFO (First In, First Out) logic is impossible

**Prevention Strategy:**
- Store `purchaseDate` and optional `openedDate`
- Calculate age-based warnings for hygroscopic materials
- Add "sealed" boolean flag for unopened spools
- Sort/highlight spools by age for rotation

**Phase to Address:** Phase 1 - Purchase date, Phase 2 - Opened date tracking

---

## 2. USER EXPERIENCE PITFALLS

### 2.1 Over-Complicated CRUD Workflows

**The Mistake:**
Requiring 15 clicks and 3 modals to add a single spool, when users often add multiple spools at once (bulk purchases).

**Warning Signs:**
- Users complain about data entry time
- High abandonment on "Add Spool" flow
- Friction leads to out-of-date inventory
- Feature requests for "quick add" or bulk import

**Prevention Strategy:**
- Single-screen form for add/edit (no multi-step wizards for this simple domain)
- Smart defaults: pre-select brand/material from previous entry
- Keyboard shortcuts for power users
- Consider "duplicate spool" quick action for multi-spool purchases

**Phase to Address:** Phase 1 - Keep initial CRUD simple, Phase 2 - Add convenience features

---

### 2.2 Poor Visual Hierarchy in Card-Based Layouts

**The Mistake:**
Showing all fields equally in cards, making it hard to distinguish spools at a glance. Color swatch too small, critical info buried.

**Warning Signs:**
- Users squint to find the right spool
- Color is not immediately obvious despite being primary differentiator
- Material type hidden in secondary text
- Can't tell remaining quantity without clicking

**Prevention Strategy:**
- Large color swatch (at least 60x60px) as visual anchor
- Material badge prominently displayed
- Brand + color name as card title
- Remaining weight/percentage as visual indicator (progress bar or badge)
- De-emphasize purchase date, location in secondary position

**Phase to Address:** Phase 1 - Core visual hierarchy, Phase 2 - Refinements based on usage

---

### 2.3 No Mobile Consideration for Workshop Use

**The Mistake:**
Building desktop-only UI when users frequently check inventory from their printer (across the room/garage) on phones.

**Warning Signs:**
- Users request mobile app
- Complaints about usability on tablets
- Feature requests for QR codes or NFC tags
- Users take screenshots instead of using the app in the workshop

**Prevention Strategy:**
- Responsive design from day one (cards stack on mobile)
- Touch-friendly targets (44x44px minimum)
- Quick view/search for "do I have X material?" questions
- Consider PWA for offline access in workshop environments

**Phase to Address:** Phase 1 - Responsive layout, Phase 3 - PWA/offline features

---

### 2.4 Search and Filter Misalignment

**The Mistake:**
Providing generic text search when users think in terms of "I need black PETG" or "show me all Bambu Lab spools."

**Warning Signs:**
- Users type "black" expecting to filter by color
- Search for "PETG" returns nothing (case sensitivity issues)
- Can't combine filters (brand AND material AND color)
- No visual color-based browsing

**Prevention Strategy:**
- Multi-field search across brand, material, color name
- Quick filters for common queries (by brand, by material, by color family)
- Visual color grid/palette view as alternative to list
- Clear active filters with easy removal

**Phase to Address:** Phase 2 - Enhanced search/filter (Phase 1 should have basic filter)

---

## 3. DATA INTEGRITY PITFALLS

### 3.1 No Validation on Pre-Loaded Data References

**The Mistake:**
Pre-loading brands and colors but allowing free-form text entry, leading to duplicates like "Bambu Lab," "BambuLab," "bambu," "Bambu."

**Warning Signs:**
- Duplicate entries in brand/color lists
- Filtering breaks due to inconsistent naming
- Users can't find their spool because they used different spelling
- Color palette becomes polluted with variations

**Prevention Strategy:**
- Use dropdown/select for brands (with "Other" option + text field)
- Material type should be strict enum (PLA, PETG, ABS, etc.)
- Color selection from manufacturer palette (with custom color fallback)
- Normalize input on save (trim, lowercase comparison)

**Phase to Address:** Phase 1 - Critical for data quality from start

---

### 3.2 Missing Unique Constraints and Duplicate Detection

**The Mistake:**
Allowing users to add the same spool multiple times (same brand, material, color, purchase date) without warning.

**Warning Signs:**
- Users ask "did I already enter this?"
- Inventory counts are inflated
- No merge/deduplication workflow
- Bulk purchase creates 5 identical entries instead of one with quantity=5

**Prevention Strategy:**
- Show "potential duplicate" warning on save (fuzzy match on brand+material+color)
- Add optional `quantity` field for multiple identical spools
- Provide "merge spools" utility in Phase 2
- Consider unique constraint at DB level (or at least UI validation)

**Phase to Address:** Phase 1 - Duplicate warning, Phase 2 - Merge utility

---

### 3.3 Data Export/Backup Blindspot

**The Mistake:**
Building single-user local app with no export, assuming browser storage is permanent (it's not - cache clears, browser reinstalls destroy data).

**Warning Signs:**
- Users ask "how do I backup my inventory?"
- Feature requests for CSV export
- Data loss incidents from browser cache clearing
- Can't migrate to new device/browser

**Prevention Strategy:**
- JSON export/import from day one
- CSV export for Excel users
- Consider localStorage + periodic JSON download
- Cloud sync is Phase 3+, but export/import is Phase 1 essential

**Phase to Address:** Phase 1 - Basic JSON export/import, Phase 2 - CSV, Phase 3+ - Cloud sync

---

## 4. TECHNICAL DEBT PITFALLS

### 4.1 localStorage Scalability Assumptions

**The Mistake:**
Assuming localStorage is sufficient forever, hitting 5-10MB limits after 200-300 spools with image attachments or extensive history.

**Warning Signs:**
- QuotaExceededError in console
- App slows down with >100 entries
- Users with large inventories experience crashes
- No pagination or lazy loading

**Prevention Strategy:**
- Plan for IndexedDB migration if image storage needed
- Set realistic expectations (localStorage good for 500-1000 text records)
- Implement pagination/virtualization early if scaling expected
- Monitor storage usage, warn users approaching limits

**Phase to Address:** Phase 1 - Use localStorage wisely, Phase 2 - IndexedDB if needed

---

### 4.2 Hardcoded Bambu Lab Specific Logic

**The Mistake:**
Tightly coupling to Bambu Lab (P1S specific features, AMS assumptions) making it unusable for multi-printer households or other brands.

**Warning Signs:**
- Feature requests for "I also have a Prusa/Creality"
- AMS slot tracking doesn't apply to non-Bambu users
- Color palette assumes Bambu ecosystem exclusively
- User base artificially limited

**Prevention Strategy:**
- Keep printer-agnostic core (any 3D printer uses filament)
- Bambu Lab features as optional enhancements (AMS integration in Phase 3)
- Pre-loaded brand list includes multi-brand options from day one
- Allow custom brand additions

**Phase to Address:** Phase 1 - Agnostic foundation, Phase 3 - Bambu-specific integrations

---

### 4.3 No Versioning Strategy for Data Schema

**The Mistake:**
Not planning for schema changes, leading to app crashes when adding new fields or changing data structure in future updates.

**Warning Signs:**
- Users can't upgrade without losing data
- Manual migration scripts for each version
- Breaking changes in storage format
- Feature additions blocked by legacy data concerns

**Prevention Strategy:**
- Add `schemaVersion` field to stored data from day one
- Write migration functions for schema upgrades
- Test upgrades with real data before release
- Document data structure changes in changelog

**Phase to Address:** Phase 1 - Include versioning from start

---

## 5. DOMAIN-SPECIFIC PITFALLS

### 5.1 Ignoring Real-World Filament Organization

**The Mistake:**
Not supporting how users actually organize filament (dry boxes, drawers, AMS slots, shelves) leading to physical vs digital inventory mismatch.

**Warning Signs:**
- Users ask "which dry box is this in?"
- Feature requests for location/storage tracking
- Can't find physical spool even though app says it exists
- AMS-loaded vs stored distinction missing

**Prevention Strategy:**
- Add optional `location` field (Dry Box A, AMS Slot 1, Shelf B, etc.)
- Support custom location labels
- Filter/sort by location
- Visual indicators for "currently loaded in printer"

**Phase to Address:** Phase 2 - Location tracking

---

### 5.2 No Print History or Usage Tracking

**The Mistake:**
Treating inventory as static, not connecting to actual printing activity, making weight tracking manual guesswork.

**Warning Signs:**
- Users can't remember which spool was used for which print
- No print success/failure tracking per filament
- Can't identify problem spools (moisture, quality issues)
- Weight updates are pure guesswork

**Prevention Strategy:**
- Phase 3 feature: Link spools to print jobs
- Store notes/ratings per spool (quality, issues, settings)
- Manual weight update after prints if auto-tracking unavailable
- Print history becomes data for future purchases

**Phase to Address:** Phase 3 - Print history integration (out of scope for MVP)

---

### 5.3 Poor Color Accuracy Representation

**The Mistake:**
Trusting manufacturer hex codes without considering that screens vary wildly, and physical filament color doesn't match RGB values.

**Warning Signs:**
- Users complain "this doesn't look like the actual spool"
- Color matching expectations vs reality mismatch
- No disclaimer about color representation limits
- Users take photos of spools instead of using app colors

**Prevention Strategy:**
- Use manufacturer-provided hex codes when available (like Bambu Lab palette)
- Add disclaimer: "Colors approximate, may vary by screen/light"
- Allow users to upload spool photo for reference
- Consider color family tags (Warm Red, Cool Blue) in addition to hex

**Phase to Address:** Phase 1 - Use best-available hex codes with disclaimer, Phase 2 - Photo uploads

---

### 5.4 Overlooking Filament Subscription/Reorder Workflows

**The Mistake:**
Not helping users answer "when should I reorder?" or "do I have enough for my next project?" which is half the reason for inventory tracking.

**Warning Signs:**
- Feature requests for "low stock alerts"
- Users ask "where did I buy this?"
- No link to purchase URLs or pricing
- Can't track cost per gram or project budgeting

**Prevention Strategy:**
- Store `purchasePrice` and `purchaseUrl` (optional)
- Calculate cost per gram for budgeting
- "Low stock" threshold with reorder suggestions
- Link to Amazon/manufacturer purchase page

**Phase to Address:** Phase 2 - Purchase tracking, Phase 3 - Reorder alerts

---

## PHASE MAPPING SUMMARY

### Phase 1 (Foundation) - MUST ADDRESS:
- Multi-format color storage (name + hex + manufacturer)
- Material type as first-class field with validation
- Purchase date tracking
- Simple CRUD with good defaults
- Large color swatch visual hierarchy
- Brand/material/color validation and dropdowns
- Duplicate detection warnings
- JSON export/import for data safety
- Schema versioning from day one
- Mobile-responsive layout

### Phase 2 (Enhancement) - SHOULD ADDRESS:
- Opened date and age tracking
- Enhanced search/filter (multi-field, visual color grid)
- Location/storage tracking
- Photo uploads for color reference
- Purchase price and reorder info
- CSV export
- Merge duplicates utility
- Material-specific properties and recommendations

### Phase 3 (Advanced) - NICE TO HAVE:
- Print history and usage tracking
- Bambu Lab AMS integration
- Low stock alerts and reorder automation
- PWA with offline support
- Cloud sync across devices
- Weight tracking via printer integration

---

## CRITICAL SUCCESS FACTORS

1. **Data Quality from Day One:** Validation, normalization, and schema versioning are not refactoring projects - they must be in Phase 1.

2. **Visual Design Matters:** This is an inventory app where color IS the primary key. If users can't instantly find "that blue PETG," the app has failed.

3. **Simple Beats Complete:** Users will tolerate missing advanced features (print history, cloud sync) but will abandon an app that makes basic CRUD painful.

4. **Mobile is Non-Negotiable:** Workshop use cases demand responsive design. Desktop-only is a dealbreaker.

5. **Data Safety is Trust:** A single data loss incident destroys user confidence. Export/import must ship with v1.

---

**Last Updated:** 2026-02-11
**Document Owner:** Project Researcher Agent
**Review Cycle:** Before each phase kickoff
