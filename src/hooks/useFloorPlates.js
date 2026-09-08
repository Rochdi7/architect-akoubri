import { useRef } from 'react';
import { CONDITIONS, settleIfPassed, useGsapScene } from '../lib/motion';

/* II. Les plateaux — the dark stats band as stacking floor plates.

   Each stat arrives from translateZ(-400px) rotateX(-25deg) at opacity 0 and
   lands flat, staggered 0.12s, like floor plates dropped onto a core. The
   figure counts up on the same timeline. One-shot; on completion every
   inline style is cleared so the band rests exactly as rendered. The same
   move runs on a phone — four small cards are cheap to composite, and the
   2×2 grid there reads as two stacked pairs of plates.

   Markup contract (Home.jsx › ImpactBand):
     .m3-plates   the existing stats grid (+ class, + ref) — perspective
       .m3-plate  block wrapper around each stat div (which keeps data-reveal)

   The count-up mutates the text of the existing `.zv-h2` value node. That is
   the one place this layer touches something React rendered, so it is
   guarded twice: the exact original string is written back when the count
   completes, and again when the matchMedia branch is reverted (route change
   mid-count). Under reduced motion the text is never touched at all.        */

const DROP = { z: -400, rotateX: -25, opacity: 0, transformOrigin: '50% 100%', stagger: 0.12 };

function makeCounter(el) {
  if (!el) return null;
  const original = el.textContent;
  const m = /^(\d+)(.*)$/.exec(original.trim());
  if (!m) return null; // not a figure we know how to count
  const target = Number(m[1]);
  const suffix = m[2];
  const proxy = { n: 0 };
  return {
    proxy,
    target,
    write: () => {
      el.textContent = `${Math.round(proxy.n)}${suffix}`;
    },
    restore: () => {
      el.textContent = original;
    },
  };
}

function build({ gsap, mm, scope, ease }) {
  const plates = gsap.utils.toArray('.m3-plate', scope);
  if (!plates.length) return;

  mm.add(CONDITIONS, ({ conditions: { motion } }) => {
    if (!motion) return;

    const counters = plates.map((p) => makeCounter(p.querySelector('.zv-stat-value')));

    const tl = gsap.timeline({
      defaults: { ease, duration: 1.1 },
      scrollTrigger: { trigger: scope, start: 'top 80%', once: true },
      onStart: () =>
        gsap.set(plates, { willChange: 'transform, opacity', backfaceVisibility: 'hidden' }),
      // transformOrigin included: GSAP rewrites it in px and would otherwise
      // leave `transform-origin: 159px 58px` behind on every plate.
      onComplete: () =>
        gsap.set(plates, {
          clearProps: 'transform,transformOrigin,opacity,willChange,backfaceVisibility',
        }),
    });

    tl.from(plates, DROP, 0);

    counters.forEach((c, i) => {
      if (!c) return;
      tl.to(
        c.proxy,
        { n: c.target, duration: 1.4, snap: 'n', onUpdate: c.write, onComplete: c.restore },
        i * 0.12
      );
    });

    settleIfPassed(tl);

    // Revert of this branch (unmount, breakpoint change) restores the text.
    return () => counters.forEach((c) => c && c.restore());
  });
}

export function useFloorPlates() {
  const ref = useRef(null);
  useGsapScene(ref, build);
  return ref;
}
