# HTML to Bricks Builder

> Convert raw HTML/CSS into native Bricks elements — design system bound, ACSS aware.

A designer hands you HTML/CSS from a Webflow export. Or you have an old static page you want to bring into your live Bricks site. Or you exported from Figma and need to land it in Bricks for further editing. This skill converts the HTML into a native Bricks element tree, with three protections built in.

## What it does

1. Converts HTML/CSS into Bricks elements (`section`, `block`, `container`, `heading`, `text-basic`, `button`, `image`, etc.) — never inline HTML
2. **Maps colors and typography to your design system tokens** — so when the design system updates, the page updates with it
3. **ACSS class mapping** when ACSS is installed — uses ACSS utilities for spacing and typography instead of inline settings
4. SafeEdit on existing pages — never overwrites a live page directly

## Three input modes

- Paste HTML directly in the conversation
- Give a public URL (the skill fetches the HTML; external images are flagged, not silently mirrored)
- Reference an HTML file

## Why this resolves the open feature request

The top open feature request on the Respira board was "HTML to Bricks Builder." It's the most common pain point for designers handing off work to WordPress agencies. This skill closes that gap.

## Triggers

- *"convert this html to bricks"*
- *"import this design into bricks"*
- *"paste html into bricks"*
- *"turn this html into a bricks page"*

## Requires

- Respira for WordPress plugin
- **Bricks Builder active** (the skill verifies and stops if Bricks isn't the active builder)
- MCP server connected
- Recommended: design system synthesized first so token mapping works

## What it does NOT do

- Convert HTML for Elementor, Divi, Gutenberg, or other builders (use the generic `convert_html_to_builder` workflow instead)
- Re-host external images automatically (flagged, never silently mirrored)
- Convert HTML forms into Bricks Form element 1:1 (flagged; you wire the form manually)
- Convert CSS keyframe animations (flagged)
