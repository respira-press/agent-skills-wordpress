# SEO & AEO Amplifier

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

1. Verify Respira + MCP connection via `wordpress_get_site_context`. If unavailable, stop and show setup guidance.
2. Detect SEO plugin setup using `wordpress_list_plugins`:
   - Yoast SEO
   - Rank Math
   - No SEO plugin
3. Scan all published pages and posts:
   - `wordpress_list_pages`
   - `wordpress_list_posts`
4. For each content item, load content and metadata:
   - `wordpress_get_page` or `wordpress_get_post`
   - `wordpress_detect_page_builder` when needed
5. Analyze on-page SEO:
   - Title quality (length, uniqueness, keyword coverage)
   - Meta description quality (presence, length, CTR intent)
   - Heading hierarchy (single H1, no level skips)
   - Image alt text coverage (`wordpress_list_media` + in-content image checks)
   - Content depth (word count, readability proxy)
   - Internal links and orphaned pages
   - URL slug descriptiveness
6. Analyze AEO opportunities:
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

1. For each selected page/post:
   - Create duplicate with `wordpress_create_duplicate`
2. Apply fixes on duplicate only:
   - Optimize title tags (target < 60 chars)
   - Generate/rewrite meta descriptions (target 150-160 chars)
   - Fix heading structure (single H1, logical hierarchy)
   - Add/repair image alt text
   - Add table of contents for long-form pages
   - Restructure Q&A blocks for FAQ readiness
   - Generate and inject JSON-LD schema markup
   - Improve URL slug when safe and requested
3. Save duplicate:
   - `wordpress_update_page` / `wordpress_update_post`
4. Produce before/after comparison snapshots for representative pages
5. Summarize totals:
   - Duplicates created
   - Titles/meta/schema/alt/headings fixed

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
- Explicit user confirmation before changes
- Duplicate-first changes only
- Never auto-publish
- Provide rollback guidance
- Preserve live content unless user explicitly approves publishing workflow

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
- `wordpress_get_site_context`
- `wordpress_list_pages`
- `wordpress_list_posts`
- `wordpress_get_page`
- `wordpress_get_post`
- `wordpress_detect_page_builder`
- `wordpress_list_media`
- `wordpress_list_plugins`
- `wordpress_create_duplicate`
- `wordpress_update_page`
- `wordpress_update_post`

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
