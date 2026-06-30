# Migrate Elementor to Oxygen

**Version:** 2.0.0
**Updated:** 2026-06-30
**Freshly updated:** v2.0.0 wires in current Respira safety and precision. Pre-migration now inventories source pages with `respira_find_builder_targets`. Every write is preceded by a `respira_get_snapshot`, and the existing draft-duplicate path is kept. After the initial `respira_inject_builder_content`, validation issues (column widths, broken refs) are corrected surgically with `respira_find_element` + `respira_update_element` (and `respira_batch_update` for multi-element or multi-page fixes) instead of re-injecting whole pages. Snapshot restore and draft deletion are now explicit rollback paths. Reflects the current 16 supported builders.

Converts Elementor-built WordPress pages to Oxygen Builder. Reads Elementor's JSON widget tree from post meta, maps each widget to its Oxygen component equivalent, generates a migration plan for approval, and writes Oxygen content to the target pages. Use this skill whenever someone wants to move from Elementor to Oxygen, switch to Oxygen's developer-oriented builder, or rebuild Elementor pages in Oxygen.

## What This Skill Does

Oxygen is a fundamentally different kind of builder than Elementor — it outputs clean HTML/CSS without wrapper divs, gives direct access to CSS properties, and thinks in terms of components rather than widgets. This migration requires not just content transfer but a philosophical shift: Elementor's widget-based approach maps to Oxygen's component-based architecture where you have more control but less hand-holding. Both Elementor and Oxygen are among the 16 page builders Respira reads and writes natively, so extraction and injection run through the same builder-aware tooling Respira uses everywhere else.

**Handles:**
- Section/Column layouts → Oxygen Section/Columns/Div components
- Text Editor, Heading → Oxygen Text and Heading components
- Image, Video, Button → native Oxygen equivalents
- Icon, Icon Box → Oxygen icon components
- Tabs, Accordion → Oxygen interactive components
- Spacer, Divider → CSS spacing or Oxygen separator
- Google Maps → Oxygen map component
- Code Block, Custom HTML → Oxygen Code Block
- Image Gallery → Oxygen Gallery component
- Custom CSS → Oxygen's stylesheet or custom CSS fields
- Responsive settings → Oxygen media query breakpoints

**Preserves:**
- All text content, headings, and inline formatting
- Image URLs, alt text, captions, and links
- Typography settings (mapped to Oxygen's CSS-based typography controls)
- Color values (hex, rgb, rgba)
- Spacing values (margin, padding)
- Background images and gradients
- Border and shadow CSS properties
- Link URLs and targets
- CSS classes

## What This Skill Does NOT Do

- **Third-party Elementor addons** — Essential Addons, JetElements, Crocoblock widgets are flagged for manual migration. Oxygen has its own ecosystem of components.
- **Elementor Pro dynamic tags** — Oxygen has powerful dynamic data capabilities but with a completely different interface. Dynamic content is flagged for manual setup.
- **Theme Builder templates** — Elementor's template system is separate from Oxygen's template system. Templates need to be recreated in Oxygen.
- **Form widgets** — Elementor forms need Oxygen's form component or a third-party solution.
- **Popup content** — Must be rebuilt using Oxygen's modal/lightbox functionality.
- **WooCommerce widgets** — Oxygen has its own WooCommerce components that must be configured independently.
- **Motion effects and animations** — Oxygen uses CSS animations directly; Elementor's motion effects don't map 1:1.
- **Responsive precision** — Oxygen uses explicit media query breakpoints (1120px, 992px, 768px, 480px by default) which differ from Elementor's breakpoints.

## Requirements

- Respira for WordPress plugin installed and connected
- MCP connection active (desktop or WebMCP)
- Elementor plugin active (to read source content)
- Oxygen Builder installed and active (to write target content)
- Read access to scan Elementor content
- Write access to create duplicates with Oxygen content

## Trigger Phrase

- "migrate elementor to oxygen"

## Alternative Triggers

- "convert elementor to oxygen"
- "switch from elementor to oxygen"
- "rebuild elementor in oxygen"
- "move from elementor to oxygen"
- "elementor to oxygen migration"

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
- **Widget types** are in the `widgetType` field
- **Responsive settings** use suffixes: `_tablet`, `_mobile`
- **CSS** cached in `_elementor_css` post meta
- **Page settings** in `_elementor_page_settings`
- **Global widgets** reference templates via `templateID`

Read Elementor content via `respira_extract_builder_content` with `builder=elementor`.

## Target Builder: Oxygen

Oxygen stores content in the `ct_builder_shortcodes` post meta field. Despite the name, modern Oxygen uses a JSON-based structure internally.

Key Oxygen specifics:
- Components include: `ct_section`, `ct_row`, `ct_column`, `ct_div_block`, `ct_headline`, `ct_text_block`, `ct_image`, `ct_link_button`
- Oxygen outputs clean HTML — minimal wrapper divs, direct CSS properties
- CSS is stored per-component with explicit property names (not shorthand)
- Responsive design uses media query breakpoints: default, 1120px, 992px, 768px, 480px
- Oxygen's ID system uses numeric component IDs
- Reusable parts are stored as `ct_template` post type
- Oxygen disables the theme — it controls all output directly

Write Oxygen content via `respira_inject_builder_content` with `builder=oxygen`.

## Execution Workflow

### Phase 1: Pre-Migration Audit

1. Verify Respira + MCP connection via `respira_get_site_context`. If unavailable, stop and show setup guidance.
2. Confirm Elementor is active via `respira_list_plugins`.
3. Confirm Oxygen is installed and active via `respira_list_plugins`.
4. **Important**: Note that Oxygen disables the WordPress theme. Verify the user understands this architectural difference.
5. Inventory and scope the source pages with `respira_find_builder_targets` (builder=elementor) — a fast, ranked list of every Elementor-built page/post before you touch anything. Fall back to `respira_list_pages` / `respira_list_posts` + `respira_get_builder_info` to confirm builder per item where needed.
6. For each Elementor page, extract content via `respira_extract_builder_content` with `builder=elementor`
7. Build an inventory:
   - Total pages/posts using Elementor
   - Widget types used (frequency count)
   - Third-party addon widgets detected
   - Dynamic tags and global widgets
   - Layout complexity per page
   - Estimated migration difficulty (simple/moderate/complex)

### Phase 2: Migration Plan

Present a migration plan that acknowledges the architectural differences:

```
## Elementor → Oxygen Migration Plan

### Architectural Note
Oxygen takes full control of your site's output — it disables your WordPress
theme entirely. This is a significant architectural change from Elementor,
which works alongside your theme. Plan accordingly for headers, footers,
and archive templates.

### Site Inventory
- Total Elementor pages: X
- Total widgets to convert: X
- Auto-convertible: X (Y%)
- Manual attention: X (Y%)

### Component Mapping Summary
| Elementor Widget  | Oxygen Component | Status |
|------------------|-----------------|--------|
| heading          | ct_headline     | Auto   |
| text-editor      | ct_text_block   | Auto   |
| image            | ct_image        | Auto   |
| button           | ct_link_button  | Auto   |
| section/columns  | ct_section/row  | Auto   |
| [addon widget]   | —               | Manual |

### Page-by-Page Plan
1. **[Page Title]** — X widgets, [complexity]
   - Auto-convertible: X
   - Needs attention: [details]
2. ...

### Post-Migration Requirements
- Oxygen templates needed for: header, footer, archive, single post
- [Any theme-dependent features that need Oxygen equivalents]
```

Ask for confirmation:
> Oxygen is a powerful but different paradigm from Elementor. Your originals stay safe.
> 1. Migrate all pages
> 2. Migrate specific pages
> 3. Start with a test page (recommended)
> 4. Just keep this plan

### Phase 3: Page-by-Page Migration

For each approved page:

1. Read full Elementor content via `respira_extract_builder_content` with `builder=elementor`
2. Walk the Elementor JSON tree and map:
   - Section → `ct_section`
   - Column → `ct_column` within `ct_row`
   - heading → `ct_headline` (map `header_size` to tag, `title` to text)
   - text-editor → `ct_text_block` (preserve HTML content)
   - image → `ct_image` (map src, alt, dimensions)
   - button → `ct_link_button` (map label, URL, target)
   - Map CSS properties directly (Oxygen uses explicit CSS, not abstracted settings)
   - Convert Elementor responsive suffixes to Oxygen media query breakpoint keys
   - Resolve global widgets to inline content
   - Flag unmappable widgets
3. Generate valid Oxygen component structure
4. Create a duplicate via `respira_create_page_duplicate` or `respira_create_post_duplicate`
5. Before writing, take a snapshot with `respira_get_snapshot` so the duplicate's pre-write state can be restored if anything goes wrong
6. Write Oxygen content to the duplicate via `respira_inject_builder_content` with `builder=oxygen`
7. Surgical fix pass — if the injected page has validation issues (collapsed column widths, broken parent refs, a misconverted component), do not re-inject the whole page. Locate the specific element with `respira_find_element` and correct it with `respira_update_element`. For repeated fixes across many components or several pages, batch them with `respira_batch_update`
8. Report status

### Phase 4: Post-Migration Verification

1. Summarize all migrations:
   - Pages migrated, components created, items flagged
2. For each migrated page:
   - Link to edit in Oxygen
   - Flagged items list
   - CSS property notes (where Oxygen's approach differs)
3. Post-migration checklist:
   - [ ] Open each duplicate in Oxygen editor
   - [ ] Verify layout structure and component hierarchy
   - [ ] Check responsive at each Oxygen breakpoint (1120px, 992px, 768px, 480px)
   - [ ] Verify images and media
   - [ ] Test links and buttons
   - [ ] Recreate flagged elements manually
   - [ ] Set up Oxygen templates for header/footer if not yet done
   - [ ] Review Oxygen's clean HTML output
   - [ ] Compare with Elementor original side-by-side

## Safety Model

- Read-only analysis first — full content scan before any changes
- Explicit user confirmation required before creating duplicates
- Original Elementor pages are never modified or deleted
- All migrated content goes to draft duplicates only
- Never auto-publishes migrated pages
- Takes a `respira_get_snapshot` of each duplicate before any write, so its pre-write state can be restored
- Two explicit rollback paths: restore the snapshot with `respira_restore_snapshot`, or delete the draft duplicates entirely with `respira_delete_page` / `respira_delete_post`
- Surgical fixes (`respira_find_element` + `respira_update_element`, or `respira_batch_update`) replace whole-page re-injection, so corrections stay scoped and reversible
- Warns about Oxygen's theme-disabling behavior upfront

## Honest Disclaimer

This skill converts Elementor page content to Oxygen format and creates draft duplicates for review.

It cannot:
- Migrate third-party Elementor addon widgets
- Auto-convert dynamic tags to Oxygen dynamic data
- Guarantee pixel-perfect visual match
- Migrate theme builder templates or popups
- Set up Oxygen's global templates (header, footer, etc.)
- Replace visual QA review

It can:
- Convert 80-90% of standard Elementor widgets to Oxygen components
- Produce cleaner HTML output than Elementor
- Preserve all text content, images, links, and core styling
- Save significant rebuilding time
- Flag everything needing manual attention
- Keep original pages untouched

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
- `skill_slug = migrate-elementor-to-oxygen`
- site/version context
- duration and success
- pages migrated, components created, items flagged counts
- tools used

Never block user flow on telemetry failure.

## Related Skills

- WordPress Site DNA (understand site structure before migrating)
- Internal Link Builder (verify internal links post-migration)
- SEO & AEO Amplifier (verify SEO preservation post-migration)
- Technical Debt Audit (clean up post-migration)

---

Built by Respira Team
https://respira.press/skills/migrate-elementor-to-oxygen
