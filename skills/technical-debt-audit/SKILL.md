# Technical Debt Audit

**Version:** 1.2.0
**Updated:** 2026-06-30
**Freshly updated:** v1.2.0 turns the audit into safe, reversible cleanup. Every debt type now has a per-type cleanup playbook that opens with a `respira_get_snapshot` checkpoint and ends with an explicit `respira_restore_snapshot` rollback. Orphaned-shortcode findings are validated with `respira_find_element` before any edit. The per-site debt score is persisted via `respira_get_option` / `respira_update_option` so re-runs show the trend. The cleanup narrative is generated with `respira_generate_activity_report`. Builder archaeology now covers the newer block builders (Spectra, Kadence Blocks, GenerateBlocks, SeedProd) alongside the classic 16.
**Category:** audit
**Status:** active
**Requires:** Respira for WordPress plugin + MCP server
**Telemetry endpoint:** https://www.respira.press/api/skills/track-usage

---

## Description

Find orphaned content, unused plugins, and database bloat before they cause problems.

Technical Debt Audit performs a comprehensive scan for accumulated junk in your WordPress installation. It finds orphaned shortcodes from deleted plugins, identifies plugins you installed but never use, calculates database bloat from revisions and transients, and detects unused media files. This skill shows you exactly what's slowing your site down and provides safe cleanup workflows using Respira's duplicate-first approach.

---

## Trigger Phrases

This skill activates when the user says any of the following:

- "audit my wordpress technical debt"
- "find orphaned shortcodes"
- "scan for unused plugins"
- "check database bloat"
- "wordpress cleanup audit"
- "find legacy code issues"
- "wordpress technical debt"
- "clean up my wordpress"
- "what's bloating my wordpress"
- "wordpress junk cleanup"
- "unused plugins audit"
- "orphaned content wordpress"

**Do NOT trigger for:** general WordPress questions, requests to install specific plugins, theme customization, or non-audit WordPress tasks.

---

## Execution Workflow

### Step 1: Respira Verification

Before anything else, verify Respira for WordPress is installed and the MCP server is connected by calling `respira_get_site_context`. If it fails or returns an error, stop and show the installation guide.

**If Respira is NOT installed, output this and STOP:**

```markdown
## ⛔ Respira for WordPress Required

This skill requires the **Respira for WordPress** plugin to analyze your site safely.

### Install in 3 steps:
1. Go to **https://www.respira.press** and download the plugin
2. Install and activate on your WordPress site
3. Connect via the MCP server: `npx -y @respira/wordpress-mcp-server --setup`

### Why Respira?
- Read-only analysis — no changes to your live site
- Duplicate-first cleanup so nothing breaks
- Full audit trail for every action

Once installed, come back and try again: *"audit my wordpress technical debt"*
```

**If MCP is connected but site unreachable:**

```markdown
## ⚠️ Cannot Connect to WordPress Site

Respira is installed but cannot reach your WordPress site.

### Troubleshooting:
1. Verify your WordPress site is online
2. Check the Respira plugin is active (not just installed)
3. Confirm MCP server configuration in Claude settings
4. Review API key in Respira → Settings → API Keys

**Help:** https://www.respira.press/docs/mcp-setup
```

---

### Step 2: Site Context

```
Tool: respira_get_site_context
Returns: WordPress version, PHP version, active theme, installed plugins,
         detected page builder, custom post types, memory limit, debug mode
```

Record: `respira_site_url`, `started_at = new Date().toISOString()`

---

### Step 3: Plugin Audit

```
Tool: respira_list_plugins
Returns: All installed plugins with name, slug, version, active status,
         update availability, last updated date
```

Categorize each plugin:
- **never_activated**: installed but `active = false` with no recorded activation
- **activated_unused**: `active = true` but no shortcodes, widgets, or hooks found in content
- **long_inactive**: `active = false`, last updated or used 6+ months ago

If `respira_list_plugins` is unavailable, use plugin list from `respira_get_site_context` for a summary-level audit and note the limitation.

---

### Step 4: Content Scan for Orphaned Shortcodes

```
Tool: respira_list_pages
Params: { status: "any" }
Returns: All pages with content

Tool: respira_list_posts
Params: { status: "any" }
Returns: All posts with content
```

Scan all page and post content for `[shortcode_name]` patterns. Cross-reference each shortcode against the active plugin list. Any shortcode whose originating plugin is absent or inactive is orphaned.

Build a table:
- Shortcode name
- Pages/posts affected (count and IDs)
- Likely source plugin
- Plugin current status (deleted/inactive/unknown)

**Validate before claiming an orphan is safe to remove.** A raw text match on `[shortcode]` can be a false positive (the string may appear inside a code block, an escaped example, or a builder field that renders it inert). Before recommending removal on a builder page, confirm the shortcode is actually a live element with `respira_find_element` on the affected page. If `respira_find_element` can't locate it as a rendered element, downgrade the finding to "needs manual review" rather than "orphaned." This keeps the audit honest and the cleanup safe.

---

### Step 5: Builder Archaeology

```
Tool: respira_get_builder_info
Returns: Active builder name, version, available modules
```

Cross-reference installed builders (from plugin list) against actual content usage (from page/post scan). Flag any builder that is installed but has zero pages using it — this generates orphaned builder data on disk.

**Builder data size estimates:**
- Elementor: ~50-200MB if active, similar if dormant
- Divi: ~100-500MB for full install with unused builder data
- WPBakery: ~20-50MB
- Beaver Builder: ~30-80MB
- Bricks: ~20-60MB (JSON in postmeta, light on disk but heavy in `wp_postmeta` rows)
- Oxygen / Breakdance: ~30-90MB
- Spectra (UAG): ~10-40MB, plus per-block dynamic CSS in `wp_options`
- Kadence Blocks: ~10-40MB, dynamic CSS cache can bloat `wp_options`
- GenerateBlocks: ~5-30MB, inline/dynamic CSS
- SeedProd: ~15-50MB (landing pages stored as its own post type; orphaned templates linger)

Block builders (Spectra, Kadence Blocks, GenerateBlocks) leave their cost mostly in `wp_options` (dynamic-CSS caches) and `wp_postmeta`, not as large files. Flag a block builder as dormant only after confirming zero pages/posts use its blocks — these register as core blocks, so check content, not just the active-plugin list.

---

### Step 6: Database Bloat Assessment

```
Tool: respira_get_site_context
Returns: Database stats if available in site context

Tool: respira_analyze_performance
Params: { pageId: <homepage ID> }
Returns: Performance data including caching status
```

Estimate bloat indicators from available data:
- Post revisions: WordPress keeps unlimited revisions by default
- Transients: expired options stored in wp_options
- Orphaned postmeta: metadata rows with no matching post
- Spam comments: unmoderated or marked spam

If direct database stats are unavailable via MCP, note this clearly and provide the manual SQL queries the user can run themselves.

---

### Step 7: Unused Media Detection

```
Tool: respira_list_pages
Tool: respira_list_posts
```

Scan content for image references and media embeds. Compare against what's referenced. Note: full media library enumeration may not be available via MCP — if unavailable, provide the approach Respira can use to generate this report.

---

### Step 8: Debt Score Calculation

Calculate a debt score (0-100, higher = less debt = better):

```
Shortcode Health (25 points):
  - No orphaned shortcodes: 25 pts
  - 1-5 orphaned shortcodes: 15 pts
  - 6-20 orphaned shortcodes: 8 pts
  - 20+ orphaned shortcodes: 0 pts

Plugin Hygiene (25 points):
  - No inactive plugins: 25 pts
  - 1-3 inactive plugins: 18 pts
  - 4-10 inactive plugins: 10 pts
  - 10+ inactive plugins: 3 pts

Builder Cleanliness (20 points):
  - All installed builders in use: 20 pts
  - 1 dormant builder installed: 10 pts
  - 2+ dormant builders: 3 pts

Database Cleanliness (15 points):
  - Revisions limited (wp_post_revisions set): 8 pts
  - Caching plugin active: 7 pts

Content Hygiene (15 points):
  - No draft accumulation (< 20 drafts): 8 pts
  - No spam comment backlog (< 50): 7 pts
```

**Score labels:**
- 85-100: 🟢 Clean
- 60-84: 🟡 Some Debt
- 40-59: 🟠 Significant Debt
- 0-39: 🔴 Critical Debt

#### Persist the score (trend over time)

Store the score on the site so each re-run shows whether debt is going up or down.

1. Read the prior record: `respira_get_option('respira_debt_score')`. If present, it holds the last score + timestamp.
2. Write the new record: `respira_update_option('respira_debt_score', <json>)` with the shape:

```json
{
  "version": "1.0.0",
  "scored_at": "2026-06-30T14:30:00Z",
  "score": 72,
  "label": "Some Debt",
  "breakdown": {
    "shortcode_health": 15,
    "plugin_hygiene": 18,
    "builder_cleanliness": 20,
    "database_cleanliness": 11,
    "content_hygiene": 8
  },
  "findings": {
    "orphaned_shortcodes": 4,
    "inactive_plugins": 3,
    "dormant_builders": 1
  }
}
```

3. In the report, if a prior record existed, show the delta: *"Debt score 72 (▲ +9 since {prior scored_at} — three plugins removed, one builder still dormant)."* This is the single most motivating line in the report; surface it near the top.

---

### Step 9: Generate Report

Output the complete markdown report using the template below.

---

### Step 10: Send Telemetry (fire-and-forget)

After generating the report, silently POST to the telemetry endpoint.
**Never block report delivery on telemetry failure.**

```typescript
// Telemetry payload
const payload = {
  skill_slug: "technical-debt-audit",
  session_id: crypto.randomUUID(),
  user_id: null, // populate if user is authenticated
  respira_site_url: siteUrl,
  respira_version: wpVersion,
  php_version: phpVersion,
  started_at: startedAt,
  completed_at: new Date().toISOString(),
  duration_ms: Date.now() - startTime,
  success: true,
  error_message: null,
  issues_found: criticalCount + highCount + mediumCount + lowCount,
  issues_by_severity: {
    critical: criticalCount,
    high: highCount,
    medium: mediumCount,
    low: lowCount
  },
  health_score: debtScore,
  mcp_tools_used: toolsUsed, // string[]
  findings_summary: {
    orphaned_shortcodes: orphanedShortcodeCount,
    unused_plugins: unusedPluginCount,
    database_bloat_mb: estimatedBloatMb,
    unused_media_files: unusedMediaCount,
    inactive_builders: dormantBuilderCount
  },
  had_respira_before: true
};

// Fire and forget — never await, never block
fetch("https://www.respira.press/api/skills/track-usage", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
}).catch(() => {}); // silently ignore failures
```

---

## Report Output Template

```markdown
# 📋 Technical Debt Audit Report

**Site:** [URL]
**Analyzed:** [Timestamp]
**Debt Score:** [0-100] [🟢/🟡/🟠/🔴]

---

## Executive Summary

- **Orphaned Shortcodes:** [count] across [n] pages
- **Unused Plugins:** [count] installed but not contributing anything
- **Database Bloat:** estimated [size]MB of unnecessary data
- **Unused Media:** [count] files (estimated [size]MB wasted)
- **Dormant Builders:** [count] installed with zero pages using them

### Priority Actions
1. [Highest impact cleanup]
2. [Second priority]
3. [Third priority]

---

## Orphaned Shortcodes

| Shortcode | Pages Affected | Likely Plugin | Plugin Status |
|-----------|----------------|---------------|---------------|
| [shortcode] | [n] pages | [Plugin Name] | Deleted / Inactive |

**Impact:** Broken or invisible content on [n] pages.

**Respira Cleanup Workflow:**
```
"Create duplicate copies of all pages with orphaned [shortcode] tags
so i can review and replace them with current blocks"
```

---

## Unused Plugins

### Never Activated
[List plugins installed but never turned on, with install date if available]

### Activated but Unused
[List plugins that are active but have no detected usage in content, widgets, or hooks]

### Inactive 6+ Months
[List plugins deactivated and untouched for six months or more]

**Impact:** [n] plugins loading or sitting on disk for no reason. Attack surface and admin clutter.

**Respira Cleanup Workflow:**
```
"Show me all inactive plugins and help me safely deactivate then remove the ones i don't need,
one at a time, testing the site after each"
```

---

## Database Bloat

| Category | Estimated Count | Estimated Size |
|----------|----------------|----------------|
| Post Revisions | [n] | [size]MB |
| Expired Transients | [n] | [size]MB |
| Orphaned Postmeta | [n] | [size]MB |
| Spam Comments | [n] | [size]MB |
| **Total Estimated** | **[n]** | **[size]MB** |

**Note:** These are estimates based on site age, plugin history, and post count. Exact figures require direct database access.

**Respira Cleanup Workflow:**
```
"Generate a safe database cleanup plan for my site — show me exactly what will be removed
before we do anything, and run it on a staging copy first"
```

---

## Unused Media

- **Files referenced in content:** [n]
- **Files potentially orphaned:** [n] (uploaded but not found in any content)
- **Estimated wasted disk:** [size]MB

**Note:** Media audit accuracy depends on scan depth. Embeds in custom fields or theme options may not be detected.

**Respira Cleanup Workflow:**
```
"List all media files not referenced in any posts or pages so i can review
before archiving or deleting anything"
```

---

## Builder Archaeology

| Builder | Status | Pages Using | Orphaned Data |
|---------|--------|-------------|---------------|
| [Builder] | Active / Inactive | [n] pages | [size]MB / None |

**Respira Cleanup Workflow:**
```
"Verify no pages use [Builder] builder, then help me safely remove it
and clean up the leftover data"
```

---

## Severity Breakdown

🔴 **Critical** ([count])
[Issues requiring immediate attention]

🟠 **High** ([count])
[Important issues affecting performance or security]

🟡 **Medium** ([count])
[Should address in the next 30 days]

⚪ **Low** ([count])
[Nice-to-haves and minor housekeeping]

---

## Safe Cleanup Roadmap

**Week 1: High-Impact, Low-Risk**
1. Deactivate never-used plugins (test after each)
2. Clean expired transients (safe, always reversible)
3. Remove orphaned shortcodes from duplicate pages

**Week 2: Media and Content**
1. Archive unused media files (30-day safety window before deletion)
2. Limit post revisions going forward
3. Moderate and clear spam comment queue

**Week 3: Deeper Cleanup**
1. Remove dormant builder data after confirming zero usage
2. Delete confirmed-safe plugins
3. Optimize database tables

Each step uses Respira's duplicate-first workflow. Nothing touches your live site until you approve it.

---

**Honest note:**

This skill identifies technical debt. Cleanup is manual and intentional. Respira creates duplicates first so you can test changes safely before they go anywhere near your live site.

---

*Report generated by Technical Debt Audit · Powered by Respira for WordPress*
*Re-run anytime: "audit my wordpress technical debt"*
```

---

## Cleanup Playbooks (snapshot-gated)

The audit is read-only. Cleanup is not — so every cleanup acts behind a snapshot and has an explicit rollback. The pattern is identical for each debt type:

1. **Snapshot.** `respira_get_snapshot` → keep the `snapshot_id`. This is the rollback handle.
2. **Act on a duplicate first** where the change is structural (pages), or on the live object where the change is a reversible toggle (plugin deactivate).
3. **Verify** the site still renders and the target content is intact.
4. **Roll back if anything is off:** `respira_restore_snapshot(snapshot_id)`, then delete any draft duplicates created during the attempt.

Run one debt type at a time. Never batch unrelated cleanups under a single snapshot — a tight snapshot scope is what makes rollback trustworthy.

### Orphaned shortcodes

1. `respira_get_snapshot` → `snapshot_id`.
2. For each affected page, `respira_find_element` to confirm the shortcode is a live element (skip false positives from code blocks / escaped examples).
3. `respira_create_page_duplicate` (or `respira_create_post_duplicate`) so the live page is untouched.
4. On the duplicate, remove the orphaned shortcode (`respira_find_element` → `respira_remove_element`, or `respira_batch_update` for many at once).
5. Verify the duplicate renders, then publish over the original only on approval.
6. **Rollback:** `respira_restore_snapshot(snapshot_id)` + delete the draft duplicates.

### Unused plugins

1. `respira_get_snapshot` → `snapshot_id`.
2. `respira_deactivate_plugin` one plugin at a time (never bulk).
3. Reload the homepage and one key page; confirm nothing broke.
4. Only after a clean check, `respira_delete_plugin` for the confirmed-safe ones.
5. **Rollback:** if a page breaks, `respira_restore_snapshot(snapshot_id)` and reactivate the plugin (`respira_activate_plugin`).

### Database bloat (revisions / transients / spam)

1. `respira_get_snapshot` → `snapshot_id`.
2. Start with always-safe wins: expired transients, then capping post revisions going forward (`respira_get_option` / `respira_update_option` on the revisions setting).
3. Clear the spam comment queue last, in batches, after eyeballing a sample.
4. **Rollback:** `respira_restore_snapshot(snapshot_id)`. Note: hard comment deletion may not be fully reversible by snapshot, so review the spam sample before deleting.

### Unused media

1. `respira_get_snapshot` → `snapshot_id`.
2. Build the "not referenced anywhere" list, then move (not delete) candidates to a holding state for a 30-day safety window.
3. Only delete after the window with no missing-image reports.
4. **Rollback:** `respira_restore_snapshot(snapshot_id)` while still inside the window.

### Dormant builders

1. `respira_get_snapshot` → `snapshot_id`.
2. Re-confirm zero usage: `respira_get_builder_info` + a content scan (for block builders, check rendered blocks, not just the plugin list).
3. `respira_deactivate_plugin`, verify the site, then `respira_delete_plugin`.
4. **Rollback:** `respira_restore_snapshot(snapshot_id)` + `respira_activate_plugin`.

### Cleanup narrative (after the work)

Once cleanups are done, generate a written record of what changed with `respira_generate_activity_report`. It returns structured totals (actions taken, tools used, time saved) that you turn into the closing narrative for the audit: *"This pass removed 3 plugins, cleared 1,240 expired transients, and archived 84 unused media files. Debt score moved 63 → 72."* Pair this with the persisted `respira_debt_score` delta so the user sees both the story and the number.

---

## MCP Tools Reference

All tools below are provided by the `respira-wordpress` MCP server. Never call tools that are not in this list.

| Tool | Purpose | Required Params |
|------|---------|-----------------|
| `respira_get_site_context` | WP version, PHP, theme, plugins, builder, debug mode | none |
| `respira_get_builder_info` | Active builder modules and detailed config | none |
| `respira_list_plugins` | All plugins with active status, version, update info | none |
| `respira_list_pages` | All pages with IDs, status, content | `{ status: "any" }` |
| `respira_list_posts` | All posts with IDs, status, content | `{ status: "any" }` |
| `respira_analyze_performance` | Load time, caching, CSS/JS bloat for a page | `{ pageId: number }` |
| `respira_get_option` | Read prior debt score + revisions setting | `{ key: string }` |
| `respira_update_option` | Persist the per-site debt score (trend) | `{ key, value }` |
| `respira_find_element` | Validate an orphaned shortcode is a live element | `{ pageId, ... }` |
| `respira_get_snapshot` | Checkpoint before any cleanup (rollback handle) | none |
| `respira_restore_snapshot` | Roll a cleanup back to the checkpoint | `{ snapshot_id }` |
| `respira_generate_activity_report` | Structured totals for the cleanup narrative | none |

> Cleanup tools used inside the playbooks above — `respira_create_page_duplicate`, `respira_create_post_duplicate`, `respira_remove_element`, `respira_batch_update`, `respira_deactivate_plugin`, `respira_activate_plugin`, `respira_delete_plugin` — are also `respira-wordpress` MCP tools. Use only tools from this server; never invent a tool name.

---

## Error Handling

### Partial Analysis Failure

If some MCP tools fail but core analysis succeeds:

```markdown
## ⚠️ Partial Analysis Completed

Most modules completed. Some data may be incomplete.

**Completed:** ✅ Core info · ✅ Plugin audit · ✅ Content scan
**Partial/Failed:** ⚠️ [module name] — [reason]

The report below reflects available data. Re-run for complete results.
```

### Full Failure

```markdown
## ❌ Analysis Failed

Unable to complete Technical Debt Audit.

**Error:** [error message]

**Try:**
1. Verify WordPress site is online
2. Check Respira plugin is active
3. Restart MCP server connection
4. Contact support: https://www.respira.press/support
```

---

## Evaluation Test Cases

### Benchmark Tests

```json
{
  "test_suite": "technical-debt-audit-benchmark",
  "version": "1.0.0",
  "tests": [
    {
      "id": "bench-001",
      "name": "Clean site with minimal debt",
      "input": "audit my wordpress technical debt",
      "expected_behavior": "Completes audit, debt score >= 75, no critical issues",
      "pass_criteria": ["debt_score present", "orphaned_shortcodes count present", "plugin audit present"],
      "timeout_ms": 60000
    },
    {
      "id": "bench-002",
      "name": "Legacy site with heavy debt",
      "input": "find orphaned shortcodes",
      "context": "Site has 10+ inactive plugins, multiple dormant builders, 15+ orphaned shortcodes",
      "expected_behavior": "Detects all orphaned shortcodes, flags inactive plugins, scores 0-40",
      "pass_criteria": ["orphaned shortcodes listed", "debt_score <= 40", "cleanup roadmap present"]
    },
    {
      "id": "bench-003",
      "name": "No Respira installed",
      "input": "scan for unused plugins",
      "context": "No respira_get_site_context tool available",
      "expected_behavior": "Graceful stop with installation guide, not an error",
      "pass_criteria": ["Installation guide shown", "respira.press link present", "No stack trace"]
    }
  ]
}
```

### Trigger Tuning Tests

```json
{
  "test_suite": "technical-debt-audit-trigger",
  "should_trigger": [
    "audit my wordpress technical debt",
    "find orphaned shortcodes",
    "scan for unused plugins",
    "check database bloat",
    "wordpress cleanup audit",
    "find legacy code issues",
    "what's bloating my wordpress database",
    "which plugins am i not using",
    "clean up my wordpress site"
  ],
  "should_not_trigger": [
    "how do I install a plugin",
    "update my WordPress theme",
    "write a blog post",
    "fix this CSS bug",
    "how does Elementor work",
    "wordpress security audit",
    "analyze my wordpress site"
  ]
}
```

### Regression Tests

```json
{
  "test_suite": "technical-debt-audit-regression",
  "scenarios": [
    {
      "id": "reg-001",
      "name": "Fresh WordPress install",
      "plugins": 3,
      "orphaned_shortcodes": 0,
      "inactive_plugins": 0,
      "expected": "debt_score >= 80, minimal cleanup recommendations"
    },
    {
      "id": "reg-002",
      "name": "Legacy agency handoff site",
      "plugins": 47,
      "orphaned_shortcodes": 23,
      "inactive_builders": 2,
      "expected": "debt_score <= 40, critical issues listed, roadmap generated"
    },
    {
      "id": "reg-003",
      "name": "Established blog with no cleanup",
      "post_count": 500,
      "estimated_revisions": "high",
      "spam_comments": "high",
      "expected": "database bloat section populated, cleanup SQL provided"
    }
  ]
}
```
