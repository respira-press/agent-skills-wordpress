# Brand Voice Synthesizer

> Every blog post Claude writes, in your voice — not generic AI voice.

Reads 5–10 of your published posts and extracts your brand voice: tone, sentence length, lexicon you reach for, phrases you signature, words you never use. Persists the voice to your site so every future content-writing skill matches it.

## What it captures

- **Person:** "we" / "I" / "you" / mixed
- **Formality:** casual → approachable_professional → formal → academic
- **Sentence length:** avg + median + p90
- **Reading grade:** Flesch-Kincaid
- **Tone descriptors:** 3–5 adjectives (confident, direct, lightly playful, evidence-driven, ...)
- **Signature phrases:** the multi-word phrases you use repeatedly
- **Preferred lexicon:** words you reach for ("ship", "wire", "land")
- **Avoided lexicon:** words your site conspicuously never uses ("leverage", "synergy", "best-in-class")
- **Punctuation patterns:** em dashes, exclamation marks, oxford comma
- **Structural patterns:** opens with a question, ends with a CTA, uses bullet lists

Plus a paragraph from your own corpus as a "this is your voice" example, and a constructed counter-example showing what your voice is NOT.

## How it's used

Once captured, the voice is persisted at the site level. Every Respira content-writing skill from that point on reads the voice before writing — pronouns match, sentence length matches, avoided words stay out.

The **avoided lexicon** is the strongest signal. The agent will refuse to write "revolutionary" or "best-in-class" if your voice says you never use those words — even if a prompt asks for them.

## Triggers

- *"extract my brand voice"*
- *"what's my writing style"*
- *"analyze my tone"*
- *"build a voice guide"*

## Pairs with

[Design System Synthesizer](https://respira.press/skills/design-system-synthesizer) — together they form your complete brand foundation. Visual + verbal.

## Requires

- Respira for WordPress plugin **7.1+**
- MCP server connected
- At least 3 published posts to sample (5+ for a confident analysis)
