# Activity Report Composer

> Turn the audit log of work done on a WordPress site into a polished written report — in six different framings.

Respira tracks every edit, snapshot, and rollback on every connected site. This skill turns that log into a written report you can send to a client, publish as a case study, drop into your build-in-public feed, or file for your own records.

## What it does

Calls `respira_generate_activity_report` (new in v7.1) to pull the structured data — hours saved, edits made, top tools used, cost saved at agency rate, highlights — then walks the agent through writing the report in your chosen framing.

## The six framings

1. **Agency client report** — formal, addressed to the client, leads with the savings number
2. **Case study** — third-person narrative, anonymize toggle available
3. **Internal recap** — terse bullets for team standups
4. **Testimonial draft** — first-person quote in the operator's voice
5. **Build in public** — punchy, social-shaped, what shipped this week
6. **Personal recap** — log entry for your own records

## Output formats

- Markdown (for Notion, Linear, docs, email)
- Email-ready HTML
- Social-shaped (LinkedIn / X post length)

## Triggers

- *"generate a client report"*
- *"make a monthly report"*
- *"build a case study from this site"*
- *"what did I ship this month"*
- *"build-in-public summary"*

## Requires

- Respira for WordPress plugin **7.1+** (the underlying MCP tool is new in 7.1)
- MCP server connected
- Audit log enabled (default ON)
