# Page Template Library Bootstrapper

> Build the case study layout once. Spawn 50 case studies from it, on-brand, in seconds.

Captures the page patterns your team builds over and over — case studies, service pages, landing pages, team-member pages — as reusable **playbooks**. Future page-generation skills spawn new pages from playbooks instantly, on-brand, with the right structure.

## What it does

Two modes:

**Mode A — From an existing page.** "Save this page as a template." The skill extracts the structure, identifies which parts are structural vs which are slot-fillable, and saves the playbook.

**Mode B — From a pattern across multiple pages.** "All our case studies follow the same pattern — capture it." The skill samples 3–5 of your existing case studies, diffs them, identifies the common spine, and turns the variable parts into slots.

## What's in a playbook

- **Section spine:** the fixed structure (hero → 3-up grid → quote → CTA)
- **Components per section:** which builder modules to use
- **Slots:** the fields the user fills when spawning a new page (title, hero image, key stat, body copy, CTA, ...)
- **Design system bindings:** color tokens, typography tokens — so playbooks stay drift-resistant when the design system updates
- **Builder lock:** every playbook is locked to the builder it was captured from

## How playbooks get used

Once a playbook is saved, a future skill ("spawn a case study from playbook") collects the slot values and calls `respira_build_page` to materialize a new on-brand page in seconds.

The playbook + [design system](https://respira.press/skills/design-system-synthesizer) + [brand voice](https://respira.press/skills/brand-voice-synthesizer) trio is the foundation for the entire AI content-generation workflow on your site.

## Triggers

- *"save this as a template"*
- *"create a playbook from this page"*
- *"capture this layout"*
- *"make a reusable template from this"*
- *"build a page template library"*

## Requires

- Respira for WordPress plugin **7.1+** (the underlying MCP tools are new in 7.1)
- MCP server connected
- Recommended: [Design System Synthesizer](https://respira.press/skills/design-system-synthesizer) run first so playbooks bind to design tokens
