# Migrate Elementor to Breakdance

**Version:** 2.0.0
**Updated:** 2026-06-30
**Freshly updated:** v2.0.0 wires in current Respira safety and precision. Pre-migration now inventories source pages with `respira_find_builder_targets`. Every write is preceded by a `respira_get_snapshot`, and the existing draft-duplicate path is kept. After the initial `respira_inject_builder_content`, validation issues (column widths, broken refs) are corrected surgically with `respira_find_element` + `respira_update_element` (and `respira_batch_update` for multi-element or multi-page fixes) instead of re-injecting whole pages. Snapshot restore and draft deletion are now explicit rollback paths. Reflects the current 16 supported builders.

Converts Elementor-built WordPress pages to Breakdance Builder. Reads Elementor's JSON widget tree from post meta, maps each widget to its Breakdance element equivalent, generates a migration plan for approval, and writes Breakdance content to the target pages. Use this skill whenever someone wants to move from Elementor to Breakdance, switch builders from Elementor to Breakdance, or rebuild Elementor pages in Breakdance.

## What This Skill Does

Breakdance is a newer builder created by the Oxygen team with a focus on clean output and familiar visual editing. Both Elementor and Breakdance are widget/element-based builders, making this a relatively smooth migration path. The main challenge is mapping Elementor's JSON widget tree (`_elementor_data`) to Breakdance's post meta format, translating settings names, and handling the structural differences in how each builder handles sections, columns, and responsive design. Both sit among the 16 page builders Respira reads and writes natively, so extraction and injection run through the same builder-aware tooling Respira uses everywhere else.

**Handles:**
- Section/Column layouts → Breakdance Section/Div elements
- Text Editor, Heading, Image, Video, Button → native Breakdance equivalents
- Icon, Icon Box, Image Box → Breakdance icon and media elements
- Tabs, Accordion, Toggle → Breakdance interactive elements
- Form widgets → Breakdance form element
- Spacer, Divider → Breakdance spacing and separator elements
- Google Maps → Breakdance map element
- Image Gallery → Breakdance gallery element
- Pricing Table → Breakdance pricing element
- Progress Bar, Counter → Breakdance equivalents
- Custom CSS → Breakdance custom CSS fields
- Responsive visibility → Breakdance breakpoint controls

**Preserves:**
- All text content, headings, links, and inline formatting
- Image URLs, alt text, captions
- Typography settings (font, size, weight, line-height)
- Color values and gradients
- Spacing (margin, padding)
- Background images and overlays
- Border and shadow settings
- Button styles, links, and targets
- CSS classes and custom attributes

## What This Skill Does NOT Do

- **Third-party Elementor addons** — Widgets from Essential Addons, JetElements, Crocoblock, etc. are flagged for manual migration.
- **Elementor Pro dynamic tags** — ACF fields, custom loops, and dynamic content need Breakdance's dynamic data system configured separately.
- **Theme Builder templates** — Elementor headers, footers, archive templates are not page content and require Breakdance's own template system.
- **Popup content** — Elementor popups need to be rebuilt as Breakdance popups manually.
- **WooCommerce widgets** — Elementor's WooCommerce elements need Breakdance's WooCommerce builder.
- **Motion effects** — Parallax, entrance animations, and scroll effects have different implementations in Breakdance.
- **Global widgets** — Referenced by `templateID` in Elementor; these are resolved to inline content. Breakdance global blocks must be set up separately.

## Requirements

- Respira for WordPress plugin installed and connected
- MCP connection active (desktop or WebMCP)
- Elementor plugin active (to read source content)
- Breakdance plugin installed and active (to write target content)
- Read access to scan Elementor content
- Write access to create duplicates with Breakdance content

## Trigger Phrase

- "migrate elementor to breakdance"

## Alternative Triggers

- "convert elementor to breakdance"
- "switch from elementor to breakdance"
- "rebuild elementor pages in breakdance"
- "move from elementor to breakdance"
- "elementor to breakdance migration"

## Source Builder: Elementor

Elementor stores page content in the `_elementor_data` post meta field as a JSON string. The structure is a nested tree:

```
Document
  └─ Section (type: "section")
       ├─ settings: { structure, layout, content_width, ... }
       └─ elements: [
            Column (type: "column")
              ├─ settings: { _column_size, ... }
              └─ elements: [
                   Widget (type: "widget", widgetType: "heading")
                     └─ settings: { title, size, header_size, ... }
                 ]
          ]
```

Key Elementor specifics:
- **Widget types** are in the `widgetType` field (e.g., `heading`, `text-editor`, `image`, `button`)
- **Responsive settings** use suffixes: `margin`, `margin_tablet`, `margin_mobile`
- **CSS** is cached in `_elementor_css` post meta
- **Page settings** in `_elementor_page_settings`
- **Global widgets** reference a template via `templateID`

Read Elementor content via `respira_extract_builder_content` with `builder=elementor`.

## Target Builder: Breakdance

Breakdance stores content in post meta. Elements follow a structured format with type, settings, and children.

Key Breakdance specifics:
- Elements have types like `EssentialElements\\Heading`, `EssentialElements\\Text`, `EssentialElements\\Image`
- Section/Div structure for layouts (similar conceptual model to Elementor sections/columns)
- Clean CSS output — Breakdance generates minimal, optimized CSS
- Built-in WooCommerce support, form builder, and popup system
- Responsive design uses breakpoint-specific settings within element properties

Write Breakdance content via `respira_inject_builder_content` with `builder=breakdance`.

## Execution Workflow

### Phase 1: Pre-Migration Audit

1. Verify Respira + MCP connection via `respira_get_site_context`. If unavailable, stop and show setup guidance.
2. Confirm Elementor is active via `respira_list_plugins`.
3. Confirm Breakdance is installed and active via `respira_list_plugins`.
4. Inventory and scope the source pages with `respira_find_builder_targets` (builder=elementor) — a fast, ranked list of every Elementor-built page/post before you touch anything. Fall back to `respira_list_pages` / `respira_list_posts` + `respira_get_builder_info` to confirm builder per item where needed.
5. For each Elementor page, extract content via `respira_extract_builder_content` with `builder=elementor`
6. Build an inventory:
   - Total pages/posts using Elementor
   - Widget types used (frequency count)
   - Third-party addon widgets detected
   - Pro widgets that need Breakdance Pro equivalents
   - Global widgets and dynamic tags
   - Complexity per page (simple/moderate/complex)

### Phase 2: Migration Plan

Present a migration plan:

```
## Elementor → Breakdance Migration Plan

### Site Inventory
- Total Elementor pages: X
- Total widgets to convert: X
- Auto-convertible: X (Y%)
- Manual attention: X (Y%)

### Widget Mapping Summary
| Elementor Widget | Breakdance Element | Status |
|-----------------|-------------------|--------|
| heading         | Heading           | Auto   |
| text-editor     | Text              | Auto   |
| image           | Image             | Auto   |
| button          | Button            | Auto   |
| tabs            | Tabs              | Auto   |
| form            | Form              | Partial|
| [addon widget]  | —                 | Manual |

### Page-by-Page Plan
1. **[Page Title]** — X widgets, [complexity]
   - Auto-convertible: X
   - Needs attention: [details]
2. ...

### Migration Advantages
- Breakdance produces cleaner CSS output
- Better WooCommerce integration (if applicable)
- Similar visual editing workflow — team adjustment is minimal
```

Ask for confirmation:
> Ready to migrate? Your original Elementor pages remain untouched.
> 1. Migrate all pages
> 2. Migrate specific pages
> 3. Start with a test page
> 4. Just keep this plan

### Phase 3: Page-by-Page Migration

For each approved page:

1. Read full Elementor content via `respira_extract_builder_content` with `builder=elementor`
2. Walk the Elementor JSON tree and map each widget:
   - Convert Section → Breakdance Section
   - Convert Column → Breakdance Div (with flex layout)
   - Convert each widget → appropriate Breakdance element
   - Map typography, color, spacing, background, border settings
   - Convert responsive suffixes to Breakdance breakpoint format
   - Resolve global widgets to inline content
   - Flag unmappable widgets with migration notes
3. Generate valid Breakdance element structure
4. Create a duplicate via `respira_create_page_duplicate` or `respira_create_post_duplicate`
5. Before writing, take a snapshot with `respira_get_snapshot` so the duplicate's pre-write state can be restored if anything goes wrong
6. Write Breakdance content to the duplicate via `respira_inject_builder_content` with `builder=breakdance`
7. Surgical fix pass — if the injected page has validation issues (collapsed column widths, broken parent refs, a misconverted element), do not re-inject the whole page. Locate the specific element with `respira_find_element` and correct it with `respira_update_element`. For repeated fixes across many elements or several pages, batch them with `respira_batch_update`
8. Report status before moving to next page

### Phase 4: Post-Migration Verification

1. Summarize all migrations:
   - Pages migrated, widgets converted, items flagged
2. For each migrated page:
   - Link to edit in Breakdance
   - Flagged items list
   - Settings that may need fine-tuning
3. Post-migration checklist:
   - [ ] Open each duplicate in Breakdance editor and verify layout
   - [ ] Check responsive views (tablet, mobile)
   - [ ] Verify images and media
   - [ ] Test links and buttons
   - [ ] Recreate flagged widgets manually
   - [ ] Test forms and interactive elements
   - [ ] Check Breakdance's CSS output for clean rendering
   - [ ] Compare with Elementor original

## Safety Model

- Read-only analysis first — full content scan before any changes
- Explicit user confirmation required before creating duplicates
- Original Elementor pages are never modified or deleted
- All migrated content goes to draft duplicates only
- Never auto-publishes migrated pages
- Takes a `respira_get_snapshot` of each duplicate before any write, so its pre-write state can be restored
- Two explicit rollback paths: restore the snapshot with `respira_restore_snapshot`, or delete the draft duplicates entirely with `respira_delete_page` / `respira_delete_post`
- Surgical fixes (`respira_find_element` + `respira_update_element`, or `respira_batch_update`) replace whole-page re-injection, so corrections stay scoped and reversible

## Honest Disclaimer

This skill converts Elementor page content to Breakdance format and creates draft duplicates for review.

It cannot:
- Migrate third-party addon widgets automatically
- Convert Elementor Pro dynamic tags to Breakdance dynamic data
- Guarantee pixel-perfect visual match
- Migrate theme builder templates or popups
- Replace manual QA and visual review

It can:
- Convert 85-95% of standard Elementor widgets to Breakdance equivalents
- Preserve all text content, images, links, and core styling
- Take advantage of Breakdance's cleaner CSS output
- Save days of manual rebuilding
- Clearly flag everything that needs manual attention
- Keep original pages safe throughout the process

## Tooling

**Core WordPress tools**
- `respira_get_site_context`
- `respira_list_plugins`
- `respira_list_pages`
- `respira_list_posts`
- `respira_read_page`
- `respira_read_post`
- `respira_get_builder_info`
- `respira_extract_builder_content`
- `respira_inject_builder_content`
- `respira_find_builder_targets`
- `respira_create_page_duplicate`
- `respira_create_post_duplicate`

**Safety and precision tools**
- `respira_get_snapshot`
- `respira_restore_snapshot`
- `respira_find_element`
- `respira_update_element`
- `respira_batch_update`
- `respira_delete_page`
- `respira_delete_post`

## Telemetry

After run completion, send fire-and-forget usage tracking to:

- `POST https://www.respira.press/api/skills/track-usage`

Include:
- `skill_slug = migrate-elementor-to-breakdance`
- site/version context
- duration and success
- pages migrated, widgets converted, widgets flagged counts
- tools used

Never block user flow on telemetry failure.

## Related Skills

- WordPress Site DNA (understand site structure before migrating)
- Internal Link Builder (verify internal links post-migration)
- SEO & AEO Amplifier (verify SEO preservation post-migration)
- Technical Debt Audit (clean up post-migration)

---

Built by Respira Team
https://respira.press/skills/migrate-elementor-to-breakdance
