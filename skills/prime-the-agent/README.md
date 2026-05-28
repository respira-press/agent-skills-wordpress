# Prime the Agent

> Fast 30-second session-starter. Load the site, identify the builder, and prime your AI to stop writing raw HTML.

The single most common failure mode in AI WordPress editing is the agent generating `<div>` and `<section>` HTML instead of using the site's actual page builder. The result is a corrupted page that the editor can't open.

This skill is the preamble that fixes it. Run it at the top of any conversation about a WordPress site, before any editing work begins.

## What it does

In about 30 seconds, the agent:

1. Identifies the active site
2. Loads the WordPress + theme + plugin context
3. Identifies the active page builder (and its version)
4. Loads that builder's inline module schemas
5. Counts pages and custom post types
6. Outputs a short briefing and commits to the do-not-write-raw-HTML rule

## When to use

- Starting a new conversation about an existing site
- After an agent gets confused and starts writing raw HTML
- Before handing the conversation to a teammate or different AI client
- When MCP first connects to a site you've never worked on

## Triggers

Say any of:

- *"prime yourself"*
- *"prime the agent"*
- *"get ready to work on this site"*
- *"understand my site setup"*
- *"before we start"*
- *"give me a site briefing"*

## How it pairs with other skills

- **Use before [Site Onboarding](https://respira.press/skills/site-onboarding)** if you want a quick briefing first, then a deeper audit.
- **Use before [WordPress Site DNA](https://respira.press/skills/wordpress-site-dna)** for the full archaeological scan.
- **Use before any content-creation skill** so the agent generates builder-native content, not HTML.

## Requires

- Respira for WordPress plugin (free or paid)
- MCP server connected to your site

That's it. No add-ons, no special tier.
