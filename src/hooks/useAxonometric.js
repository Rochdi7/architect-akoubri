import { useRef } from 'react';
import { CONDITIONS, useGsapScene } from '../lib/motion';

/* I. La parallaxe — the home portfolio mosaic on a gently pitched plane.

   The board pitches back a few degrees on X with a whisper of Y yaw, and the
   tiles separate along the board's own normal (translateZ inside a
   preserve-3d chain) — the near tile advancing, the far ones receding — so
   the mosaic reads as layered sheets catching the light at slightly
   different depths. A hairline edge fades in at the peak so each tile reads
   as a drawing sheet rather than a photo.

   This replaces an exploded axonometric that pitched the board to
   rotateX(52deg) rotateZ(-42deg). At that angle the renders were viewed so
   obliquely they stopped being readable: the tiles sheared into lozenges,
   their captions ran upside down along the lower edge, and the spun board's
   corners swung outside the grid and over the header. An architecture
   portfolio has to show the work — the drawing-board conceit is kept, but at
   an angle that flatters the renders instead of hiding them.

   Depth now does the work the rotation used to: the tiles are what move,
   pulling apart in Z while the board stays close to the picture plane. The
   angle reads as perspective rather than as distortion.

   Scroll-scrubbed and symmetrical: flat as the section enters at `top 80%`,
   peak at the midpoint, flat again as it leaves at `bottom 20%`. Nothing is
   left behind — at either end every inline style is cleared and the grid is
   byte-for-byte what React rendered.

   Below 1024px the mosaic is a single tall column: the yaw is dropped (a
   column has no width to spare) and the pitch and depth are eased back so
   the near edge never bleeds off a 390px viewport.

   Markup contract (Home.jsx › Portfolio):
     .m3-axo        perspective wrapper — the scope ref
       .m3-axo-grid  the existing outer grid (+ class), the board that pitches
         .m3-axo-tile  grid-display wrapper around each Link.zv-tile
         .m3-axo-grid  the existing nested grid (+ class), preserve-3d only

   The Links keep their data-reveal; GSAP only ever touches the wrappers and
   the board, so the two systems never share an element.                    */

const PEAK = {
  //  rx: pitch back   ry: yaw   depth: Z spread across the tiles   lift: in-plane drift
  desktop: { rx: 9, ry: -5, depth: 150, lift: -14 },
  phone: { rx: 6, ry: 0, depth: 90, lift: -8 },
};

function build({ gsap, mm, scope }) {
  const board = scope.firstElementChild;
  const tiles = gsap.utils.toArray('.m3-axo-tile', scope);
  if (!board || !tiles.length) return;

  mm.add(CONDITIONS, ({ conditions: { motion, desktop } }) => {
    if (!motion) return;

    const peak = desktop ? PEAK.desktop : PEAK.phone;
    const last = Math.max(tiles.length - 1, 1);

    // Tiles separate around the middle of the stack rather than all receding:
    // the first advances toward the viewer, the last falls back, so the
    // mosaic opens out instead of sliding away as a block.
    const depth = (i) => peak.depth * (0.5 - i / last);

    const targets = [board, ...tiles];

    // Defined start for the edge ring so the first render has a number to
    // interpolate from; clearProps at the ends removes it again.
    gsap.set(tiles, { '--m3-edge': 0 });

    // The board's transform is written as a string rather than through
    // GSAP's transform shorthands so the rotation order is explicit and
    // stable: pitch on X first, then yaw on Y.
    const tilt = { rx: 0, ry: 0 };
    const writeTilt = () => {
      board.style.transform =
        tilt.rx || tilt.ry ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` : '';
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

    tl.to(tilt, { rx: peak.rx, ry: peak.ry, onUpdate: writeTilt }, 0)
      .to(tiles, { z: depth, y: (i) => peak.lift * i, '--m3-edge': 1 }, 0)
      .to(tilt, { rx: 0, ry: 0, onUpdate: writeTilt }, 1)
      .to(tiles, { z: 0, y: 0, '--m3-edge': 0 }, 1);
  });
}

export function useAxonometric() {
  const ref = useRef(null);
  useGsapScene(ref, build);
  return ref;
}
