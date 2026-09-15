import { useRef } from 'react';
import { CONDITIONS, settleIfPassed, useGsapScene } from '../lib/motion';

/* III. Les volets — the alternating service rows reveal behind a rising mask.

   The row's media block is uncovered by a clip-path window that opens from
   the bottom, while the image inside drifts up behind it and settles: the
   render appears to be drawn onto the page rather than dropped on it. The
   text column trails in 0.08s later from the outer side, as before.

   This replaces an earlier rotateY "shutter" hinge (±32deg on a 1400px
   perspective). The hinge left the panel visibly skewed for most of its
   travel, which read as a rendering fault on a photographic render rather
   than as motion, and any interruption before onComplete stranded it that
   way. A mask never distorts the image: at every point of the tween the
   visible part of the render is upright and true to its aspect ratio.

   The image drifts further than the mask travels, so the two move at
   different rates and the reveal has depth — the parallax is what keeps a
   simple wipe from looking like a loading bar.

   One-shot; every inline style is cleared on completion so the row rests
   exactly as rendered.

   Markup contract (Services.jsx › service rows):
     [ref]          the existing `.shell` column — the scope
       row          the existing grid row (keeps its data-reveal)
         .m3-volet  block wrapper around the existing .zv-media
         div        the existing text column (no data-reveal — GSAP may
                    tween it directly)                                     */

const RISE = { desktop: 68, phone: 44 };  // px the image drifts up behind the mask
const TRAIL = { desktop: 24, phone: 16 }; // px the text column slides in from

function build({ gsap, mm, scope, ease }) {
  const panels = gsap.utils.toArray('.m3-volet', scope);
  if (!panels.length) return;

  mm.add(CONDITIONS, ({ conditions: { motion, desktop } }) => {
    if (!motion) return;

    const rise = desktop ? RISE.desktop : RISE.phone;
    const trail = desktop ? TRAIL.desktop : TRAIL.phone;

    panels.forEach((panel, i) => {
      const row = panel.parentElement;
      const text = panel.nextElementSibling;
      const fromRight = i % 2 === 1;
      // The <img> inside .zv-media is what drifts; the panel carries the mask.
      const media = panel.querySelector('img') || panel.firstElementChild;
      const targets = text ? [panel, text] : [panel];

      const tl = gsap.timeline({
        defaults: { ease, duration: 1.1 },
        scrollTrigger: { trigger: row, start: 'top 80%', once: true },
        onStart: () =>
          gsap.set(targets, { willChange: 'transform, opacity, clip-path' }),
        onComplete: () =>
          gsap.set([...targets, media].filter(Boolean), {
            clearProps: 'transform,clipPath,opacity,willChange,scale',
          }),
      });

      // The mask opens upward. inset() keeps the panel's own border-radius,
      // so the rounded corners of .zv-media are preserved throughout.
      tl.fromTo(
        panel,
        { clipPath: 'inset(100% 0% 0% 0% round 18px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 18px)' },
        0
      );

      // The render drifts up further than the window travels, and a hair of
      // scale keeps its top edge from showing through at the start.
      if (media) {
        tl.from(media, { y: rise, scale: 1.06 }, 0);
      }

      if (text) {
        tl.from(text, { opacity: 0, x: fromRight ? -trail : trail }, 0.08);
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
