# Requirements: Filament Manager

**Defined:** 2026-02-11
**Core Value:** Quickly see what filament you have — by color, brand, and material — so you never guess what's on the shelf.

## v1 Requirements

### Inventory

- [ ] **INV-01**: User can add a new filament spool with brand, material, color, purchase date, and initial weight
- [ ] **INV-02**: User can edit any field on an existing spool
- [ ] **INV-03**: User can delete a spool from inventory
- [ ] **INV-04**: Initial weight defaults to 1KG (1000g) when adding a spool
- [ ] **INV-05**: User can select from pre-loaded Bambu Lab color palette with accurate hex swatches
- [ ] **INV-06**: User can select material type from a dropdown (PLA, PETG, ABS, TPU, ASA, Nylon, etc.)

### Display

- [ ] **DISP-01**: Spools display as visual cards with a large color swatch
- [ ] **DISP-02**: Each card shows material type as a prominent badge
- [ ] **DISP-03**: Each card shows brand, color name, purchase date, and weight

### Organization

- [ ] **ORG-01**: User can filter spools by material type
- [ ] **ORG-02**: User can filter spools by brand
- [ ] **ORG-03**: User can search spools by text across brand, material, and color name

## v2 Requirements

### Inventory Enhancements

- **INV-07**: Pre-loaded brand list (Bambu Lab, Hatchbox, eSUN, Polymaker, etc.) with "Add custom" option
- **INV-08**: Generic color picker for non-Bambu brands
- **INV-09**: Responsive/mobile-optimized layout for workshop use

### Organization Enhancements

- **ORG-04**: Sort spools by date, brand, material, or color
- **ORG-05**: Inventory summary showing spool counts by material and brand

### Data Safety

- **DATA-01**: Export inventory as JSON for backup
- **DATA-02**: Import inventory from JSON backup

## Out of Scope

| Feature | Reason |
|---------|--------|
| Usage tracking / remaining weight | Explicitly deferred by user, revisit after v1 |
| Multi-user / authentication | Single user only, no auth complexity |
| Printer integration (Bambu API) | High complexity, keep it standalone |
| Print history / job logging | Different product scope |
| Cloud sync | Adds backend complexity, hosting costs |
| Mobile native app | Web app works on mobile browsers |
| Barcode/QR scanning | Manual entry sufficient for spool counts < 100 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INV-01 | Phase 2 | Pending |
| INV-02 | Phase 2 | Pending |
| INV-03 | Phase 2 | Pending |
| INV-04 | Phase 1 | Pending |
| INV-05 | Phase 1 | Pending |
| INV-06 | Phase 1 | Pending |
| DISP-01 | Phase 3 | Pending |
| DISP-02 | Phase 3 | Pending |
| DISP-03 | Phase 3 | Pending |
| ORG-01 | Phase 4 | Pending |
| ORG-02 | Phase 4 | Pending |
| ORG-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0

---
*Requirements defined: 2026-02-11*
*Last updated: 2026-02-11 after roadmap creation*
