---
name: brand-voice-synthesizer
description: "Use when the user says 'extract my brand voice', 'what is my writing style', or 'analyze my tone', or before any skill that writes copy for the site. Reads 5-10 published posts and persists tone, lexicon, sentence patterns, formality, signature phrases, and phrases the site never uses."
license: MIT
metadata:
  author: Respira for WordPress
  author_url: https://respira.press
  version: 1.2.0
  mcp-server: respira-wordpress
  category: intelligence
---

# Brand Voice Synthesizer

**Version:** 1.2.0
**Updated:** 2026-09-13
**Freshly updated:** v1.2.0 saves the voice to Site Memory with `respira_remember`, so every later session, in any AI client, reads it through `respira_get_site_context` with no extra call. The full profile stays with the user; the site keeps a distilled form that fits memory's 500-character entries. Plugins older than 8.3 keep the `respira_brand_voice` option. v1.1.0 wired the voice profile into the rest of the brand system. The extracted profile now persists to per-site memory via `respira_get_option` (diff first) + `respira_update_option`, cross-links explicitly with the Page Template Library and Design System Synthesizer skills so copy and layout share one brand foundation, and adds a brand-consistency report built from `respira_generate_activity_report` so you can see how on-voice recent content actually is.
**Category:** intelligence
**Status:** stable
**Requires:** Respira for WordPress plugin 8.3+ for Site Memory (older plugins fall back to an option) + MCP server

---

## Description

Read 5–10 published posts on a WordPress site and extract the **brand voice** — tone, lexicon, sentence patterns, person used, formality, signature phrases, phrases the site never uses. Persist it to the site so every future content-writing skill produces copy that sounds like the brand, not like generic AI.

This is the verbal counterpart to the [Design System Synthesizer](https://respira.press/skills/design-system-synthesizer). The two together form a complete brand foundation that every future content-generation skill references.

---

## What it produces

A structured `brand_voice` artifact stored at the site level. Schema:

```json
{
  "version": "1.1.0",
  "synthesized_at": "2026-05-24T14:30:00Z",
  "synthesized_from": ["/blog/post-a/", "/blog/post-b/", "..."],
  "n_samples": 8,
  "total_words_sampled": 12450,
  "person": "we",
  "formality": "approachable_professional",
  "sentence_length_avg_words": 14,
  "sentence_length_median_words": 12,
  "sentence_length_p90_words": 28,
  "paragraph_length_avg_sentences": 3.2,
  "reading_grade_avg": 8.4,
  "tone_descriptors": ["confident", "direct", "lightly playful", "evidence-driven"],
  "signature_phrases": [
    "the short version is",
    "here's what we learned",
    "let's break that down"
  ],
  "common_openers": ["here's", "the", "we"],
  "common_closers": ["that's the lesson", "more soon", "questions welcome"],
  "lexicon_preferred": ["ship", "wire", "land", "tighten", "lean into"],
  "lexicon_avoided": ["leverage", "synergy", "best-in-class", "world-class", "innovative", "cutting-edge", "revolutionary"],
  "punctuation_patterns": {
    "em_dash_usage": "frequent",
    "exclamation_marks": "never",
    "oxford_comma": true,
    "ellipsis_usage": "rare",
    "parenthetical_asides": "frequent"
  },
  "structural_patterns": {
    "opens_with_question": "sometimes",
    "uses_headings": "every_post",
    "uses_bullet_lists": "often",
    "uses_code_blocks": "for_technical_posts",
    "uses_blockquotes": "rare",
    "ends_with_call_to_action": "never"
  },
  "examples": {
    "good_paragraph": "We shipped the redesign last week. The short version is: fewer pages, more density, one CTA per screen. Conversion is up 18% on the new pricing page so far. We'll know more by end of month.",
    "bad_paragraph": "We are thrilled to announce the launch of our revolutionary new design! This best-in-class experience leverages cutting-edge UX innovations to deliver unparalleled value!"
  }
}
```

The full artifact is for the user to keep: paste it into a style guide or save it as a file. What the site keeps is a distilled form in Site Memory (Step 6), because memory arrives in every future session through `respira_get_site_context`, while an option only reaches a skill that knows to ask for it. Earlier versions planned a separate artifact store; Site Memory replaced that plan.

---

## When to Use

- First time setting up an AI workflow for a content-heavy site
- Before running any content-generation skill that produces written copy
- After a brand voice update (new style guide, new chief content officer, rebrand)
- Quarterly refresh — voice drifts; resynthesize to catch it

---

## Trigger Phrases

- "extract my brand voice"
- "what's my writing style"
- "analyze my tone"
- "build a voice guide"
- "synthesize my voice"
- "capture my writing style"
- "what's the voice of this site"

---

## Execution Workflow

### Step 1 — Confirm site

Call `respira_get_active_site` + `respira_get_site_context`.

### Step 2 — Pick representative posts

Call `respira_list_posts` with status=publish, limit=20. From the list, pick 5–10 posts that should represent the voice:

- Prefer recent posts (last 6 months) over older ones — voice drifts
- Prefer the site owner's posts over guest posts (look at `author`)
- Mix lengths: include short posts and long-form
- Skip auto-generated content (release notes if they're templated, automated changelogs)
- Skip translated content (the translator's voice contaminates the analysis)

If fewer than 5 posts exist, use whatever's there but note `n_samples` honestly.

### Step 3 — Extract each post's content

For each picked post, call `respira_read_post(post_id)` or `respira_extract_builder_content(post_id)` depending on the active builder. Strip:

- Code blocks (keep the descriptor but exclude the code from voice analysis)
- Embed shortcodes
- Image captions (usually different voice from body)
- Auto-generated footers (linkbacks, "subscribe" CTAs, etc.)

### Step 4 — Analyze

For the corpus of cleaned text, compute:

1. **Person:** Most-used pronoun (I / we / you / no-pronoun). If mixed, note the mix.
2. **Formality:** Read 5–10 random paragraphs. Place on a scale: casual / approachable_professional / formal / academic.
3. **Sentence length:** average, median, p90.
4. **Paragraph length:** average sentences per paragraph.
5. **Reading grade:** Flesch-Kincaid or similar.
6. **Tone descriptors:** 3–5 adjectives based on the corpus. Confident? Cautious? Playful? Direct? Evidence-driven? Storyteller?
7. **Signature phrases:** Repeated multi-word phrases that show up across multiple posts. These are the writer's tells.
8. **Common openers/closers:** How do paragraphs typically start and end?
9. **Lexicon preferred:** Verbs and nouns this writer reaches for. ("ship" instead of "release"; "wire" instead of "integrate"; "land" instead of "launch")
10. **Lexicon avoided:** Words *conspicuously absent* from the corpus that competitors or generic AI would use. ("leverage", "synergy", "best-in-class", "innovative", "revolutionary".) The absence is the signal.
11. **Punctuation patterns:** em dashes? exclamation marks? oxford comma? parenthetical asides?
12. **Structural patterns:** Do posts open with a question? Use headings? Bullet lists? End with a CTA?

### Step 5 — Show the synthesized voice to the user

Output a human-readable summary:

```markdown
## Brand voice synthesized for {site_url}

Based on {n_samples} published posts ({total_words_sampled:,} words sampled, mostly from the last 6 months).

**Person:** {person} ("we" / "I" / "you" / mixed)
**Formality:** {formality}
**Sentence length:** ~{sentence_length_avg_words} words avg ({sentence_length_p90_words}-word p90)
**Reading grade:** {reading_grade_avg}
**Tone:** {tone_descriptors joined}

**Signature phrases this site uses repeatedly:**
{signature_phrases as bulleted list}

**Words this site reaches for:**
{lexicon_preferred as inline list}

**Words this site conspicuously avoids:**
{lexicon_avoided as inline list}

**Punctuation quirks:**
- em dashes: {em_dash_usage}
- exclamation marks: {exclamation_marks}
- oxford comma: {oxford_comma}

**Structural patterns:**
- Opens with a question? {opens_with_question}
- Uses headings? {uses_headings}
- Ends with a CTA? {ends_with_call_to_action}

**A paragraph that sounds like you:**
> {examples.good_paragraph from the corpus}

**A paragraph that does NOT sound like you (generic AI):**
> {examples.bad_paragraph as a constructed counter-example}
```

Ask the user: *"Does this match how you'd describe your voice? Anything to add or correct?"*

### Step 6: Save the voice to Site Memory

Site Memory is the site's own memory. Every entry arrives in `respira_get_site_context` under `site_memory`, for every later session and every AI client, with no extra call. Entries are capped at 500 characters, so save a distilled voice, not the JSON.

1. **Read what is there.** Call `respira_list_memory` and look for the `brand-voice` and `brand-voice-avoid` keys. If they exist, show the user what would change (person, tone, added or removed words) before replacing anything. Never replace a saved voice silently.
2. **Distill into two entries**, each under 500 characters:
   - `brand-voice`, type `preference`: person, formality, sentence length, tone and signature phrases in two or three sentences. For example: "Write in first person plural, approachable and direct. Sentences average 14 words; paragraphs stay under four sentences. Reach for ship, wire, land, tighten. Signature opener: 'the short version is'."
   - `brand-voice-avoid`, type `preference`: the avoided words and the punctuation habits. For example: "Never use: leverage, synergy, best-in-class, world-class, innovative, cutting-edge, revolutionary. No exclamation marks. Oxford comma on."
3. **Ask, then save.** The voice is inferred, not something the user said, so show both entries and save them with `respira_remember` only after the user says yes. Use type `preference`, never `rule`: a rule is enforced on every write and only the owner can remove it, which is wrong for a style.
4. **Verify.** `respira_list_memory` shows both keys with today's date.

On a plugin older than 8.3 there are no memory tools. Fall back to the option: diff with `respira_get_option('respira_brand_voice')`, write with `respira_update_option('respira_brand_voice', <json>)` after the user says yes, and read it back.

Output: *"Brand voice saved to this site's memory as two entries, brand-voice and brand-voice-avoid. Every later session reads them automatically, whichever AI client opens the site. The avoided-words entry is the strongest signal: the agent will not use those words even when a prompt suggests them."*

### Step 7 — Brand-consistency report (optional)

The voice profile is also a yardstick: it tells you whether content *already on the site* sounds on-brand. Pull the recent work log with `respira_generate_activity_report` (it returns what was published/edited and when), then sample those pages/posts and score them against the saved profile:

- **On-voice:** matches person, sentence length, and reaches for the preferred lexicon.
- **Off-voice:** uses avoided words, wrong person, or marketing-superlative drift.

Report it plainly: *"Of the last 12 published posts, 9 are on-voice. 3 drift toward the avoided lexicon ('revolutionary', 'best-in-class') — likely the templated launch posts. Want me to rewrite those to match?"* This turns the voice profile from a passive artifact into an active consistency check, and pairs naturally with the rewrite skills.

---

## How other skills use the brand voice

Once saved, the voice arrives in the `site_memory` block of `respira_get_site_context`, so every content-writing skill (page generators, blog post drafters, social post composers) has it at the top of its workflow with no extra call. `respira_list_memory` shows the two entries by key. On plugins older than 8.3, read the `respira_brand_voice` option instead. Skills use the voice to:

- Pick pronouns matching the site's person
- Match sentence length and reading grade
- Reach for the preferred lexicon
- Refuse to use the avoided lexicon
- Match punctuation patterns
- Match structural patterns (open with question? end with CTA?)

The **avoided lexicon** is the strongest signal. When the agent is about to write "revolutionary" or "best-in-class," the voice artifact says *"this site never uses that word"* and the agent picks a more honest verb.

### Pairs with

The brand voice is one half of the brand foundation. It works best alongside two sibling skills:

- **[Design System Synthesizer](https://respira.press/skills/design-system-synthesizer)** — the visual half (colors, typography, spacing, components, stored as `respira_design_system`). Voice covers *how the words read*; the design system covers *how the page looks*. Run both so generated content is on-brand top to bottom. The Design System Synthesizer's style-guide page even links back here for the full voice.
- **Page Template Library** — when it assembles a page from a saved template, it should use the `brand-voice` memory entries so the placeholder copy it drops in already sounds like the site, not like lorem-ipsum or generic AI. Voice supplies the words; the template supplies the layout.

If only one of the two artifacts exists, content skills should still use what's there — but flag to the user that running the missing synthesizer would tighten the result.

---

## Hard rules

- The voice is observed, not designed. Don't invent. Every descriptor traces to evidence in the corpus.
- The avoided lexicon is the **inverse signal** — words conspicuously absent. Don't include common stop words ("the", "and", "is"). Include words that competitor sites would use heavily but this site doesn't.
- The "good paragraph" example must be a real paragraph from the corpus, quoted verbatim. The "bad paragraph" example is a constructed counter-example using the avoided lexicon.
- Never overwrite an existing brand voice silently. Show the diff before saving.
- Save the voice as a `preference`, never a `rule`, and only after the user says yes.
- If the corpus is mixed-author (multiple writers' voices), say so honestly: *"This site has 3 distinct voices in the sampled posts. Pick one author to synthesize from, or capture all 3 as separate voices."*

---

## Tooling

**Reading the corpus (source of truth)**
- `respira_get_active_site`
- `respira_get_site_context`
- `respira_list_posts`
- `respira_read_post`
- `respira_extract_builder_content`

**Persisting + reporting**
- `respira_list_memory`: find an existing `brand-voice` entry before replacing it
- `respira_remember`: save the two distilled entries, type `preference`
- `respira_forget`: remove an old voice entry the user says is wrong
- `respira_get_option` and `respira_update_option`: the fallback on plugins older than 8.3
- `respira_generate_activity_report`: recent published and edited work for the brand-consistency check (plugin 9.0 and later list it as a tool; on older plugins call `respira_invoke_ability` with `ability: "respira/generate-activity-report"` and the same arguments under `args`)

Pairs with the Design System Synthesizer (`respira_design_system` via `respira_get_option`) and the Page Template Library. Use only `respira-wordpress` MCP tools; never invent a tool name.

---

## Telemetry

Records: site URL hash, number of posts sampled, total words analyzed, person detected, formality detected, success/failure. No actual phrases, no avoided words, no example paragraphs are sent.

Endpoint: `POST https://www.respira.press/api/skills/track-usage`
