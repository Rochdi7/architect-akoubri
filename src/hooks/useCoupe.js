import { useRef } from 'react';
import { CONDITIONS, replayOnScroll, useGsapScene } from '../lib/motion';

/* I. La coupe — the home portfolio mosaic is developed by a section line.

   Each tile arrives as an esquisse: its own render, desaturated and printed
   in the house navy under a drafting grid, rising into place. Then one cut
   line crosses the whole board from left to right, tied to the scroll, and
   what it leaves behind is the finished render. The heading promises a level
   of finish; the section shows the drawing becoming it.

   On desktop the three tiles share ONE line: it runs through the tall tile,
   jumps the gutter and carries on through the two stacked tiles together, so
   the board reads as a single sheet being cut. Below 1024px the mosaic is a
   single column, so every tile gets its own pass as it comes up the screen —
   the same move at the scale of a phone, not a fade in its place.

   This replaces a scrubbed perspective tilt (rotateX/rotateY + translateZ).
   Wherever the reader stopped, the tilt left the board resting crooked, and
   a crooked board says nothing about the work. A half-developed board does:
   stop mid-cut and the screen holds the drawing and the building side by
   side.

   Three movements, each on its own element so no two fight over a property:

     rise     one-shot per tile, on the Link — the esquisse lifts in. Replays
              from either direction (replayOnScroll) and clears its inline
              styles on completion.
     cut      scrubbed per group, through the `--cut` custom property on
              .m3-coupe-media. The stylesheet derives both the esquisse's
              clip-path and the line's position from that one number, so the
              line can never drift off the edge it is drawing. The media
              de-zooms over the same span.
     drift    scrubbed per tile across its whole passage — a slow vertical
              parallax inside the frame, so the mosaic keeps moving after
              the cut is done.

   The caption lines rise from their masks once the line is most of the way
   through their tile, and drop back if the scroll reverses past it.

   The esquisse and the line live INSIDE the media wrapper: they scale and
   drift with the render, so the two prints stay registered pixel for pixel
   along the cut. Nothing carrying data-reveal is ever clipped — the Links
   gave theirs up; GSAP owns this entrance outright.

   GSAP moves the media wrapper, never the <img>: .zv-tile img carries a
   900ms CSS transition on transform for its hover zoom, and a tween written
   through that transition would lag a second behind the scroll.

   Markup contract (Home.jsx › Portfolio):
     .m3-coupe                    the mosaic grid — the scope ref
       .m3-coupe-tile             grid-display wrapper around each Link
         Link.zv-tile             rises (no data-reveal)
           .m3-coupe-media        scaled + drifted; carries --cut
             img                  the render
             .m3-coupe-draft      the esquisse: duplicate img, tint, grid, tag
             .m3-coupe-line       the section line
           .zv-tile-cap > span    caption lines

   At rest, or with the layer off, the esquisse and the line are hidden by
   the stylesheet and the section is three plain captioned tiles.          */

const ZOOM = { from: 1.2, to: 1.07 }; // media scale across the cut
const DRIFT = 2.5;                    // ±yPercent; must stay under (ZOOM.to − 1) / 2
const CAPTION_AT = 0.62;              // local cut progress that releases the caption

const clamp01 = (n) => Math.min(1, Math.max(0, n));

function build({ gsap, ScrollTrigger, mm, scope, ease }) {
  const tiles = gsap.utils.toArray('.m3-coupe-tile', scope);
  if (!tiles.length) return;

  mm.add(CONDITIONS, ({ conditions: { motion, desktop } }) => {
    if (!motion) return undefined;

    const parts = tiles.map((tile) => ({
      tile,
      link: tile.querySelector('.zv-tile'),
      media: tile.querySelector('.m3-coupe-media'),
      lines: gsap.utils.toArray('.zv-tile-cap > span', tile),
      caption: null,
      shown: false,
    }));

    parts.forEach((part, i) => {
      const { tile, link, media, lines } = part;

      // rise — the esquisse lifts in.
      const rise = gsap.timeline({
        paused: true,
        onStart: () => gsap.set(link, { willChange: 'transform, opacity' }),
        onComplete: () =>
          gsap.set(link, { clearProps: 'transform,opacity,visibility,willChange' }),
      });
      rise.fromTo(
        link,
        { autoAlpha: 0, y: desktop ? 64 : 40 },
        // The two stacked tiles trail the tall one they share a top edge with.
        { autoAlpha: 1, y: 0, duration: 1, ease, delay: desktop ? i * 0.12 : 0 }
      );
      replayOnScroll({ ScrollTrigger, animation: rise, trigger: tile, start: 'top 92%' });

      // caption — each line rises out of its own mask. The clip tracks the
      // translate one for one, so the window stays put while the text moves.
      part.caption = gsap.timeline({ paused: true });
      part.caption.fromTo(
        lines,
        { yPercent: 100, clipPath: 'inset(0% 0% 100% 0%)' },
        { yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease, stagger: 0.09 }
      );

      // drift — parallax inside the frame, the tile's whole passage.
      gsap.fromTo(
        media,
        { yPercent: -DRIFT },
        {
          yPercent: DRIFT,
          ease: 'none',
          scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    });

    // cut — one line per group. Desktop: the whole board. Phone: tile by tile.
    const groups = desktop ? [parts] : parts.map((part) => [part]);

    groups.forEach((group) => {
      const trigger = desktop ? scope : group[0].tile;
      const medias = group.map((part) => part.media);
      const state = { p: 0 };
      let spans = [];

      // Horizontal extents only, so neither the scroll position nor the rise
      // (a vertical move, on the Link) can disturb them.
      const measure = () => {
        const boxes = group.map((part) => part.tile.getBoundingClientRect());
        const left = Math.min(...boxes.map((b) => b.left));
        const right = Math.max(...boxes.map((b) => b.right));
        spans = boxes.map((b) => ({ left, run: right - left, x: b.left, w: b.width }));
      };

      const paint = () => {
        group.forEach((part, i) => {
          const s = spans[i];
          const local = s && s.w ? clamp01((s.left + state.p * s.run - s.x) / s.w) : state.p;
          part.media.style.setProperty('--cut', local.toFixed(4));
          part.tile.classList.toggle('m3-coupe-live', local < 1);
          part.tile.classList.toggle('m3-coupe-cutting', local > 0 && local < 1);

          const show = local >= CAPTION_AT;
          if (show !== part.shown) {
            part.shown = show;
            if (show) part.caption.play();
            else part.caption.reverse();
          }
        });
      };

      measure();
      paint();

      gsap
        .timeline({
          defaults: { ease: 'none', duration: 1 },
          scrollTrigger: {
            trigger,
            start: desktop ? 'top 74%' : 'top 78%',
            end: desktop ? 'top 20%' : 'top 30%',
            scrub: 0.8,
            onRefresh: () => {
              measure();
              paint();
            },
          },
        })
        .fromTo(state, { p: 0 }, { p: 1, onUpdate: paint }, 0)
        .fromTo(medias, { scale: ZOOM.from }, { scale: ZOOM.to }, 0);
    });

    // Classes and the custom property are written by hand, so the context's
    // revert does not know about them.
    return () => {
      parts.forEach(({ tile, media }) => {
        tile.classList.remove('m3-coupe-live', 'm3-coupe-cutting');
        media.style.removeProperty('--cut');
      });
    };
  });
}

export function useCoupe() {
  const ref = useRef(null);
  useGsapScene(ref, build);
  return ref;
}
