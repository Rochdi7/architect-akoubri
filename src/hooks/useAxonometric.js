import { useRef } from 'react';
import { CONDITIONS, useGsapScene } from '../lib/motion';

/* I. L'axonométrie — the home portfolio mosaic as an exploded axonometric.

   The board (the mosaic grid) tilts to rotateX(52deg) rotateZ(-42deg) — the
   angle an architect draws a building's layers at — while each tile lifts
   off it along the board's own normal (translateZ inside a preserve-3d
   chain), deepest tile last, with a small in-plane translateY so the layers
   read as separated sheets rather than a stack. A hairline edge fades in on
   each tile at the peak so it reads as a drawing sheet, not a photo.

   Scroll-scrubbed and symmetrical: flat as the section enters at `top 80%`,
   peak at the midpoint, flat again as it leaves at `bottom 20%`. Nothing is
   left behind — at either end every inline style is cleared and the grid is
   byte-for-byte what React rendered.

   Below 1024px the mosaic is a single tall column, so the same move runs at
   phone intensity: a lighter in-plane spin (a 42° spin would push a column
   wider than the screen) and a scale that shrinks the sheet at the peak and
   returns to 1, so the near edge never bleeds off a 390px viewport.

   Markup contract (Home.jsx › Portfolio):
     .m3-axo        perspective wrapper — the scope ref
       .m3-axo-grid  the existing outer grid (+ class), the board that tilts
         .m3-axo-tile  grid-display wrapper around each Link.zv-tile
         .m3-axo-grid  the existing nested grid (+ class), preserve-3d only

   The Links keep their data-reveal; GSAP only ever touches the wrappers and
   the board, so the two systems never share an element.                    */

const PEAK = {
  desktop: { rx: 52, rz: -42, s: 1, depth: -260, lift: -18 },
  phone: { rx: 48, rz: -8, s: 0.78, depth: -160, lift: -12 },
};

function build({ gsap, mm, scope }) {
  const board = scope.firstElementChild;
  const tiles = gsap.utils.toArray('.m3-axo-tile', scope);
  if (!board || !tiles.length) return;

  mm.add(CONDITIONS, ({ conditions: { motion, desktop } }) => {
    if (!motion) return;

    const peak = desktop ? PEAK.desktop : PEAK.phone;
    const depth = (i) => (peak.depth * i) / Math.max(tiles.length - 1, 1);
    const targets = [board, ...tiles];

    // Defined start for the edge ring so the first render has a number to
    // interpolate from; clearProps at the ends removes it again.
    gsap.set(tiles, { '--m3-edge': 0 });

    // The board's transform is written as a string rather than through
    // GSAP's transform shorthands: GSAP composes rotations in its own fixed
    // order (rotate → rotateY → rotateX), which would give rotate(-42deg)
    // rotateX(52deg) — a tilted board spun in screen space. An axonometric
    // is the other way round: spin the plan in its own plane first, then tilt
    // it back — rotateX(52deg) rotateZ(-42deg), exactly as specified.
    const tilt = { rx: 0, rz: 0, s: 1 };
    const writeTilt = () => {
      board.style.transform =
        tilt.rx || tilt.rz || tilt.s !== 1
          ? `rotateX(${tilt.rx}deg) rotateZ(${tilt.rz}deg) scale(${tilt.s})`
          : '';
    };

    const tl = gsap.timeline({
      // Scrubbed: linear so scroll maps 1:1 to progress; `scrub: 1` supplies
      // the smoothing. The house ease is for one-shot moves, not scrubs.
      defaults: { ease: 'none', duration: 1 },
      scrollTrigger: {
        trigger: scope,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        // Layer promotion only while the section is actually moving.
        onToggle: (self) => {
          if (self.isActive) {
            gsap.set(targets, { willChange: 'transform', backfaceVisibility: 'hidden' });
          }
        },
        // Fires once the smoothed scrub has caught up. At either extreme the
        // resting state is identity, so drop every inline style GSAP wrote.
        onScrubComplete: (self) => {
          if (self.progress <= 0 || self.progress >= 1) {
            gsap.set(targets, {
              clearProps: 'transform,willChange,backfaceVisibility,--m3-edge',
            });
          }
        },
      },
    });

    tl.to(tilt, { rx: peak.rx, rz: peak.rz, s: peak.s, onUpdate: writeTilt }, 0)
      .to(tiles, { z: depth, y: (i) => peak.lift * i, '--m3-edge': 1 }, 0)
      .to(tilt, { rx: 0, rz: 0, s: 1, onUpdate: writeTilt }, 1)
      .to(tiles, { z: 0, y: 0, '--m3-edge': 0 }, 1);
  });
}

export function useAxonometric() {
  const ref = useRef(null);
  useGsapScene(ref, build);
  return ref;
}
