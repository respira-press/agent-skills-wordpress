# Design System Synthesizer

> Every page you build, automatically on brand.

Tell Respira your site's design system, and every new page Claude generates matches your logo, colors, fonts, and component patterns.

## What it does

Reads 5–10 representative pages of your site (homepage, about, a service page, a typical blog post, contact), inspects your theme stylesheet, scans your media library for the logo and brand imagery, then synthesizes a complete design system: brand identity, color palette, typography scale, spacing scale, component patterns.

The system is persisted to your site as machine data AND as a visible style-guide page you can open in your browser.

## Two outputs, one workflow

1. **Machine source of truth** — saved in `wp_options.respira_design_system`. Every Respira content-creation skill reads this at the top of its workflow so new pages snap to your brand.
2. **Human-visible style-guide page** — a private (admin-only) page at `/design-system/` on your site that renders the synthesized tokens visually: color swatches with hex codes, typography samples in actual styles, spacing scale blocks, component previews, voice notes. Built with your active page builder so you can edit it like any other page.

You can promote the page to public any time if you want a /design-system/ landing on your live site.

## What's in the system

- **Brand:** logo URL, favicon, social card, wordmark
- **Colors:** primary, secondary, accent, neutrals (9-step scale), semantic (link / success / warning / error)
- **Typography:** heading family + weights + sizes (H1–H6), body family + weight + line-height, mono family
- **Spacing:** base unit, scale steps, section padding, container max width
- **Components:** button styles, card styles, hero patterns, section patterns
- **Voice hints:** person used (we / I / you), formality, average sentence length

## Triggers

- *"build a design system for my site"*
- *"extract my brand"*
- *"synthesize a design system"*
- *"create my design tokens"*
- *"what does my site look like"*

## How other skills use it

Future content skills (page generators, section builders, blog post writers) call `respira_get_option('respira_design_system')` at the top of their workflow. The tokens give the agent explicit values for colors, fonts, spacing, and patterns — no more invented hex codes, no more random font sizes.

Pair with the **Brand Voice Synthesizer** for the full brand foundation (visual + verbal).

## Requires

- Respira for WordPress plugin **7.1+**
- MCP server connected
