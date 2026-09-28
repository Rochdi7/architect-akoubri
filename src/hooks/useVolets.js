import { useRef } from 'react';
import { CONDITIONS, replayOnScroll, useGsapScene } from '../lib/motion';

/* III. Les volets — the alternating service rows open like a brise-soleil.

   Each render sits in a .svc-plate (CAD corner marks, a dimension line
   captioned « Fig. 0N — Métier »). Over the image lies the same render cut
   into vertical louvers. They start edge-on, reading as thin lines over a
   navy blueprint grid, and swing open in 3D as the row scrolls in — the
   visitor opens the façade screen onto the project with the scrollbar.
   Scrubbed, so scrolling back closes them again.

   Once fully open the plate is marked .is-built and the louvers step aside
   for the real <img>, so the resting state has no slat seams and keeps the
   usual hover zoom. The louver layer only appears when this scene builds
   (.is-louvered); without GSAP, or with reduced motion, the plain image
   is shown as rendered.

   History: first a rotateY "shutter" hinge on the whole panel (read as a
   rendering fault), then a clip-path window whose half-open state showed a
   square-cut edge on a rounded image (owner called it bugged), then a grey
   to colour fade (owner: "too simple", 2026-09-28).

   Markup contract (Services.jsx › service rows):
     [ref]              the existing `.shell` column — the scope
       row              the grid row (keeps its data-reveal)
         .svc-plate     figure: frame (img + .svc-louvers), corners, caption
         div            the text column (no data-reveal — GSAP tweens it) */

const TRAIL = { desktop: 24, phone: 16 }; // px the text column slides in from

function build({ gsap, ScrollTrigger, mm, scope, ease }) {
  const plates = gsap.utils.toArray('.svc-plate', scope);
  if (!plates.length) return;

  mm.add(CONDITIONS, ({ conditions: { motion, desktop } }) => {
    if (!motion) return;

    const trail = desktop ? TRAIL.desktop : TRAIL.phone;

    plates.forEach((plate, i) => {
      const row = plate.parentElement;
      const text = plate.nextElementSibling;
      const fromRight = i % 2 === 1;
      const louvers = plate.querySelectorAll('.svc-louver');
      const faces = plate.querySelectorAll('.svc-louver__face');
      const shades = plate.querySelectorAll('.svc-louver__shade');
      const corners = plate.querySelectorAll('.svc-plate__corner');
      const rule = plate.querySelector('.svc-plate__rule');
      const label = plate.querySelector('.svc-plate__label');

      plate.classList.add('is-louvered');

      // Flat slats, no 3D: a rotateY with perspective warped every slat into
      // a trapezoid mid-turn and read as a glitch (owner, 2026-09-28). Now
      // alternate slats slide in from above and below, from the centre out,
      // while the picture inside each counter-drifts. The mid-state is a
      // clean kinetic-façade stripe over the blueprint grid.
      const from = 'center';
      const dir = (k) => (k % 2 ? 1 : -1);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: plate,
          start: desktop ? 'top 88%' : 'top 92%',
          end: desktop ? 'center 50%' : 'center 55%',
          scrub: 0.7,
          onUpdate: (self) => plate.classList.toggle('is-built', self.progress > 0.995),
          onRefresh: (self) => plate.classList.toggle('is-built', self.progress > 0.995),
        },
      });

      tl.fromTo(corners, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, stagger: 0.03, ease: 'power2.out' }, 0);

      tl.fromTo(
        louvers,
        { yPercent: (k) => dir(k) * 102 },
        { yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: { each: 0.04, from } },
        0.05
      );
      tl.fromTo(
        faces,
        { yPercent: (k) => dir(k) * -35 },
        { yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: { each: 0.04, from } },
        0.05
      );
      tl.fromTo(shades, { opacity: 1 }, { opacity: 0, duration: 0.6, ease: 'power1.in', stagger: { each: 0.04, from } }, 0.05);

      if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0.35);
      if (label) tl.fromTo(label, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.25 }, 0.6);

      // The text is not scrubbed: a copy column dragging with the wheel reads
      // as lag. It plays once per entry, as before.
      if (text) {
        const tt = gsap.timeline({
          paused: true,
          onComplete: () => gsap.set(text, { clearProps: 'transform,opacity' }),
        });
        tt.from(text, { opacity: 0, x: fromRight ? -trail : trail, duration: 1, ease }, 0);
        replayOnScroll({ ScrollTrigger, animation: tt, trigger: row });
      }

      return undefined;
    });

    return () => plates.forEach((p) => p.classList.remove('is-louvered', 'is-built'));
  });
}

export function useVolets() {
  const ref = useRef(null);
  useGsapScene(ref, build);
  return ref;
}
