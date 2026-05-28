---
name: migrate-oxygen-to-bricks
description: Converts Oxygen Builder pages to Bricks by mapping component trees to Bricks JSON elements and creating draft duplicates for review.
license: MIT
metadata:
  author: "Respira for WordPress"
  author_url: https://respira.press
  version: 1.1.0
  mcp-server: respira-wordpress
  category: migration
---

# Migrate Oxygen to Bricks

Full-site migration from Oxygen Builder to Bricks Builder. Audits every Oxygen-built page, maps components to their Bricks equivalents, builds a migration plan for approval, and executes page-by-page conversion into Bricks' JSON format — all through duplicates so your live site stays untouched. Use this skill whenever someone mentions migrating from Oxygen to Bricks, switching from Oxygen to Bricks, converting Oxygen pages to Bricks, or replacing Oxygen with Bricks Builder.

## What This Skill Does

Oxygen and Bricks are both modern, developer-oriented builders with similar mental models — containers, sections, flexbox layouts, dynamic data. This makes Oxygen-to-Bricks one of the most straightforward builder migrations. The structural concepts translate almost 1:1, but the underlying data formats are completely different (Oxygen's JSON shortcodes in `ct_builder_shortcodes` vs. Bricks' JSON array in `_bricks_page_content_2`), so content must be extracted, mapped, and re-encoded.

This skill reads every Oxygen page, extracts the builder content, translates each component to its Bricks equivalent, and writes the result to duplicate pages in Bricks format — giving you a complete parallel version of your site to review before going live.

**Handles:**
- Section → Bricks Section mapping
- Container/Div → Bricks Container mapping
- Heading, Text, Image, Button, Video, Icon components
- Flexbox layout settings (direction, alignment, gap, wrap)
- Column/grid structures
- Custom CSS classes and inline styles
- Link elements and CTAs
- Code blocks and custom HTML
- Repeater/dynamic data placeholders (flagged for manual review)

## What This Skill Does NOT Do

- Migrate Oxygen's Global Styles or Style Sheets — Bricks uses its own theme style system
- Convert Oxygen conditions (visibility rules) — these must be rebuilt in Bricks
- Migrate Oxygen's custom PHP/code block logic — flagged for manual porting
- Recreate Oxygen templates (headers, footers, archives) — Bricks templates are structurally different and must be rebuilt
- Transfer WooCommerce builder templates — product/shop templates need separate handling
- Guarantee pixel-perfect visual parity — some spacing/sizing will need fine-tuning in Bricks

## Requirements

- Respira for WordPress plugin installed and connected
- MCP connection active (desktop or WebMCP)
- Oxygen Builder active on the source site
- Bricks Builder installed on the target site (can be the same site)
- Read access to scan Oxygen content
- Write access to create duplicates with Bricks content

## Trigger Phrase

- "migrate oxygen to bricks"

## Alternative Triggers

- "convert oxygen to bricks"
- "switch from oxygen to bricks"
- "move oxygen pages to bricks"
- "replace oxygen with bricks"
- "oxygen to bricks migration"

## Builder Technical Context

**Source: Oxygen Builder**
- Content stored in post_meta key `ct_builder_shortcodes`
- JSON-based structure encoding nested components
- Read via `respira_extract_builder_content` with `builder=oxygen`
- Components: `ct_section`, `ct_div`, `ct_headline`, `ct_text_block`, `ct_image`, `ct_link_button`, etc.

**Target: Bricks Builder**
- Content stored in post_meta key `_bricks_page_content_2` as a JSON array
- Each element is an object with `id`, `name`, `parent`, `settings`, `children`
- Write via `respira_inject_builder_content` with `builder=bricks`
- Elements: `section`, `container`, `heading`, `text`, `image`, `button`, etc.

## Execution Workflow

### Phase 1: Pre-Migration Audit

1. Verify Respira + MCP connection via `respira_get_site_context`. If unavailable, stop and show setup guidance.
2. Detect Oxygen presence via `respira_get_builder_info` or `respira_list_plugins`.
3. Inventory all Oxygen-built content:
   - `respira_list_pages` and `respira_list_posts` — identify all content
   - `respira_find_builder_targets` with `builder=oxygen` — find Oxygen-managed pages
4. For each Oxygen page, extract content:
   - `respira_extract_builder_content` with `builder=oxygen`
   - Catalog: component types used, nesting depth, custom CSS, dynamic data usage, code blocks
5. Produce an **Audit Report**:
   - Total pages/posts using Oxygen
   - Component type frequency (how many sections, headings, images, etc.)
   - Complexity flags (custom PHP, conditions, dynamic data, WooCommerce templates)
   - Estimated migration difficulty per page (simple / moderate / complex)

### Phase 2: Migration Plan

Present a structured migration plan:

```
## Oxygen → Bricks Migration Plan

### Site Overview
- Total Oxygen pages: X
- Simple pages (direct mapping): X
- Moderate pages (some manual review needed): X
- Complex pages (significant manual work): X

### Component Mapping
| Oxygen Component | Bricks Equivalent | Notes |
|---|---|---|
| ct_section | section | Direct mapping |
| ct_div | container | Direct mapping |
| ct_headline | heading | Direct mapping |
| ... | ... | ... |

### Migration Order
1. [Page Title] — Simple — estimated 2 min
2. [Page Title] — Moderate — estimated 5 min
...

### Items Requiring Manual Attention
- [Page X] — Custom PHP code block (line 45)
- [Page Y] — Oxygen condition logic
- Global Styles — must be recreated in Bricks Theme Styles
```

Then ask:

> Here's the migration plan. Would you like me to:
> 1. Migrate all pages (creates duplicates for review)
> 2. Migrate only simple pages first
> 3. Migrate specific pages you choose
> 4. Just keep this as a reference — no changes

Wait for explicit confirmation before proceeding.

### Phase 3: Page-by-Page Migration

For each approved page:

1. Extract Oxygen content via `respira_extract_builder_content` with `builder=oxygen`
2. Map each Oxygen component to its Bricks equivalent:
   - Translate component types (ct_section → section, ct_div → container, etc.)
   - Convert layout properties (flexbox settings, spacing, sizing)
   - Map CSS classes and inline styles
   - Preserve text content, image URLs, link targets
   - Flag any unmappable components (custom PHP, conditions) with inline comments
3. Build the Bricks JSON array structure
4. Create a duplicate via `respira_create_page_duplicate` or `respira_create_post_duplicate`
5. Inject Bricks content via `respira_inject_builder_content` with `builder=bricks`
6. Log the migration result (success, warnings, manual review items)

### Phase 4: Post-Migration Verification

1. Summarize all migrated pages with status:
   - Clean migrations (no issues)
   - Migrations with warnings (flagged items needing review)
   - Failed migrations (if any)
2. List all manual review items:
   - Custom PHP code blocks that need porting
   - Dynamic data references that need reconnecting
   - Oxygen conditions that need rebuilding in Bricks
3. Provide review instructions:
   - Where to find duplicates in WordPress admin
   - How to preview Bricks pages
   - How to delete duplicates if not wanted

## Safety Model

- Read-only analysis first — full Oxygen content audit before any changes
- Explicit user confirmation before creating any duplicates
- Duplicate-first only — never modifies live/published Oxygen content
- Never auto-publishes duplicates
- Provides rollback guidance (delete duplicates if not wanted)
- Preserves all original Oxygen content untouched

## Honest Disclaimer

This skill converts Oxygen page structures to Bricks format and creates duplicates for review.

It cannot:
- Guarantee pixel-perfect visual parity between builders
- Migrate Oxygen Global Styles or conditions automatically
- Convert custom PHP code blocks to Bricks equivalents
- Handle WooCommerce template migrations
- Replace a thorough manual QA pass on every page

It can:
- Map 80-90% of standard Oxygen components to Bricks equivalents
- Preserve content, images, links, and layout structure
- Save days of manual rebuild work
- Identify exactly what needs manual attention

## Tooling

**Core WordPress tools**
- `respira_get_site_context`
- `respira_get_builder_info`
- `respira_list_pages`
- `respira_list_posts`
- `respira_list_plugins`
- `respira_find_builder_targets`
- `respira_extract_builder_content`
- `respira_inject_builder_content`
- `respira_create_page_duplicate`
- `respira_create_post_duplicate`
- `respira_read_page`
- `respira_read_post`

## Telemetry

After run completion, send fire-and-forget usage tracking to:

- `POST https://www.respira.press/api/skills/track-usage`

Include:
- `skill_slug = migrate-oxygen-to-bricks`
- site/version context
- duration and success
- pages audited, pages migrated, warnings count
- tools used

Never block user flow on telemetry failure.

## Related Skills

- WordPress Site DNA (understand site structure before migrating)
- Technical Debt Audit (clean up before or after migration)
- SEO & AEO Amplifier (verify SEO preservation post-migration)

---

Built by Respira Team
https://respira.press/skills/migrate-oxygen-to-bricks
