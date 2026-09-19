#!/usr/bin/env node
/* Verify every /media/… path referenced in src/ exists on disk.
 *
 * Why this exists: Vite's SPA fallback serves index.html with a 200 for a
 * missing file under /public, so a broken image looks like a success in the
 * network tab — it only shows up as alt text in the page. Checking the
 * filesystem is the reliable test.
 *
 * Run: node scripts/check-media-refs.mjs
 * Exits 1 if anything is missing, so it can gate a build or a commit hook.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = join(ROOT, 'src');
const PUBLIC = join(ROOT, 'public');

/* Walk src/ collecting every file we might reference media from. */
const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(jsx?|tsx?|css|html)$/.test(e)) files.push(p);
  }
})(SRC);
files.push(join(ROOT, 'index.html'));

/* `projects.js` builds paths as `${M}/name.webp` and img('name.webp'), so the
   literal string '/media/…' never appears. Resolve those forms too. */
const MEDIA_RE = /\/media\/[A-Za-z0-9._\-\/À-ɏ]+\.(?:webp|avif|png|jpe?g|svg|gif|mp4|webm)/g;
const IMG_RE = /\bimg\(\s*'([^']+\.(?:webp|avif|png|jpe?g|mp4))'/g;
const TPL_RE = /\$\{M\}\/([A-Za-z0-9._\-]+\.(?:webp|avif|png|jpe?g|mp4))/g;

const refs = new Map(); // path -> Set of source files
const add = (p, f) => {
  if (!refs.has(p)) refs.set(p, new Set());
  refs.get(p).add(f.replace(ROOT + '\\', '').replace(ROOT + '/', ''));
};

for (const f of files) {
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(MEDIA_RE)) add(m[0], f);
  for (const m of s.matchAll(IMG_RE)) add('/media/projets/' + m[1], f);
  for (const m of s.matchAll(TPL_RE)) add('/media/projets/' + m[1], f);
}

const missing = [];
for (const [p, sources] of refs) {
  if (!existsSync(join(PUBLIC, p))) missing.push([p, [...sources]]);
}

console.log(`Checked ${refs.size} media references across ${files.length} files.`);
if (missing.length === 0) {
  console.log('OK — every referenced media file exists.');
  process.exit(0);
}
console.error(`\n${missing.length} MISSING file(s):`);
for (const [p, sources] of missing) console.error(`  ${p}\n      ← ${sources.join(', ')}`);
process.exit(1);
