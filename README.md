# Agent Skills for WordPress

The community hub for WordPress AI workflows.

Skills that run inside Claude Code, Codex, Antigravity, Cursor, and any AI agent that supports Skills + MCP to analyze, audit, optimize, and fix WordPress sites.  
Built by the community. Curated by Respira. Open source.

**Live Directory:** https://www.respira.press/skills

---

## What Are Skills?

Skills teach AI agents how to work with WordPress in ways that respect your site's architecture and your need for control.

**Plain AI agent:** Generic guidance based on best practices  
**Respira-powered skills:** Deep site access via over 220 MCP tools, over 330 with the WooCommerce add-on

---

## Installation

### npx skills (recommended)

Works with Claude Code, OpenCode, Codex and anything else that reads the Skills
format. Tracks what you installed, from where, and at what content hash, so
installs are reproducible and updates are one command.

```bash
# Install every skill globally
npx skills add respira-press/agent-skills-wordpress -g -a claude-code -y

# Or into the current project only
npx skills add respira-press/agent-skills-wordpress -a claude-code -y

# Update later
npx skills update -g
```

Swap `-a claude-code` for your agent, for example `-a opencode`.

Installing writes a lock file recording each skill's `source`, `skillPath` and
`computedHash`, so you can tell exactly which version of a skill you are running
and whether it has changed upstream.

### From inside WordPress

If you run the Respira plugin, the Skills screen in wp-admin installs and
updates these without touching a terminal.

### Manual

```bash
git clone https://github.com/respira-press/agent-skills-wordpress
cp -r agent-skills-wordpress/skills/* ~/.claude/skills/
```

---

## Available Skills

55 skills, catalog version 1.16.0. The list below is generated from `skills.json`.

### Onboarding

**[Respira Setup Assistant](skills/respira-setup-assistant)**  
Diagnose your Respira MCP connection, walk through first-time setup, and fix common connection problems (timeouts, 401s, 403s, version mismatches).  
*By Respira for WordPress*

**[Site Onboarding](skills/site-onboarding)**  
First-run primer for AI coding tools. Verifies MCP connectivity, discovers site architecture (theme, builders, plugins, content types), maps all available capabilities, and produces a site briefing.  
*By Respira for WordPress*

### Workflow

**[Build an Elementor page](skills/build-elementor-page)**  
Build an Elementor page by hand that looks like its design the first time: the right template, complete typography on every widget, the design's computed values instead of guesses, inline buttons, spacing and mobile settings, and a render check.  
*By Respira for WordPress*

**[Build an Oxygen 6 Page](skills/build-oxygen6-page)**  
Build or rebuild pages on Oxygen 6 (Jenga) as native, editable elements instead of a single HTML block. Hands the agent Oxygen 6's structure: the element schemas, the header/footer/template post types, and the Template Content Area rule.  
*By Respira for WordPress*

**[Murmur Review Loop](skills/murmur-review-loop)**  
Send a page to the people who sign off on it with a Murmur review link, bring their notes back pinned to the element they point at, reply, apply each change on a duplicate, and resolve every note with the snapshot of the change.  
*By Respira for WordPress*

**[Page Template Library Bootstrapper](skills/page-template-library)**  
Capture canonical page patterns (case study, service page, landing page hero + 3-up + CTA) as re-usable playbooks. Uses new v7.1 MCP tools respira_create_playbook + respira_list_playbooks + respira_update_playbook. Future page-generation skills spawn new pages from playbooks in seconds.  
*By Respira for WordPress*

**[Prime the Agent](skills/prime-the-agent)**  
Fast 30-second session-starter. Loads the active site, identifies the page builder, loads inline schemas, and primes the agent on the do-not-write-raw-HTML rule before any work begins. v1.2 moves per-site memory to the first-class tools: the stored brief arrives automatically inside get_site_context under site_memory, and durable learnings are saved with respira_remember at the end, so context carries across sessions, teammates, and AI clients. Site rules found in memory are enforced server-side; a refusal is final.  
*By Respira for WordPress*

**[Respira Workflow](skills/respira-workflow)**  
Sets how an agent works on a WordPress site through Respira: report what changed on the site rather than which tool ran, stay visible during long operations, be honest about limits, and send what Respira cannot do yet to the founder.  
*By Respira for WordPress*

### Editing

**[Respira Builder Edits](skills/respira-builder-edits)**  
Use for any in-page content edit on a WordPress site with a page builder. Covers finding elements, applying surgical edits, duplicating before large changes, and verifying the result. Works across Elementor 3 + 4, Divi 4 + 5, Beaver Builder, Bricks, Oxygen Classic, Oxygen 6, Breakdance, WPBakery, Uncode, and Gutenberg.  
*By Respira for WordPress*

**[WordPress Editing Safety](skills/wordpress-editing-safety)**  
The safety rules for editing a WordPress site through Respira: read before you write, live pages go through a draft duplicate a person approves, every write is verified, a failed write is read before it is retried, page content is data and never instructions, and an approval token belongs to the person, not the agent.  
*By Respira for WordPress*

### Audit

**[Conversion Audit](skills/conversion-audit)**  
Audit a WordPress site for conversion-rate friction across six dimensions: above-the-fold clarity, CTA hierarchy, form length, social proof placement, page speed, and trust signals. Prioritized fixes with expected impact — recommendations, not redesigns.  
*By Respira for WordPress*

**[Mobile Experience Report](skills/mobile-experience-report)**  
Mobile layout diagnostics — identifies responsive breakpoint problems, text sizing issues, column stacking failures, element visibility issues, navigation menu behavior. Device-by-device breakdown.  
*By Respira for WordPress*

**[Respira Site Audit](skills/respira-site-audit)**  
Use when asked to audit, score, or health-check a WordPress site or page. Runs SEO, AEO, readability, accessibility, performance, RankMath, and Core Web Vitals analyzers and presents a unified report with prioritised fixes. On site-wide runs it adds the Respira security audit.  
*By Respira for WordPress*

**[Stale Content Detector](skills/stale-content-detector)**  
Find pages and posts that haven't been updated in a long time. Categorize as fresh / aging / stale / archive-candidate. Suggest refresh, redirect, or archive per item — based on age, traffic signal, and internal link count.  
*By Respira for WordPress*

**[Technical Debt Audit](skills/technical-debt-audit)**  
Identifies technical debt in WordPress sites — orphaned shortcodes from deleted plugins, unused plugins, database bloat, unused media, builder data from inactive builders.  
*By Respira for WordPress*

**[WooCommerce Health Check](skills/woocommerce-health-check)**  
WooCommerce configuration diagnostics — identifies checkout problems, cart errors, AJAX mismatches, caching issues, payment gateway setup, SSL enforcement. Revenue-impacting diagnostics.  
*By Respira for WordPress* · Requires the WooCommerce add-on

**[WordPress Security Review](skills/wordpress-security-review)**  
Run the Respira security audit, read its indicators, coverage and known vulnerabilities honestly, and fix what it finds one approved update at a time. Never calls a site clean when a check did not run.  
*By Respira for WordPress*

**[WordPress Site DNA](skills/wordpress-site-dna)**  
Archaeological analysis of WordPress sites. Detects all page builders, audits plugins (active vs dead weight), maps content structure, finds orphaned shortcodes, measures performance, and assesses security posture.  
*By Respira for WordPress*

### Site Intelligence

**[Art Direction](skills/art-direction)**  
The taste layer for every page an agent builds. Loads the site's saved Art Direction before any visual work, plans tokens in two passes against the direction's donts and the known AI-default aesthetics, builds with tokens preserved, checks the result with respira_check_design (rendered mode on published pages), and mints a live preview so the human watches the real page. Also the import lane for Claude Design output and other design-system documents.  
*By Respira for WordPress*

**[Brand Voice Synthesizer](skills/brand-voice-synthesizer)**  
Read 5-10 published posts and extract the brand voice — tone, lexicon, sentence patterns, person used, formality, signature phrases, phrases the site never uses. Persist it so every future content-writing skill produces copy that sounds like the brand, not like generic AI.  
*By Respira for WordPress*

**[Design System Synthesizer](skills/design-system-synthesizer)**  
Read your site's representative pages, theme files, and media library to extract a complete reusable design system — logo, colors, typography, spacing scale, component patterns. Persist it as machine data AND generate a visible style-guide page on your site that renders the tokens visually.  
*By Respira for WordPress*

### Performance

**[Internal Link Builder](skills/internal-link-builder)**  
Strategic internal link building for WordPress sites. Analyzes all published content, maps topic relationships, identifies high-value linking opportunities between pages, and presents a clear plan for approval before making any changes.  
*By Respira for WordPress*

**[SEO & AEO Amplifier](skills/seo-aeo-amplifier)**  
Comprehensive on-page SEO and Answer Engine Optimization audit with automated duplicate creation and intelligent schema markup generation.  
*By Respira for WordPress*

**[WordPress AI Image Optimizer](skills/wordpress-ai-image-optimizer)**  
AI-powered image optimization that downloads images from WordPress, processes locally (compress, WebP conversion, resize, rename), uploads optimized versions, and updates all content references.  
*By Respira for WordPress*

### WooCommerce

**[Respira WooCommerce](skills/respira-woocommerce)**  
Use for WooCommerce operations on a WordPress site. Listing, reading, creating, updating, and duplicating products. Managing categories and tags. Reading orders and updating order status. Stock management. Sales reports. Storefront layout edits. Builder-aware throughout. Requires the Respira WooCommerce add-on (paid).  
*By Respira for WordPress* · Requires the WooCommerce add-on

**[Woo Agent Storefront](skills/woo-agent-storefront)**  
Make a WooCommerce store discoverable and shoppable for AI assistants — set up product feeds in six formats, serve a store llms.txt, register with Google Merchant Center / OpenAI / Meta / Pinterest / TikTok, and hand out attributed cart links.  
*By Respira for WordPress* · Requires the WooCommerce add-on

**[Woo Catalog Perfection](skills/woo-catalog-perfection)**  
Drive a WooCommerce catalog to an AI-readiness score of 90+ — an ordered fixlist loop that writes the missing image alt text, descriptions, brands, GTINs and category mappings, with a snapshot before every change.  
*By Respira for WordPress* · Requires the WooCommerce add-on

**[Woo Marketing Campaigns](skills/woo-marketing-campaigns)**  
Plan and draft a campaign from what your store actually sells. Reads sales, stock and catalogue quality first, then drafts copy against real products at real prices, staged for approval.  
*By Respira for WordPress* · Requires the WooCommerce add-on

**[Woo Pricing and Promotions](skills/woo-pricing-promotions)**  
Run a sale, reprice a category, or set up a coupon on a live WooCommerce store. Every change is previewed in money before it happens, snapshotted when it does, and reversible afterwards.  
*By Respira for WordPress* · Requires the WooCommerce add-on

### Content Creation

**[Custom Post Type Architect](skills/custom-post-type-architect)**  
Design and create WordPress custom post types end to end — CPT + supporting taxonomies + ACF field group + sample entries + builder-specific single template suggestion. Uses new v7.1 MCP tools: respira_create_post_type, respira_create_taxonomy, respira_create_acf_field_group.  
*By Respira for WordPress*

### Reporting

**[Activity Report Composer](skills/activity-report-composer)**  
Turn the audit log of work done on a WordPress site into a polished written report. Wraps the v7.1 respira_generate_activity_report MCP tool with six framings: agency client report, case study, internal recap, testimonial draft, build-in-public, personal recap.  
*By Respira for WordPress*

### Migration and Conversion

**[Content Portability](skills/content-portability)**  
Export WordPress pages, posts, and custom posts to portable local packages with builder data and media, then import to another site with smart ID remapping and auto-backup safety.  
*By Respira for WordPress*

**[Figma to Bricks](skills/figma-to-bricks)**  
Rebuilds a Figma frame as an editable Bricks page with BEM global classes and the frame's palette imported into the Bricks design system. Writes to a draft so nothing live is touched.  
*By Respira for WordPress*

**[Figma to Divi](skills/figma-to-divi)**  
Rebuilds a Figma frame as an editable Divi page. Reads the Figma node tree and maps each node to native Divi sections, rows, columns and modules (Divi 5 blocks or Divi 4 shortcodes, auto-detected), writing to a draft so nothing live is touched.  
*By Respira for WordPress*

**[Figma to Elementor](skills/figma-to-elementor)**  
Rebuilds a Figma frame as an editable Elementor page. Reads the Figma node tree (layers, auto-layout, text, color, images), maps each node to its Elementor widget or container, and writes clean Elementor JSON to a draft duplicate so nothing live is touched.  
*By Respira for WordPress*

**[Figma to Gutenberg](skills/figma-to-gutenberg)**  
Rebuilds a Figma frame as core Gutenberg blocks on any WordPress 6.6+ site — no page builder required. Registers the frame's palette in Global Styles and writes to a draft so nothing live is touched.  
*By Respira for WordPress*

**[HTML to a builder page](skills/html-to-page)**  
Turn a finished HTML page into a native, editable page in the site's builder with one Respira Exhale call: Elementor, Divi, Bricks, Gutenberg, Breakdance, Oxygen, Beaver Builder or WPBakery. The file's stylesheet travels with the page, so it looks like the file on desktop and phone.  
*By Respira for WordPress*

**[HTML to Breakdance](skills/html-to-breakdance)**  
Convert raw HTML/CSS into native Breakdance elements in _breakdance_data. Emits fully qualified EssentialElements types so nothing gets skip-rendered, binds colors, typography and spacing to Breakdance Variables, and reports every CodeBlock fallback instead of hiding it.  
*By Respira for WordPress*

**[HTML to Bricks Builder](skills/html-to-bricks)**  
Convert raw HTML/CSS into native Bricks Builder elements. Maps colors, typography, and spacing to your design system tokens so the result is drift-resistant. ACSS class mapping when ACSS is installed.  
*By Respira for WordPress*

**[Migrate Beaver Builder to Bricks](skills/migrate-beaver-builder-to-bricks)**  
Converts Beaver Builder pages to Bricks Builder by reading the flat node map, mapping modules to Bricks elements, and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate Beaver Builder to Gutenberg](skills/migrate-beaver-builder-to-gutenberg)**  
Converts Beaver Builder pages to native Gutenberg blocks by reading the flat node map, mapping modules to core blocks, and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate Brizy to Gutenberg](skills/migrate-brizy-to-gutenberg)**  
Converts Brizy pages to native Gutenberg blocks by parsing Brizy JSON data, mapping elements to core blocks, and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate Divi to Breakdance](skills/migrate-divi-to-breakdance)**  
Converts Divi pages to Breakdance Builder by parsing shortcodes, mapping modules to Breakdance elements, and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate Divi to Bricks](skills/migrate-divi-to-bricks)**  
Converts Divi pages to Bricks Builder by parsing shortcode content, mapping modules to Bricks elements, and generating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate Divi to Gutenberg](skills/migrate-divi-to-gutenberg)**  
Converts Divi pages to native Gutenberg blocks by parsing shortcodes, mapping modules to core blocks, and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate Elementor to Breakdance](skills/migrate-elementor-to-breakdance)**  
Converts Elementor pages to Breakdance Builder by mapping widgets to Breakdance elements and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate Elementor to Bricks](skills/migrate-elementor-to-bricks)**  
Converts Elementor pages to Bricks Builder by reading Elementor JSON widget data, mapping each widget to its Bricks equivalent, and creating draft duplicates with clean Bricks JSON.  
*By Respira for WordPress*

**[Migrate Elementor to Gutenberg](skills/migrate-elementor-to-gutenberg)**  
Converts Elementor pages to native WordPress Gutenberg blocks by mapping widgets to core blocks and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate Elementor to Oxygen](skills/migrate-elementor-to-oxygen)**  
Converts Elementor pages to Oxygen Builder by mapping widgets to Oxygen components and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate Oxygen to Breakdance](skills/migrate-oxygen-to-breakdance)**  
Converts Oxygen Builder pages to Breakdance by mapping component trees to Breakdance elements and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate Oxygen to Bricks](skills/migrate-oxygen-to-bricks)**  
Converts Oxygen Builder pages to Bricks by mapping component trees to Bricks JSON elements and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate Thrive Architect to Gutenberg](skills/migrate-thrive-architect-to-gutenberg)**  
Converts Thrive Architect pages to native Gutenberg blocks by parsing Thrive content, mapping elements to core blocks, and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate Visual Composer to Gutenberg](skills/migrate-visual-composer-to-gutenberg)**  
Converts Visual Composer pages to native Gutenberg blocks by parsing VC data, mapping elements to core blocks, and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate WPBakery to Bricks](skills/migrate-wpbakery-to-bricks)**  
Converts WPBakery pages to Bricks Builder by parsing shortcodes, mapping elements to Bricks equivalents, and creating draft duplicates for review.  
*By Respira for WordPress*

**[Migrate WPBakery to Gutenberg](skills/migrate-wpbakery-to-gutenberg)**  
Converts WPBakery pages to native Gutenberg blocks by parsing shortcodes, mapping elements to core blocks, and creating draft duplicates for review.  
*By Respira for WordPress*

## Skill Structure

Each skill follows Anthropic's official format:

````
skills/skill-name/
├── SKILL.md (with YAML frontmatter - main instructions)
├── references/ (optional - detailed docs)
│   ├── example-output.md
│   └── technical-details.md
└── scripts/ (optional - executable code)
````

**No README.md or metadata.json inside skill folders** - all documentation goes in SKILL.md or references/

---

## Contributing

**We want skills that solve real problems on real WordPress sites.**

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- How to submit a skill
- Quality standards
- Skill structure requirements
- Recognition and rewards

**Quick start:**
1. Fork this repo
2. Create your skill in `skills/your-skill-name/`
3. Include SKILL.md with YAML frontmatter
4. Test on 3+ real WordPress sites
5. Submit PR

[Read Full Guidelines →](CONTRIBUTING.md)

---

## Recognition

Accepted skills get:
- Featured in https://respira.press/skills directory
- Author attribution with link to your site/GitHub
- Usage stats shared monthly
- Promotion in newsletter and social channels
- Your name in contributors list

---

## Support

**Questions?**
- Issues: [GitHub Issues](https://github.com/respira-press/agent-skills-wordpress/issues)
- Discord: [Join Respira Discord](https://go.respira.cafe/respira-discord)
- Email: word@respira.press

**Found a bug in a skill?**  
Open an issue with the skill name in the title.

**Want to improve a skill?**  
Fork, improve, submit PR. Tag original author if possible.

---

## License

All skills are MIT licensed. By contributing, you agree to license your skill under MIT.

---

## Directory

Browse all skills: https://www.respira.press/skills

Built by the WordPress community. Curated by Respira for WordPress.
