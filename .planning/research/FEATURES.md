# Feature Landscape

**Domain:** Filament Management / 3D Printing Inventory Apps
**Researched:** 2026-02-11
**Confidence:** LOW (based on training data only - web research tools unavailable)

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Basic spool CRUD | Core function of any inventory system | Low | Create, read, update, delete filament spools |
| Material type tracking | Different materials require different print settings | Low | PLA, PETG, ABS, TPU, etc. Standard dropdown |
| Color tracking | Visual identification is primary way users identify spools | Low | Color name + hex/RGB value |
| Weight tracking | Users need to know how much filament remains | Medium | Initial weight, current weight, or percentage remaining |
| Brand/manufacturer tracking | Users want to know what they're buying again | Low | Text field or dropdown of common brands |
| Visual list/grid view | Users need to see their inventory at a glance | Medium | Cards or table view with color indicators |
| Search/filter | Users with 10+ spools need to find specific ones quickly | Medium | Filter by material, color, brand, or search by name |
| Spool status | Track if spool is active, stored, or empty | Low | Active/In Storage/Empty states |
| Cost tracking | Users want to know inventory value | Low | Purchase price per spool |
| Purchase date | Track when spool was bought for warranty/age | Low | Date field |

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Pre-loaded manufacturer color palettes | Saves manual color entry, ensures accuracy | Medium | Bambu Lab, Polymaker, Prusament palettes with exact hex values |
| Color swatch visualization | Quick visual inventory scanning | Medium | Large color preview cards (user's requirement already includes this) |
| Filament usage tracking per print | Know exactly how much filament was used | High | Requires printer integration or manual logging |
| Low stock alerts | Never run out mid-print | Medium | Threshold-based notifications when weight drops below X grams |
| Printer integration | Automatic updates from printer | High | API integration with Bambu Connect, OctoPrint, etc. |
| Location tracking | Know which shelf/box each spool is on | Low | Text field for physical location |
| QR code labels | Scan to view/update spool quickly | Medium | Generate printable QR codes, mobile scanning |
| Filament drying log | Track when spools were dried (hygroscopic materials) | Medium | Date + duration tracking for materials that absorb moisture |
| Barcode scanning | Quick spool addition via barcode scanner | High | Requires barcode database or manual association |
| Print history | Which spools were used for which prints | High | Requires print job tracking system |
| Filament compatibility notes | Track which materials work well with specific printers | Low | Free-text notes per spool |
| Batch/lot number tracking | Identify quality issues across batches | Low | Text field for manufacturer batch codes |
| Exporting/reporting | CSV export for backup or analysis | Medium | Data export functionality |
| Dark mode | Preference for many users | Low | CSS theme switching |
| Multi-spool projects | Track multiple spools used in one print | High | Many-to-many relationship between spools and prints |
| Temperature settings per material | Quick reference for print settings | Low | Nozzle/bed temp storage per spool type |
| Spool photos | Visual reference beyond color swatch | Medium | Image upload/storage |
| Filament diameter tracking | 1.75mm vs 2.85mm distinction | Low | Dropdown or radio buttons |
| Dry box assignment | Track which spools are in which dry box | Medium | Grouping/container system |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Multi-user authentication | Project is single-user personal tool | Keep simple, no auth system |
| Cloud sync | Adds complexity, hosting costs, privacy concerns | Local-first, optional export for backup |
| Social features | Sharing, profiles, community | Focus on personal inventory management |
| E-commerce integration | Automated ordering/purchasing | Simple cost tracking only, users buy manually |
| Advanced analytics/dashboards | Over-engineering for personal use | Basic stats if needed (total spools, total cost) |
| Mobile app (separate) | Development overhead for single user | Responsive web design instead |
| Print job slicing | Outside core competency | Focus on inventory, not print preparation |
| 3D model library | Feature creep | Inventory management only |
| Printer control | Complex, security concerns | Read-only integration at most |
| Multi-language support | Single user doesn't need it | English only |
| Real-time collaboration | No multi-user need | N/A |
| Marketplace/selling used filament | Scope creep | N/A |

## Feature Dependencies

```
Weight tracking → Low stock alerts (need weight to determine "low")
Spool CRUD → Search/filter (need data to search)
Color tracking → Color swatch visualization (need color data to display)
Pre-loaded palettes → Color tracking (palettes populate color fields)
Printer integration → Filament usage tracking (integration enables automatic tracking)
Filament usage tracking → Print history (usage data feeds history)
QR code labels → Spool CRUD (need spool ID to encode in QR)
Spool photos → Spool CRUD (photos are spool attributes)
Location tracking → Search/filter (location as filterable field)
Dry box assignment → Location tracking (dry box is a type of location)
Multi-spool projects → Print history (projects are historical records)
```

## MVP Recommendation

### Prioritize (Phase 1 - Core Inventory)

1. **Basic spool CRUD** - Foundation of entire app
2. **Material type tracking** - Essential attribute
3. **Color tracking** - Essential attribute
4. **Brand/manufacturer tracking** - Essential attribute
5. **Purchase date tracking** - Essential attribute
6. **Weight tracking** - Essential for knowing inventory status
7. **Visual card-based UI with color swatches** - User's stated requirement, key differentiator
8. **Pre-loaded Bambu Lab color palette** - User's stated requirement, saves data entry
9. **Pre-loaded brand list** - User's stated requirement, improves UX
10. **Search/filter** - Usability requirement once inventory grows

### Prioritize (Phase 2 - Enhanced UX)

1. **Spool status** - Helps organize active vs stored spools
2. **Cost tracking** - Common user request
3. **Location tracking** - Simple text field, high utility
4. **Filament diameter tracking** - Standard field for 3D printing
5. **Temperature settings** - Useful reference data
6. **Dark mode** - Low effort, high satisfaction

### Consider (Future Phases)

- **Low stock alerts** - Useful but requires notification system
- **Filament drying log** - Valuable for PLA/Nylon users but niche
- **QR code labels** - Cool feature but requires print/scan workflow
- **Exporting/reporting** - Good for backup, implement when data model stable
- **Spool photos** - Nice-to-have, but color swatch may be sufficient

### Defer

- **Printer integration** - High complexity, can add later if demand exists
- **Filament usage tracking** - Requires printer integration or manual logging (tedious)
- **Print history** - Requires broader print management system
- **Barcode scanning** - Limited value without barcode database
- **Multi-spool projects** - Edge case for personal use
- **Dry box assignment** - Location field covers this use case

## Complexity Assessment

| Complexity | Features in Category | Risk |
|------------|---------------------|------|
| **Low** | 15 features | Safe for MVP, quick wins |
| **Medium** | 12 features | Moderate effort, plan carefully |
| **High** | 6 features | Defer unless critical value |

## Research Limitations

**CRITICAL NOTE:** This research was conducted WITHOUT access to web tools (WebSearch, WebFetch). All findings are based on training data from before January 2025.

### What's Missing

- Current state of Spoolman (popular open-source tool) in 2026
- New tools launched in 2025-2026
- Feature trends from the past year
- Bambu Lab ecosystem integrations added recently
- Community preferences from recent discussions

### Verification Needed

The following should be verified with web research:

1. **Bambu Lab ecosystem** - Has Bambu released official filament management tools?
2. **Spoolman features** - What's the current feature set of the most popular open-source option?
3. **OctoPrint plugins** - What filament management plugins are popular?
4. **Bambu Handy app** - Does the mobile app have inventory features?
5. **Community expectations** - What do Reddit/Discord users consider "must-have"?

### Confidence Levels by Category

| Category | Confidence | Reason |
|----------|-----------|--------|
| Table stakes | MEDIUM | Core inventory needs are stable, unlikely to have changed dramatically |
| Differentiators | LOW | Innovation happens here; may have missed new trends |
| Anti-features | HIGH | Project constraints (single-user, no auth) are clear |
| Complexity estimates | MEDIUM | Based on general web development experience |

## Sources

**None - web research tools unavailable**

This research is based entirely on training data and should be treated as a starting hypothesis requiring validation. Recommend:

1. Manual research of Spoolman GitHub repository
2. Review of 3D printing subreddits (r/3Dprinting, r/BambuLab)
3. Check Bambu Lab official app features
4. Survey of existing tools (Filament Manager, 3DPrinterOS, etc.)
