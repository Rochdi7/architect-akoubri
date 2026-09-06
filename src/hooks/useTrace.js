import { useRef } from 'react';
import { CONDITIONS, useGsapScene } from '../lib/motion';

/* Le tracé — the journey timeline's rule is drawn as it is read.

   A dark line (--zv-primary, via the .m3-trace rule) sits over the existing
   grey hairline and scales down it as the reader scrolls. Its trigger is the
   line itself, from `top` to `bottom` at the same viewport mark, so the tip
   of the ink always sits on that mark: it reaches each step's marker at the
   exact moment the marker reaches 72% of the viewport — a plotter pen
   following the reader, not a bar racing ahead of them. Scrubbed both ways.

   The line is a new, purely decorative element (`aria-hidden`), kept at
   scaleY(0) by CSS; nothing else on the page is touched, so with the layer
   off the timeline is exactly the rule and dots it has today.

   Markup contract (Agency.jsx › Journey): one new
     <span ref={…} aria-hidden="true" className="m3-trace" />
   as a sibling of the existing hairline, inside the `ol.relative`.        */

const MARK = '72%';

function build({ gsap, mm, scope }) {
  mm.add(CONDITIONS, ({ conditions: { motion } }) => {
    if (!motion) return;
    const rail = scope.offsetParent || scope.parentElement;

    gsap.fromTo(
      scope,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        // The line itself cannot be the trigger: at scaleY(0) its bounding box
        // has no height, so start and end would coincide and the line would
        // snap to full. Measure the untransformed rail (the <ol>) plus the
        // line's layout offsets instead — as functions, so refresh() after a
        // reflow re-reads them.
        scrollTrigger: {
          trigger: rail,
          start: () => `top+=${scope.offsetTop} ${MARK}`,
          end: () => `top+=${scope.offsetTop + scope.offsetHeight} ${MARK}`,
          scrub: 0.6,
          onToggle: (self) => gsap.set(scope, { willChange: self.isActive ? 'transform' : 'auto' }),
        },
      }
    );
  });
}

export function useTrace() {
  const ref = useRef(null);
  useGsapScene(ref, build);
  return ref;
}
