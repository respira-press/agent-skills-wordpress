---
name: site-onboarding
description: First-run onboarding for Respira MCP connections. Verifies connectivity, discovers site architecture, maps all available MCP tools, and produces a site briefing so the AI understands what it can do. Use when user says "get started", "connect to my site", "what can you do", or "onboard".
license: MIT
metadata:
  author: Respira for WordPress
  author_url: https://respira.press
  version: 1.0.0
  mcp-server: respira-wordpress
  category: onboarding
---

# Site Onboarding

First-run primer for AI coding tools connected to WordPress via Respira MCP. Verifies the connection, discovers everything about the site, and produces a briefing so you know exactly what you can do.

## What This Skill Does

Runs a structured onboarding sequence that:
- Verifies the MCP connection is live and authenticated
- Discovers site architecture (theme, plugins, builders, post types)
- Maps all available MCP tools and what they control
- Identifies which add-ons are active (WooCommerce, etc.)
- Produces a concise site briefing you can refer back to

## Requirements

- Respira for WordPress plugin installed and activated
- MCP connection configured (site URL + API key)
- Read-only access (no changes made during onboarding)

## How to Use

### Trigger Phrases
- "get started with my site"
- "connect to my wordpress site"
- "what can you do on my site"
- "onboard"
- "site onboarding"
- "check the connection"
- "introduce yourself to my site"

### What Happens

1. **Verify connection:**
   - Call `wordpress_get_active_site` to confirm which site is connected
   - Call `wordpress_get_site_context` to pull full site details
   - Report connection status, WordPress version, PHP version, site URL

2. **Discover site architecture:**
   - Call `wordpress_list_plugins` to see all installed plugins (active and inactive)
   - Call `wordpress_get_builder_info` to detect page builders (Elementor, Bricks, Divi, etc.)
   - Call `wordpress_list_post_types` to map all content types
   - Call `wordpress_list_taxonomies` to map all taxonomies
   - Call `wordpress_list_pages` to understand content structure
   - Call `wordpress_list_menus` to see navigation setup

3. **Map capabilities:**
   - Based on active plugins and add-ons, list what you can do:
     - Content management (pages, posts, custom post types)
     - Builder editing (if Elementor/Bricks/Divi detected)
     - Media management (upload, optimize, replace)
     - SEO tools (if SEO plugin detected)
     - WooCommerce management (if WooCommerce active)
     - Menu and navigation management
     - User management
     - Plugin management
     - Snapshot and approval workflows

4. **Generate site briefing:**
   - Produce a structured summary the AI can reference throughout the session
   - Highlight any issues detected (outdated plugins, security concerns)
   - Suggest next steps based on what was discovered

## Output Format

Produces a site briefing with these sections:

### Connection Status
- Site URL, WordPress version, PHP version, theme
- MCP server version, API version (v1/v2)
- Authentication status

### Site Architecture
- Active theme (parent + child if applicable)
- Page builder(s) in use
- Active plugins count and key plugins
- Content overview (pages, posts, CPTs with counts)
- Taxonomy overview

### What I Can Do
- Categorized list of available actions based on the site's setup
- Builder-specific capabilities (e.g. "Edit Elementor widgets", "Modify Bricks elements")
- Add-on capabilities (e.g. "Manage WooCommerce products")

### Recommended Next Steps
- Suggested skills to install from the Skills Marketplace
- Quick wins based on site state (e.g. "3 plugins have updates available")
- Common workflows to try first

## Example Output

```
## Site Briefing: example.com

### Connection
- Connected to https://example.com (WordPress 6.7.1, PHP 8.2)
- Respira v4.3.0, MCP v2 active
- Authenticated as: admin

### Architecture
- Theme: flavor starter (flavor starter child)
- Builder: Bricks Builder v1.12.2
- 14 active plugins | 2 inactive
- 23 pages | 8 posts | 3 custom post types (portfolio, testimonial, team)

### What I Can Do
**Content:** Create, edit, duplicate, and delete pages, posts, and custom posts
**Builder:** Read and edit Bricks Builder elements on any page
**Media:** Upload, replace, and optimize images
**SEO:** Analyze SEO, readability, and structured data (Yoast detected)
**Navigation:** Create and manage menus and menu items
**Snapshots:** Take before/after snapshots for safe editing with approval workflows

### Suggested Next Steps
1. Run `/wordpress-site-dna` for a full site health audit
2. Run `/seo-aeo-amplifier` on your top pages
3. Try editing a page: "Update the hero heading on the homepage"
```
