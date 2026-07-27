#!/usr/bin/env node
/**
 * Validate every skill in this repo.
 *
 * WHY THIS EXISTS.
 *
 * 28 of 39 SKILL.md files shipped without YAML frontmatter. The README has
 * always documented frontmatter as required, so this was a consistency gap
 * rather than a design decision, and nothing caught it. The consequence was not
 * cosmetic: `npx skills` and OpenCode both key off `name` and `description`, so
 * they SKIPPED those skills silently. A user installing the collection got a
 * partial install and no error explaining why. Reported by Jerry Gapinski.
 *
 * This runs in CI so it cannot happen again.
 *
 * Checks per skill directory:
 *   1. SKILL.md exists
 *   2. it opens with a YAML frontmatter block
 *   3. `name` is present and equals the directory slug (installers key on this)
 *   4. `description` is present and non-trivial
 *   5. the skill has an entry in skills.json, and the two agree on description
 *
 * And repo-wide: every skills.json entry points at a directory that exists.
 *
 * Usage: node scripts/validate-skills.mjs
 * Exit 0 clean, 1 with a list of failures.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS_DIR = join(ROOT, 'skills');

const fail = [];
const warn = [];

const catalogRaw = JSON.parse(readFileSync(join(ROOT, 'skills.json'), 'utf8'));
const catalog = Array.isArray(catalogRaw) ? catalogRaw : catalogRaw.skills || [];
const bySlug = new Map(catalog.map((e) => [e.slug, e]));

/** Minimal frontmatter reader. Avoids a dependency for five fields. */
function parseFrontmatter(text) {
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const block = text.slice(4, end);
  const out = {};
  for (const line of block.split('\n')) {
    // Top-level keys only. Nested `metadata:` children are indented and ignored.
    const m = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

const dirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

for (const slug of dirs) {
  const file = join(SKILLS_DIR, slug, 'SKILL.md');

  if (!existsSync(file)) {
    fail.push(`${slug}: no SKILL.md`);
    continue;
  }

  const text = readFileSync(file, 'utf8');
  const fm = parseFrontmatter(text);

  if (!fm) {
    fail.push(`${slug}: SKILL.md does not start with a YAML frontmatter block. npx skills and OpenCode will skip it.`);
    continue;
  }
  if (!fm.name) {
    fail.push(`${slug}: frontmatter has no \`name\``);
  } else if (fm.name !== slug) {
    fail.push(`${slug}: frontmatter name is "${fm.name}" but the directory is "${slug}". Installers key on the slug, so these must match.`);
  }
  if (!fm.description) {
    fail.push(`${slug}: frontmatter has no \`description\``);
  } else if (fm.description.trim().length < 25) {
    fail.push(`${slug}: description is too short to be useful to an agent picking a skill ("${fm.description}")`);
  }

  const entry = bySlug.get(slug);
  if (!entry) {
    warn.push(`${slug}: no entry in skills.json, so it will not appear in the marketplace`);
  } else if (entry.description && fm.description && entry.description.trim() !== fm.description.trim()) {
    warn.push(`${slug}: description differs between SKILL.md and skills.json`);
  }
}

for (const entry of catalog) {
  if (entry.slug && !dirs.includes(entry.slug)) {
    fail.push(`skills.json lists "${entry.slug}" but skills/${entry.slug}/ does not exist`);
  }
}

console.log(`Checked ${dirs.length} skills against skills.json (${catalog.length} entries).`);

if (warn.length) {
  console.log(`\n${warn.length} warning(s):`);
  warn.forEach((w) => console.log('  ! ' + w));
}

if (fail.length) {
  console.error(`\n${fail.length} error(s):`);
  fail.forEach((f) => console.error('  x ' + f));
  process.exit(1);
}

console.log('\nAll skills valid: frontmatter present, names match their directories, descriptions usable.');
