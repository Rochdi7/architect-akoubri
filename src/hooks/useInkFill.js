import { useRef } from 'react';
import { CONDITIONS, useGsapScene } from '../lib/motion';

/* L'encrage — a display heading inked in as it is scrolled.

   Pencil first, ink after: the heading enters with its first words already
   inked (--zv-primary via currentColor) and the rest still in the pencil
   grey of --zv-gray-100. Scrolling draws the ink across the remaining words
   in reading order, one word at a time, each word filling left to right like
   a progress bar. Scrubbed, so it follows the thumb.

   Nothing is prepared in the markup. When the library resolves and motion
   is allowed, the heading's text nodes are split into word spans and the
   `.m3-ink-on` class switches the gradient on; on revert (route change,
   breakpoint change, unmount) the original text nodes are put back and the
   class removed, so the DOM returns to exactly what React rendered. With
   MOTION_3D off, reduced motion, or a failed chunk, the heading is plain
   text in its normal colour and nothing here ever runs.

   Two drive modes. By default the fill is scrubbed by the scroll position,
   which is right for a statement heading in the middle of a page. A hero
   title, though, is already past the scrub's start line on load — it would
   sit there permanently half-inked, because the reader never scrolls it
   *into* the range. `useInkFill({ play: true })` runs those on a timed
   tween instead, once, as the page settles.

   Markup contract: `ref` on the heading. Nothing else.                     */

const INITIAL_FILL = 0.5; // share of the words already inked when the heading enters
const START = 'top 80%';
const END = 'top 25%';

/* Self-playing (hero) mode. Long enough to read as deliberate, short enough
   that the title is fully inked before a reader could start scrolling. */
const PLAY_DURATION = 1.1;
const PLAY_DELAY = 0.15;

/* A scrub settling back to its start lands a few millionths short of the
   exact boundary (fill·count = 10.99999…); treat that as the boundary so a
   finished word never flips back to the clip-text gradient. */
const EPS = 1e-4;

/* A heading may already be designed as two tones: a run of words left in
   --zv-gray-100 by a span in the markup (the Services statement does this).
   Where that is the case the split records it, so the ink can start exactly
   at that boundary and the heading's resting appearance is the animation's
   own first frame rather than something this hook invents. */
function isPencil(node, root) {
  const grey = getComputedStyle(root).getPropertyValue('--zv-gray-100').trim().toLowerCase();
  if (!grey) return false;
  const el = node.parentElement;
  if (!el || el === root) return false;
  const own = getComputedStyle(el).color.trim().toLowerCase();
  const rootColor = getComputedStyle(root).color.trim().toLowerCase();
  if (own === rootColor) return false;
  // Compare as rendered: the token is a hex, the computed value is rgb().
  const probe = document.createElement('span');
  probe.style.cssText = `color:${grey};position:absolute;visibility:hidden`;
  root.appendChild(probe);
  const greyRgb = getComputedStyle(probe).color.trim().toLowerCase();
  probe.remove();
  return own === greyRgb;
}

function splitWords(el) {
  const originals = [];
  const words = [];
  const pencil = [];
  const nodes = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) if (n.nodeValue.trim()) nodes.push(n);

  nodes.forEach((node) => {
    const nodeIsPencil = isPencil(node, el);
    const frag = document.createDocumentFragment();
    node.nodeValue.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(' '));
        return;
      }
      const span = document.createElement('span');
      span.className = 'm3-ink-w';
      span.textContent = part;
      words.push(span);
      pencil.push(nodeIsPencil);
      frag.appendChild(span);
    });
    const placeholder = document.createComment('m3-ink');
    node.parentNode.replaceChild(placeholder, node);
    placeholder.parentNode.insertBefore(frag, placeholder);
    originals.push({ node, placeholder, inserted: Array.from(frag.childNodes) });
  });

  const restore = () => {
    originals.forEach(({ node, placeholder }) => {
      let cur = placeholder.previousSibling;
      // Remove everything this split inserted before the placeholder.
      const ours = new Set();
      originals.forEach((o) => o.placeholder === placeholder && o.inserted.forEach((x) => ours.add(x)));
      while (cur && ours.has(cur)) {
        const prev = cur.previousSibling;
        cur.remove();
        cur = prev;
      }
      placeholder.parentNode.replaceChild(node, placeholder);
    });
    el.normalize();
  };

  return { words, pencil, restore };
}

function makeBuild(play) {
    return function build({ gsap, mm, scope }) {
    mm.add(CONDITIONS, ({ conditions: { motion } }) => {
      if (!motion) return undefined;

      const { words, pencil, restore } = splitWords(scope);
      if (!words.length) {
        restore();
        return undefined;
      }
      scope.classList.add('m3-ink-on');

      // Only the one word that is mid-fill uses the background-clip gradient
      // (class m3-ink-p); every other word is plain text in a plain colour.
      // Clip-to-text anti-aliases differently from normal glyph fill, so this
      // keeps fully inked words pixel-identical to the heading as designed —
      // including a heading the markup already sets in two tones.
      const inkColor = getComputedStyle(scope).color;
      const pencilColor = getComputedStyle(scope).getPropertyValue('--zv-gray-100').trim();

      const count = words.length;
      // If the markup already splits the heading into inked and pencil runs,
      // start the fill at that boundary so the resting design is frame zero.
      // Otherwise fall back to the default share.
      const firstPencil = pencil.indexOf(true);
      // A very short heading ("Projets") has no room for a half-inked start:
      // at INITIAL_FILL its only word is already inked and nothing animates.
      // Those start from zero so the fill is still visible.
      const defaultStart = count > 2 ? INITIAL_FILL : 0;
      const start = firstPencil > 0 ? firstPencil / count : defaultStart;
      const state = { fill: start };
      const paint = () => {
        const f = state.fill * count;
        words.forEach((w, i) => {
          const t = Math.max(0, Math.min(1, f - i));
          if (t >= 1 - EPS) {
            w.classList.remove('m3-ink-p');
            w.style.removeProperty('--m3-ink');
            // A word the markup already inks keeps its inherited colour.
            w.style.color = pencil[i] ? inkColor : '';
          } else if (t <= EPS) {
            w.classList.remove('m3-ink-p');
            w.style.removeProperty('--m3-ink');
            w.style.color = pencil[i] ? '' : pencilColor;
          } else {
            w.style.color = inkColor;
            w.style.setProperty('--m3-ink', `${t * 100}%`);
            w.classList.add('m3-ink-p');
          }
        });
      };
      paint();

      // A hero title plays itself out on a timer; everything else is scrubbed
      // by the scroll position. Both drive the same `paint`, so the rendered
      // result is identical — only what advances `fill` differs.
      const tween = play
        ? gsap.to(state, {
            fill: 1,
            ease: 'none',
            duration: PLAY_DURATION,
            delay: PLAY_DELAY,
            onUpdate: paint,
          })
        : gsap.to(state, {
            fill: 1,
            ease: 'none',
            onUpdate: paint,
            scrollTrigger: { trigger: scope, start: START, end: END, scrub: 1 },
          });

      return () => {
        tween.kill();
        scope.classList.remove('m3-ink-on');
        restore();
      };
    });
  };
}

const buildScrub = makeBuild(false);
const buildPlay = makeBuild(true);

/* `play: true` for a heading that is already on screen at load (a hero);
   omit it for a heading the reader scrolls down to. */
export function useInkFill({ play = false } = {}) {
  const ref = useRef(null);
  useGsapScene(ref, play ? buildPlay : buildScrub);
  return ref;
}
