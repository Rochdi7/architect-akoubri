import { useRef } from 'react';
import { CONDITIONS, settleIfPassed, useGsapScene } from '../lib/motion';

/* III. Les volets — the alternating service rows hinge open.

   Each row's media block swings on a vertical axis like a shutter or an
   elevation panel: hinged on its outer edge (left for a left-aligned row,
   right for a right-aligned one), from ±32deg to flat, with the text column
   trailing in 0.08s later. One-shot; every inline style is cleared on
   completion so the row rests exactly as rendered.

   Below 1024px the rows stack (media above text) and the panel spans the
   whole viewport, so the swing is eased back to ±26deg: at 32deg the free
   edge of a full-width panel comes far enough forward to bleed past the
   phone's edge. The hinge side still alternates row by row.

   Markup contract (Services.jsx › service rows):
     [ref]         the existing `.shell` column — the scope
       row          the existing grid row (keeps its data-reveal)
         .m3-volet   block wrapper around the existing .zv-media
         div         the existing text column (no data-reveal — GSAP may
                     tween it directly)                                     */

const ANGLE = { desktop: 32, phone: 26 };
const TRAIL = { desktop: 24, phone: 16 }; // px the text column slides in from

function build({ gsap, mm, scope, ease }) {
  const panels = gsap.utils.toArray('.m3-volet', scope);
  if (!panels.length) return;

  mm.add(CONDITIONS, ({ conditions: { motion, desktop } }) => {
    if (!motion) return;

    const angle = desktop ? ANGLE.desktop : ANGLE.phone;
    const trail = desktop ? TRAIL.desktop : TRAIL.phone;

    panels.forEach((panel, i) => {
      const row = panel.parentElement;
      const text = panel.nextElementSibling;
      const hingeRight = i % 2 === 1;
      const targets = text ? [panel, text] : [panel];

      const tl = gsap.timeline({
        defaults: { ease, duration: 1.1 },
        scrollTrigger: { trigger: row, start: 'top 80%', once: true },
        onStart: () =>
          gsap.set(targets, { willChange: 'transform, opacity', backfaceVisibility: 'hidden' }),
        onComplete: () =>
          gsap.set(targets, {
            clearProps: 'transform,transformOrigin,opacity,willChange,backfaceVisibility',
          }),
      });

      tl.from(
        panel,
        {
          rotateY: hingeRight ? angle : -angle,
          transformOrigin: hingeRight ? 'right center' : 'left center',
          transformPerspective: 1400,
        },
        0
      );

      if (text) {
        tl.from(text, { opacity: 0, x: hingeRight ? -trail : trail }, 0.08);
      }

      settleIfPassed(tl);
    });
  });
}

export function useVolets() {
  const ref = useRef(null);
  useGsapScene(ref, build);
  return ref;
}
