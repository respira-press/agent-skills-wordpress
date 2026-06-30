# WooCommerce Health Check

**Version:** 1.2.0
**Updated:** 2026-06-30
**Freshly updated:** v1.2.0 adds real order/sales/stock diagnostics via the woocommerce_* read tools (woocommerce_list_orders, woocommerce_sales_report, woocommerce_get_stock_status), gives every detected issue a concrete safe-fix suggestion, uses respira_find_element to locate and validate the actual cart/checkout widgets and blocks, snapshots with respira_get_snapshot before any fix, and frames respira_generate_activity_report as a "prevented X lost orders / revenue protected" report.
**Category:** audit
**Status:** active
**Requires:** Respira for WordPress plugin + MCP server + WooCommerce (`requires_addon: woocommerce`)
**Telemetry endpoint:** https://www.respira.press/api/skills/track-usage

---

## Description

Detect checkout issues, cart problems, and configuration errors silently losing sales.

WooCommerce Health Check scans your store for common configuration issues that break checkout flow and lose sales. It detects mobile checkout problems, payment gateway setup issues, AJAX URL mismatches, caching configuration errors on cart/checkout pages, and SSL problems. This skill identifies the exact issues causing cart abandonment and provides Respira workflows to test fixes safely on duplicate pages before going live.

---

## Trigger Phrases

This skill activates when the user says any of the following:

- "audit my woocommerce store"
- "check woocommerce health"
- "find checkout problems"
- "woocommerce diagnostic"
- "why is my checkout broken"
- "scan woocommerce configuration"
- "woocommerce health check"
- "checkout not working woocommerce"
- "cart problems woocommerce"
- "woocommerce checkout issues"
- "losing sales woocommerce"
- "woocommerce configuration audit"

**Do NOT trigger for:** general WordPress audits without WooCommerce context, plugin installation requests, theme customization, or non-WooCommerce e-commerce questions.

---

## Execution Workflow

### Step 1: Respira + WooCommerce Verification

Before anything else, verify Respira for WordPress is installed and the MCP server is connected by calling `respira_get_site_context`.

**If Respira is NOT installed, output this and STOP:**

```markdown
## ⛔ Respira for WordPress Required

This skill requires the **Respira for WordPress** plugin to analyze your store safely.

### Install in 3 steps:
1. Go to **https://www.respira.press** and download the plugin
2. Install and activate on your WordPress site
3. Connect via the MCP server: `npx -y @respira/wordpress-mcp-server --setup`

### Why Respira?
- Read-only analysis — no changes to your live store
- Duplicate-first fix testing so no checkout breaks go live
- Full audit trail for every action

Once installed, come back and try again: *"check woocommerce health"*
```

**If WooCommerce is NOT found in the plugin list, output this and STOP:**

```markdown
## ⚠️ WooCommerce Not Detected

This skill is specifically for WooCommerce stores.

WooCommerce does not appear to be installed or active on your site.

**If you do have WooCommerce installed:**
- Make sure the plugin is activated (not just installed)
- Verify Respira can see your plugin list in Respira → Settings

**If you're looking for a general WordPress audit:**
Try: *"analyze my wordpress site"* (WordPress Site DNA skill)
```

---

### Step 2: Site and Store Context

```
Tool: respira_get_site_context
Returns: WordPress version, PHP version, site URL, WordPress address,
         installed plugins, active theme, debug mode
```

Record: `respira_site_url`, `started_at = new Date().toISOString()`

**Critical check — URL mismatch detection:**
Compare `siteurl` (Site Address) vs `home` (WordPress Address) from site context. A mismatch causes AJAX to fail on checkout.

---

### Step 3: Plugin Audit for WooCommerce-Specific Issues

```
Tool: respira_list_plugins
Returns: All plugins with name, slug, version, active status
```

Check for:
- WooCommerce version (flag if significantly behind latest)
- Payment gateway plugins and their active status
- Caching plugins (W3TC, WP Super Cache, WP Rocket, LiteSpeed) — these need cart/checkout exclusions
- Security plugins that may interfere with AJAX requests
- Conflicting checkout plugins

---

### Step 4: Live Store Diagnostics (orders, sales, stock)

Configuration checks tell you what *could* break. Live store data tells you what *is* breaking. Pull the real numbers with the WooCommerce read tools:

```
Tool: woocommerce_list_orders
Returns: Recent orders with status, total, date
```

Look at order status mix over a recent window:
- A spike in `failed` / `pending` orders next to very few `processing` / `completed` is a strong checkout-is-broken signal (payment or AJAX failing at the last step).
- Many `cancelled` after `pending` can mean session/cart loss before payment.

```
Tool: woocommerce_sales_report
Returns: Sales totals over a period
```

Use the sales report to size the impact: a sudden drop against a prior period quantifies how much revenue the configuration issues are putting at risk, which feeds the "revenue protected" framing in the final report.

```
Tool: woocommerce_get_stock_status
Returns: Stock state for products
```

Flag stock problems that silently lose sales:
- Products stuck "out of stock" that should be in stock (a fixable data error, not a real shortage).
- Best-sellers low on stock with no backorder allowed.

**Safe fix for a genuine stock data error:** confirm the real count with the store owner, then correct it with `woocommerce_update_stock`. Snapshot first (Step 0 of any fix) and never bulk-change stock without explicit confirmation.

---

### Step 5: Checkout and Cart Page Analysis

```
Tool: respira_list_pages
Params: { status: "publish" }
Returns: All published pages
```

Locate the WooCommerce core pages:
- Cart page (has `[woocommerce_cart]` shortcode or is_cart block)
- Checkout page (has `[woocommerce_checkout]` shortcode or is_checkout block)
- My Account page
- Thank You / Order Received page

For each core page, check:
- Page exists and is published
- Page is assigned in WooCommerce → Settings → Pages
- Page content contains expected WooCommerce element

**Validate the actual cart/checkout widget is present** with `respira_find_element` on the cart and checkout pages. A page can be "assigned" in settings but have lost its `[woocommerce_checkout]` shortcode / Checkout block during a builder edit. `respira_find_element` confirms the real checkout widget/block exists in the content, which is the single most common cause of a checkout page that loads but cannot take an order.

**Safe fix when the widget is missing:** create a duplicate of the page, re-insert the correct WooCommerce checkout/cart block on the duplicate, verify it renders, then swap it in. Never edit the live checkout page directly.

```
Tool: respira_analyze_performance
Params: { pageId: <checkoutPageId> }
Returns: Load time, caching status, scripts loading
```

Flag caching on cart/checkout: if caching plugin is active and checkout page has no exclusion configured, this will likely break session handling.

**Safe fix:** add `cart`, `checkout`, and `my-account` to the caching plugin's page-exclusion list (do not rely on URL-pattern guesses; use the actual slugs found above).

---

### Step 6: SSL Verification

```
Tool: respira_get_site_context
Returns: Site URL (check for https://)
```

SSL check:
- Site URL starts with `https://` → ✅
- Site URL starts with `http://` → 🔴 Critical (payment gateways require SSL)
- WordPress Address and Site Address both https but different subdomains → ⚠️ URL mismatch risk

---

### Step 7: Mobile Checkout Experience Analysis

```
Tool: respira_analyze_performance
Params: { pageId: <checkoutPageId> }
Returns: Performance data, script loading, CSS details
```

```
Tool: respira_get_builder_info
Returns: Active builder name and responsive configuration
```

Flag common mobile checkout issues based on builder type:
- Elementor: Check if checkout columns are set to stack on mobile
- Divi: Verify mobile view is not using fixed widths
- Gutenberg/blocks: Check block spacing and button sizing
- Classic themes: Verify responsive CSS is active

Mobile checkout failure patterns to flag:
- Checkout form columns not stacking (common with page builders)
- "Place Order" button partially off-screen on small viewports
- Form input fields too small to tap (< 44px height)
- Payment gateway iframe not resizing on mobile

---

### Step 8: Payment Gateway Status

From `respira_list_plugins`, identify payment gateway plugins:
- Stripe (WooCommerce Stripe Payment Gateway)
- PayPal (WooCommerce PayPal Payments, PayPal Checkout)
- Square, Authorize.net, Braintree, etc.
- Manual/COD/Bank Transfer (native WooCommerce)

For each detected gateway:
- Is the plugin active?
- Is SSL present (required for most gateways)?
- Note: Cannot verify API key validity via MCP — flag as "requires manual verification"

---

### Step 9: Performance Issues on Checkout

```
Tool: respira_analyze_performance
Params: { pageId: <checkoutPageId> }
Returns: Load time, script list, CSS list, caching status
```

Flag:
- Checkout load time > 2s
- Scripts loading that have no checkout relevance (social sharing, maps without store locator, etc.)
- Missing script defer/async on non-critical JS
- Large CSS files not relevant to checkout

---

### Step 10: Health Score Calculation

Calculate store health score (0-100):

```
Checkout Configuration (30 points):
  - Checkout page exists and configured: 10 pts
  - No URL mismatch: 10 pts
  - SSL active: 10 pts

Cart and Session (20 points):
  - Cart page configured correctly: 10 pts
  - Caching exclusions in place: 10 pts

Payment Gateways (20 points):
  - At least one active gateway: 15 pts
  - SSL present for card gateways: 5 pts

Mobile Experience (15 points):
  - No mobile checkout layout breaks detected: 10 pts
  - Checkout load time < 2s: 5 pts

Configuration (15 points):
  - WooCommerce version current: 8 pts
  - No conflicting plugins detected: 7 pts
```

**Score labels:**
- 85-100: 🟢 Healthy
- 60-84: 🟡 Minor Issues
- 40-59: 🟠 Revenue at Risk
- 0-39: 🔴 Critical — Losing Sales

---

### Step 11: Generate Report

Output the complete markdown report using the template below.

---

### Step 12: Send Telemetry (fire-and-forget)

After generating the report, silently POST to the telemetry endpoint.
**Never block report delivery on telemetry failure.**

```typescript
// Telemetry payload
const payload = {
  skill_slug: "woocommerce-health-check",
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
  health_score: storeHealthScore,
  mcp_tools_used: toolsUsed, // string[]
  findings_summary: {
    url_mismatch_detected: urlMismatch,
    ssl_active: sslActive,
    checkout_page_cached: checkoutCached,
    mobile_issues_count: mobileIssueCount,
    payment_gateways_active: activeGatewayCount,
    checkout_load_time_ms: checkoutLoadTime
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

## Safe Fix Model

This skill is read-only by default. When the user approves a fix, every change follows the same safety rules:

1. **Snapshot before any change** with `respira_get_snapshot`. This is the rollback point if a fix has side effects. Restore with `respira_restore_snapshot`.
2. **Duplicate-first for page changes.** Re-insert a missing cart/checkout widget, fix mobile stacking, or remove an unneeded script on a `respira_create_page_duplicate` copy, verify it renders, then swap it in. Never edit the live checkout page directly.
3. **Confirm data changes.** Stock corrections via `woocommerce_update_stock` only after the store owner confirms the real count. Never bulk-change stock or order status on a guess.
4. **Re-validate after the fix.** Use `respira_find_element` again to confirm the checkout/cart widget is present, and re-run the relevant check before calling an issue resolved.

### Safe-fix suggestions per detected issue

| Detected issue | Concrete safe fix |
|----------------|-------------------|
| URL mismatch (Site Address != WordPress Address) | Align the two URLs on a staging copy, verify checkout AJAX works, then apply to live |
| No SSL on checkout | Install/activate a TLS certificate at the host, then force HTTPS; gateways require it |
| Cart/checkout cached | Add `cart`, `checkout`, `my-account` slugs to the caching plugin's exclusion list |
| Missing checkout/cart widget (found via `respira_find_element`) | Re-insert the correct WooCommerce block on a duplicate, verify, swap in |
| Mobile checkout layout breaks | Fix responsive stacking on a duplicate checkout page, test on a phone viewport, swap in |
| Unneeded scripts on checkout | Dequeue the irrelevant scripts on a duplicate first, confirm checkout still works |
| Stock data error (in-stock product flagged out of stock) | Confirm real count, correct with `woocommerce_update_stock` after snapshot |
| Failed/pending order spike (from `woocommerce_list_orders`) | Treat as payment/AJAX failure: verify gateway active + SSL + checkout widget present, fix the underlying cause above |

## Activity Report Handoff

After the audit (and any approved fixes), turn the work into a store-owner-facing report with `respira_generate_activity_report`.

Frame it around protected revenue, not raw tool calls:
- Tie the failed/pending order rate and the `woocommerce_sales_report` drop you measured in Step 4 to an estimate of orders that were being lost.
- After fixes, state what was restored: "checkout widget re-inserted, caching exclusions added, X products corrected back in stock."
- The activity report becomes the "prevented X lost orders / revenue protected" summary the owner can keep or hand to a client, with the snapshot id as the documented rollback point.

---

## Report Output Template

```markdown
# 🛒 WooCommerce Health Check Report

**Store:** [URL]
**Analyzed:** [Timestamp]
**Health Score:** [0-100] [🟢/🟡/🟠/🔴]

---

## Executive Summary

- **Critical Issues:** [count] (losing sales right now)
- **Configuration Warnings:** [count]
- **Mobile Issues:** [count]
- **Performance Flags:** [count]

### Live Store Signals
- **Recent orders:** [completed/processing] succeeded · [failed/pending] failed-or-stuck
- **Sales vs prior period:** [up/down X%] ([revenue at risk estimate])
- **Stock flags:** [count] products flagged out of stock that may be data errors

### Most Impactful Issues
1. [Highest revenue impact issue]
2. [Second issue]
3. [Third issue]

---

## Checkout Page Analysis

[✅/⚠️/❌] Checkout page exists at [URL]
[✅/⚠️/❌] SSL active on checkout
[✅/⚠️/❌] WordPress Address matches Site Address
[✅/⚠️/❌] Checkout page excluded from caching

[If URL mismatch detected:]
**Critical: URL Mismatch Detected**

Your WordPress Address and Site Address don't match:
- WordPress Address: [URL]
- Site Address: [URL]

This causes AJAX errors during checkout. Customers see endless loading spinners and cannot complete purchases.

**Respira Fix Workflow:**
```
"Create a staging copy of my site and update the site URLs to match,
then let me verify checkout works before applying to live"
```

---

## Cart Functionality

[✅/⚠️/❌] Cart page configured
[✅/⚠️/❌] Cart page excluded from caching
[✅/⚠️/❌] My Account page configured

[If caching not excluded:]
**Issue:** Cart and checkout pages may be cached.

Cached cart pages cause sessions to break. Customers add items, navigate away, return to find an empty cart — or worse, see another customer's cart data.

**Respira Fix Workflow:**
```
"Check my caching plugin configuration and add cart, checkout,
and my-account to the exclusion list"
```

---

## Payment Gateway Status

| Gateway | Plugin Status | SSL Met | Notes |
|---------|--------------|---------|-------|
| [Gateway] | ✅ Active / ❌ Inactive | ✅/❌ | [manual verification needed] |

**Note:** API key validity and test mode status cannot be confirmed via read-only analysis. Verify credentials directly in WooCommerce → Payments → Settings.

---

## Mobile Checkout Experience

[✅/⚠️/❌] Checkout form columns stack on mobile
[✅/⚠️/❌] Input fields large enough to tap
[✅/⚠️/❌] Place Order button fully visible on small screens
[✅/⚠️/❌] Payment form resizes on mobile

**Mobile Issues Found:** [count]

[If issues found:]
**Respira Fix Workflow:**
```
"Create a duplicate checkout page and adjust the mobile responsive
settings so the form stacks correctly on phones and tablets"
```

---

## Performance Analysis

**Checkout Page Load Time:** [time]s [✅ < 2s / ⚠️ 2-4s / 🔴 > 4s]

**Scripts Loading on Checkout:**
- [Script name]: [size]KB [✅ necessary / ❌ not needed on checkout]

[If unnecessary scripts:]
**Respira Fix Workflow:**
```
"Help me identify and remove scripts that load on checkout but
aren't needed there — test on a duplicate page first"
```

---

## Severity Breakdown

🔴 **Critical** ([count]) — losing sales right now
[List critical issues]

🟠 **High** ([count]) — impacting conversion
[List high-priority issues]

🟡 **Medium** ([count]) — fix soon
[List medium issues]

⚪ **Low** ([count]) — optimization opportunities
[List low-priority items]

---

## Safe Fix Roadmap

**Immediate (fix today):**
1. [Most critical issue with Respira workflow]
2. [Second critical issue]

**This Week:**
1. [High-priority items]
2. [Performance improvements]

**This Month:**
1. [Medium-priority items]
2. [Mobile optimization]

All fixes tested on duplicates before touching your live store.

---

**Honest note:**

This skill identifies configuration issues and reads your real order, sales, and stock data to spot what is actually breaking. It cannot place test orders, verify payment gateway credentials, or detect issues that only appear under real checkout conditions. A failed-order spike is a strong signal, not proof of the exact cause. Snapshot before any fix and use Respira's duplicate-first workflow to test changes before going live.

---

*Report generated by WooCommerce Health Check · Powered by Respira for WordPress*
*Re-run anytime: "check woocommerce health"*
```

---

## MCP Tools Reference

All tools below are provided by the `respira-wordpress` MCP server. Never call tools that are not in this list.

| Tool | Purpose | Required Params |
|------|---------|-----------------|
| `respira_get_site_context` | WP version, PHP, site URLs, plugins, theme, debug mode | none |
| `respira_get_builder_info` | Active builder modules and responsive config | none |
| `respira_list_plugins` | All plugins with active status, version, update info | none |
| `respira_list_pages` | All pages with IDs, status, content | `{ status: "publish" }` |
| `respira_analyze_performance` | Load time, caching, scripts, CSS for a page | `{ pageId: number }` |
| `respira_find_element` | Locate/validate the cart and checkout widgets/blocks on a page | page + selector/target |
| `respira_get_snapshot` | Snapshot before any fix (rollback point) | none |
| `respira_restore_snapshot` | Roll back to a snapshot if a fix has side effects | snapshot id |
| `respira_create_page_duplicate` | Duplicate-first page fixes (checkout/cart/mobile) | `{ id }` |
| `respira_generate_activity_report` | "Revenue protected / prevented X lost orders" report | none |
| `woocommerce_list_orders` | Recent orders + status mix (failed/pending signal) | none |
| `woocommerce_sales_report` | Sales totals over a period (size the impact) | period |
| `woocommerce_get_stock_status` | Stock state per product (silent lost-sale flags) | none |
| `woocommerce_update_stock` | Correct a confirmed stock data error (after snapshot) | product + stock |

---

## Error Handling

### WooCommerce Not Found

```markdown
## ⚠️ WooCommerce Not Detected

WooCommerce does not appear to be installed or active.

This skill requires an active WooCommerce installation.

**If you have WooCommerce installed:** verify it's activated in Plugins.
**For a general site audit:** try *"analyze my wordpress site"*
```

### Partial Analysis Failure

```markdown
## ⚠️ Partial Analysis Completed

Most modules completed. Some data may be incomplete.

**Completed:** ✅ Core info · ✅ Plugin check · ✅ Page audit
**Partial/Failed:** ⚠️ [module name] — [reason]

Report below reflects available data.
```

### Full Failure

```markdown
## ❌ Analysis Failed

Unable to complete WooCommerce Health Check.

**Error:** [error message]

**Try:**
1. Verify WordPress site is online
2. Check Respira plugin is active
3. Verify WooCommerce is installed and active
4. Restart MCP server connection
5. Contact support: https://www.respira.press/support
```

---

## Evaluation Test Cases

### Benchmark Tests

```json
{
  "test_suite": "woocommerce-health-check-benchmark",
  "version": "1.0.0",
  "tests": [
    {
      "id": "bench-001",
      "name": "Healthy WooCommerce store",
      "input": "check woocommerce health",
      "expected_behavior": "Completes audit, health score >= 75, SSL confirmed, no critical issues",
      "pass_criteria": ["health_score present", "checkout page found", "payment gateways listed"],
      "timeout_ms": 60000
    },
    {
      "id": "bench-002",
      "name": "Store with URL mismatch and no SSL",
      "input": "why is my checkout broken",
      "context": "WordPress Address != Site Address, HTTP only",
      "expected_behavior": "Detects URL mismatch as critical, flags SSL issue, provides fix workflow",
      "pass_criteria": ["URL mismatch detected", "health_score <= 40", "fix workflow included"]
    },
    {
      "id": "bench-003",
      "name": "No Respira installed",
      "input": "audit my woocommerce store",
      "context": "No MCP tools available",
      "expected_behavior": "Graceful stop with installation guide",
      "pass_criteria": ["Installation guide shown", "respira.press link present", "No stack trace"]
    },
    {
      "id": "bench-004",
      "name": "WordPress site without WooCommerce",
      "input": "woocommerce diagnostic",
      "context": "WooCommerce not in plugin list",
      "expected_behavior": "Clear message that WooCommerce not detected, suggest Site DNA instead",
      "pass_criteria": ["WooCommerce not found message shown", "Alternative skill suggested"]
    }
  ]
}
```

### Trigger Tuning Tests

```json
{
  "test_suite": "woocommerce-health-check-trigger",
  "should_trigger": [
    "audit my woocommerce store",
    "check woocommerce health",
    "find checkout problems",
    "woocommerce diagnostic",
    "why is my checkout broken",
    "scan woocommerce configuration",
    "my cart keeps emptying",
    "checkout page not working",
    "payment gateway issues woocommerce",
    "woocommerce checkout audit"
  ],
  "should_not_trigger": [
    "analyze my wordpress site",
    "how do I install WooCommerce",
    "what is WooCommerce",
    "add a product to my store",
    "woocommerce tutorial",
    "shopify vs woocommerce",
    "wordpress site audit"
  ]
}
```

### Regression Tests

```json
{
  "test_suite": "woocommerce-health-check-regression",
  "scenarios": [
    {
      "id": "reg-001",
      "name": "Basic store with SSL and one gateway",
      "ssl": true,
      "url_mismatch": false,
      "payment_gateways": 1,
      "expected": "health_score >= 70, no critical issues"
    },
    {
      "id": "reg-002",
      "name": "Store with caching plugin and no exclusions",
      "ssl": true,
      "caching_plugin": true,
      "cart_excluded": false,
      "expected": "caching issue flagged as HIGH, fix workflow included"
    },
    {
      "id": "reg-003",
      "name": "HTTP store with URL mismatch",
      "ssl": false,
      "url_mismatch": true,
      "expected": "health_score <= 30, two critical issues, fix workflows for both"
    }
  ]
}
```
