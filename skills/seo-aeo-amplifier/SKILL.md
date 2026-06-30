# SEO & AEO Amplifier

**Version:** 1.3.0
**Updated:** 2026-06-30
**Freshly updated:** v1.3.0 takes a snapshot with respira_get_snapshot before any edit so every change is one-click reversible, switches from full extract/inject to surgical respira_find_element + respira_update_element edits for meta titles, descriptions and H1s, applies schema and meta across many pages in a single safe pass with respira_batch_update, and wires respira_generate_activity_report into the "SEO work done -> client report" handoff. Also leans on the real SEO analysis tools (respira_analyze_seo, respira_analyze_aeo, respira_analyze_rankmath, respira_check_seo_issues, respira_check_structured_data) instead of hand-rolled scoring.

Comprehensive on-page SEO and Answer Engine Optimization (AEO) audit and auto-fix system for WordPress sites. Scans all content, detects issues, generates intelligent schema markup, and creates optimized duplicates for review.

## What This Skill Does

**Finds:**
- Missing or weak title tags and meta descriptions
- Poor heading structure (multiple H1s, skipped heading levels, non-descriptive headings)
- Missing image alt text across all media
- Thin content (pages under 300 words)
- Broken internal links
- Orphaned pages (no internal links pointing to them)
- Non-descriptive URL slugs
- Content that could answer questions but lacks FAQ schema
- Missing structured data (Article, HowTo, Product, Event, Video, Review)
- Content not optimized for featured snippets
- Missing table of contents on long-form content
- No clear Q&A structure for "People Also Ask" boxes

**Provides:**
- Comprehensive SEO health score (0-100)
- Page-by-page opportunity analysis
- Automated duplicate creation with all fixes applied
- Intelligent schema markup generation based on content type
- Before/after comparison for every fix
- Plugin-specific guidance (Yoast SEO, Rank Math, or plugin-agnostic)

**Generates Schema Markup:**
- Article schema (blog posts, news)
- FAQ schema (Q&A content detected)
- HowTo schema (tutorial/guide content)
- Product schema (WooCommerce products - requires WooCommerce add-on)
- Event schema (event content detected)
- Video schema (embedded videos detected)
- Review schema (review content detected)
- Breadcrumb schema (site navigation)
- Organization/Website schema (site-wide)

## Requirements

- Respira for WordPress plugin installed and connected
- MCP connection active (desktop or WebMCP)
- WooCommerce add-on (optional - for product schema)
- Read access to scan site, write access to create duplicates

## Trigger Phrase

- "amplify my seo and aeo"

## Alternative Triggers

- "optimize my site for search engines"
- "run seo aeo audit"
- "improve my search visibility"
- "scan for seo opportunities"

## Execution Workflow

### Phase 1: Comprehensive Audit

1. Verify Respira + MCP connection via `respira_get_site_context`. If unavailable, stop and show setup guidance.
2. Detect SEO plugin setup using `respira_list_plugins`:
   - Yoast SEO
   - Rank Math
   - No SEO plugin
3. Scan all published pages and posts:
   - `respira_list_pages`
   - `respira_list_posts`
4. For each content item, load content and metadata:
   - `respira_read_page` or `respira_read_post`
   - `respira_get_builder_info` when needed
5. Analyze on-page SEO. Prefer the real analysis tools over hand-rolled checks:
   - `respira_analyze_seo` for the on-page SEO pass (title, meta, headings, content depth, links)
   - `respira_check_seo_issues` for the prioritized issue list per page
   - `respira_analyze_rankmath` when Rank Math is detected (reads its score and recommendations)
   - `respira_check_structured_data` to see which schema types already exist vs are missing
   - Supplement with `respira_list_media` + in-content image checks for alt text coverage
   - Cross-checks the tools cover: title quality, meta description quality, heading hierarchy (single H1, no level skips), content depth, internal links / orphaned pages, URL slug descriptiveness
6. Analyze AEO opportunities with `respira_analyze_aeo` (answer-engine readiness), plus `respira_check_structured_data`:
   - FAQ potential (question patterns)
   - HowTo potential (step-by-step patterns)
   - Featured snippet opportunities
   - Missing table of contents on long-form pages
   - Missing structured data per content type
7. Build opportunity scoring:
   - Critical / High / Medium / Low
   - Per-page opportunity score (0-100)
8. Produce full report with:
   - Overall health score
   - Priority matrix
   - Top opportunity pages
   - Plugin-specific integration notes

### Phase 2: Ask for Confirmation

After report, ask:

> I found [X] pages with SEO/AEO opportunities. Would you like me to create optimized duplicates for all of them? You will review before publishing.

If user declines, stop after delivering recommendations.

### Phase 3: Auto-Fix on Duplicates (Only If Approved)

1. **Snapshot first.** Before touching anything, take a snapshot with `respira_get_snapshot` so the whole pass is one-click reversible via `respira_restore_snapshot` if a fix looks wrong.
2. For each selected page/post:
   - Create the review copy with `respira_create_page_duplicate` (pages) or `respira_create_post_duplicate` (posts)
3. Apply fixes on the duplicate only. Use surgical edits, not full extract/inject:
   - **Locate the exact node first** with `respira_find_element` (find the meta title, meta description, and the H1 / heading elements), then change only that node with `respira_update_element`. This avoids re-writing the whole page and keeps the builder's structure intact.
   - Optimize title tags (target < 60 chars)
   - Generate/rewrite meta descriptions (target 150-160 chars)
   - Fix heading structure (single H1, logical hierarchy)
   - Add/repair image alt text
   - Add table of contents for long-form pages
   - Restructure Q&A blocks for FAQ readiness
   - Generate and inject JSON-LD schema markup
   - Improve URL slug when safe and requested
4. **Apply the same fix across many pages in one safe pass** with `respira_batch_update` (for example, the same Organization/WebSite schema or a meta pattern across a set of duplicates) instead of looping one slow update at a time.
5. Save remaining page-level changes with `respira_update_page` / `respira_update_post`.
6. Verify with `respira_check_seo_issues` / `respira_check_structured_data` on a sample of the fixed duplicates to confirm the issues actually cleared.
7. Produce before/after comparison snapshots for representative pages.
8. Summarize totals:
   - Duplicates created
   - Titles/meta/schema/alt/headings fixed
   - Snapshot id (so the user knows the rollback point)

## Plugin Integration Behavior

### Yoast SEO detected

- Read Yoast metadata
- Populate Yoast-compatible meta fields on duplicates
- Add JSON-LD schema only where Yoast does not already cover the content type
- Suggest focus keywords and readability improvements

### Rank Math detected

- Read Rank Math metadata
- Populate Rank Math-compatible meta fields on duplicates
- Add JSON-LD schema where missing

### No SEO plugin detected

- Insert meta tags and JSON-LD directly in duplicate content
- Recommend optional Yoast or Rank Math adoption

## Schema Generation Rules

Generate schema based on detected content intent:

- **Article:** blog/news/editorial content
- **FAQPage:** clear Q&A content patterns
- **HowTo:** procedural/step-by-step content
- **Product:** WooCommerce products (if add-on/tools available)
- **Event:** event date/location content
- **VideoObject:** embedded YouTube/Vimeo/video blocks
- **Review:** clear review/rating content
- **BreadcrumbList:** URL hierarchy
- **Organization / WebSite:** site-level identity signals

All schema must be JSON-LD and valid structure-first (no fabricated claims).

## Output Format

Always include:

1. **Executive summary**
2. **Overall score + severity counts**
3. **Top opportunities with impact rationale**
4. **Plugin integration notes**
5. **Clear confirmation prompt for duplicate creation**

If auto-fix is run, also include:

6. **Fix summary totals**
7. **Before/after samples**
8. **Review instructions in WordPress admin**

## Safety Model

- Read-only audit first
- Snapshot via `respira_get_snapshot` before any write, restore with `respira_restore_snapshot`
- Explicit user confirmation before changes
- Duplicate-first changes only
- Never auto-publish
- Provide rollback guidance
- Preserve live content unless user explicitly approves publishing workflow

## Client Report Handoff

When the audit and (optional) fixes are done, turn the SEO work into a deliverable the customer can hand to a client or keep for their own records:

- Call `respira_generate_activity_report` to pull the actual edits made in this session (titles, meta, schema, alt text, headings) into a structured "SEO work done" report.
- Pair it with the before/after samples and the snapshot id from Phase 3 so the report shows what changed and how to roll it back.
- Good fit for monthly retainers: run the audit, apply approved fixes on duplicates, then export the activity report as the month's SEO summary.

## Honest Disclaimer

This skill identifies SEO/AEO opportunities and creates optimized duplicates for review.

It cannot:
- Guarantee rankings
- Fix off-page SEO or backlinks
- Fix server-level technical SEO by itself
- Publish without review

It can:
- Find broad on-page SEO and AEO gaps
- Generate structured schema recommendations and implementation
- Create transparent before/after duplicate drafts quickly

## Tooling

**Core WordPress tools**
- `respira_get_site_context`
- `respira_list_pages`
- `respira_list_posts`
- `respira_read_page`
- `respira_read_post`
- `respira_get_builder_info`
- `respira_list_media`
- `respira_list_plugins`
- `respira_create_page_duplicate`
- `respira_create_post_duplicate`
- `respira_update_page`
- `respira_update_post`

**SEO / AEO analysis tools**
- `respira_analyze_seo`
- `respira_analyze_aeo`
- `respira_analyze_rankmath`
- `respira_check_seo_issues`
- `respira_check_structured_data`

**Precision edit + safety tools**
- `respira_find_element` (locate meta title / description / H1 nodes)
- `respira_update_element` (change only that node)
- `respira_batch_update` (apply schema/meta across many pages in one pass)
- `respira_get_snapshot` (snapshot before edits)
- `respira_restore_snapshot` (one-click rollback)

**Reporting**
- `respira_generate_activity_report` (SEO work done -> client report)

**WooCommerce tools (optional)**
- `woocommerce_list_products`
- `woocommerce_get_product`

## Telemetry

After run completion, send fire-and-forget usage tracking to:

- `POST https://www.respira.press/api/skills/track-usage`

Include:
- `skill_slug = seo-aeo-amplifier`
- site/version context
- duration and success
- issues found and fixes applied counts
- tools used

Never block user flow on telemetry failure.

## Related Skills

- WordPress Site DNA
- Technical Debt Audit
- Mobile Experience Report

---

Built by Respira Team  
https://respira.press/skills/seo-aeo-amplifier
