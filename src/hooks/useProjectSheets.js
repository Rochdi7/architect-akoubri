import { useRef } from 'react';
import { CONDITIONS, replayOnScroll, useGsapScene } from '../lib/motion';

/* VII. Les planches — the project grid as drawing sheets being plotted.

   Entrance, per card, in the order a sheet is actually made:

     1. le cadre    a clay line draws itself around the empty plate — the
                    frame is set out before anything is put in it
     2. la coupe    the render opens from a horizontal slit at mid-height,
                    two section lines riding the opening edges up and down
                    while the image settles back from a touch of scale
     3. le cartouche the copy rises line by line, and the glass tag drops
                    onto the render last

   Nothing here is 3D. The home mosaic's perspective tilt was rejected as
   generic; the moves on this site are drafting moves — drawn lines, masks,
   section cuts — and this one is the grid's own: the home board is cut left
   to right, the service rows rise from the sill, the plates here open from
   their centreline. The right-hand card of a row trails the left by a beat.

   Pointer, fine pointers only: a drafting crosshair follows the cursor
   across the render and four viewfinder corners close in on the plate — the
   reader is framing the project, not wobbling a tile. It sits alongside the
   existing moves (the CSS lift on .media-card, the frame swap in
   useCardHover) and touches neither of their elements.

   The article keeps its data-reveal: that fade is the baseline without the
   chunk, and it hides the card for the instant before GSAP applies a start
   state. Every inline style the entrance writes is cleared on completion.

   Markup contract (Projects.jsx › grid, ProjectCard.jsx):
     [ref]              the grid — the scope
       article          the card (+ data-reveal)
         .m3-sheet      the link
           .m3-plate    positioning wrapper around the well; NOT clipped, so
                        the frame and section lines can show while the well
                        under them is still shut
             .media-well    opened from its centreline
               .m3-drift    wrapper around the media — what scales, so
                            neither the CSS hover zoom nor useCardHover's
                            tween is fought for the image's own transform
               .m3-finder   crosshair + corners (hover)
               .media-tag   drops in last
             .m3-frame      svg; its <rect> is the drawn frame
             .m3-slit       ×2, the section lines
           .m3-copy     the text block; its children rise in turn          */

const FINE = '(hover: hover) and (pointer: fine)';
const SHUT = 'inset(50% 0% 50% 0% round 14px)';
const OPEN = 'inset(0% 0% 0% 0% round 14px)';

function build({ gsap, ScrollTrigger, mm, scope, ease }) {
  const sheets = gsap.utils.toArray('.m3-sheet', scope);
  if (!sheets.length) return;

  mm.add({ ...CONDITIONS, fine: FINE }, ({ conditions: { motion, fine } }) => {
    if (!motion) return undefined;

    const left = scope.getBoundingClientRect().left;
    const aborter = new AbortController();

    sheets.forEach((sheet) => {
      const card = sheet.parentElement;
      const well = sheet.querySelector('.media-well');
      const drift = sheet.querySelector('.m3-drift');
      const frame = sheet.querySelector('.m3-frame');
      const stroke = frame?.querySelector('rect');
      const slits = gsap.utils.toArray('.m3-slit', sheet);
      const tag = sheet.querySelector('.media-tag');
      const copy = gsap.utils.toArray('.m3-copy > *', sheet);
      if (!well) return;

      // Second column of a row: trails the first by a beat.
      const t0 = card.getBoundingClientRect().left - left > 40 ? 0.12 : 0;
      const cut = t0 + 0.45; // the frame is most of the way round by now

      /* The plate opens on `top 88%`, which is earlier than the browser's
         own lazy-load margin resolves: on a slow connection the cut ran on
         a card whose cover had not arrived, so the reveal uncovered an
         empty box with its alt text in it. The media is told to fetch as
         soon as the scene is built — the card is a screen or two away by
         then, which is exactly when a lazy image should be coming in — and
         the entrance additionally waits for the decode (see `armed`). */
      const media = sheet.querySelector('img[data-card-img="base"], video');
      if (media) {
        if (media.tagName === 'IMG') {
          media.loading = 'eager';
          media.fetchPriority = 'low';
        } else if (media.preload === 'none') {
          media.preload = 'metadata';
        }
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease, duration: 1.1 },
        onStart: () => gsap.set(well, { willChange: 'clip-path' }),
        // The tag's transform is left alone: useCardHover owns it, and it is
        // already back at its resting value when the from-tween ends.
        onComplete: () => {
          gsap.set([well, drift, frame, stroke, ...slits, ...copy].filter(Boolean), {
            clearProps: 'transform,clipPath,opacity,willChange,top,strokeDashoffset',
          });
          if (tag) gsap.set(tag, { clearProps: 'opacity' });
        },
      });

      // 1. The frame. pathLength="1" on the rect makes the dash maths unit-free.
      if (frame && stroke) {
        tl.fromTo(frame, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'none' }, t0)
          .fromTo(
            stroke,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.95, ease: 'power2.inOut' },
            t0
          )
          .to(frame, { opacity: 0, duration: 0.5 }, cut + 0.55);
      }

      // 2. The cut. inset() with `round` keeps the well's 14px corners.
      tl.fromTo(well, { clipPath: SHUT }, { clipPath: OPEN }, cut);
      if (drift) tl.from(drift, { scale: 1.12, duration: 1.4 }, cut);
      if (slits.length === 2) {
        // Same ease, duration and position as the clip, so each line stays
        // on the edge it is drawing.
        tl.fromTo(slits[0], { top: '50%' }, { top: '0%' }, cut)
          .fromTo(slits[1], { top: '50%' }, { top: '100%' }, cut)
          .fromTo(slits, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'none' }, cut)
          .to(slits, { opacity: 0, duration: 0.35 }, cut + 0.75);
      }

      // 3. The title block, then the tag.
      if (copy.length) {
        tl.from(copy, { y: 18, opacity: 0, duration: 0.8, stagger: 0.07 }, cut + 0.3);
      }
      if (tag) {
        tl.from(tag, { y: -14, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, cut + 0.7);
      }

      /* A card whose media has not arrived holds at frame 0 — shut, with
         its frame drawn — rather than cutting to an empty box.
         replayOnScroll drives a proxy rather than the timeline itself: it
         still owns when the card *wants* to play, and `gate` decides
         whether it may yet. The listener resolves on the first of
         load/error, so a genuinely missing file still opens (the card then
         shows whatever it would have shown anyway) instead of leaving the
         plate shut forever. Already-loaded media — the normal case — is
         ready here and the proxy is a straight pass-through. */
      const ready = () =>
        !media ||
        (media.tagName === 'IMG' ? media.complete && media.naturalWidth > 0 : media.readyState >= 2);

      let wanted = false;
      const gate = {
        play: () => {
          wanted = true;
          if (ready()) tl.play();
        },
        pause: (t, suppress) => {
          wanted = false;
          tl.pause(t, suppress);
        },
      };

      if (!ready()) {
        ['load', 'loadeddata', 'error'].forEach((ev) =>
          media.addEventListener(
            ev,
            () => {
              if (wanted) tl.play();
            },
            { once: true, signal: aborter.signal }
          )
        );
      }

      replayOnScroll({ ScrollTrigger, animation: gate, trigger: card, start: 'top 88%' });

      /* ── The viewfinder ───────────────────────────────────────────── */
      const finder = sheet.querySelector('.m3-finder');
      if (!fine || !finder) return;

      const corners = gsap.utils.toArray('.m3-corner', finder);
      // Each corner closes in from its own side: signs by position.
      const from = [[-1, -1], [1, -1], [-1, 1], [1, 1]];

      const aim = (e) => {
        const box = well.getBoundingClientRect();
        finder.style.setProperty('--cx', `${e.clientX - box.left}px`);
        finder.style.setProperty('--cy', `${e.clientY - box.top}px`);
      };

      const enter = (e) => {
        aim(e);
        gsap.to(finder, { opacity: 1, duration: 0.3, overwrite: 'auto' });
        corners.forEach((c, i) => {
          gsap.fromTo(
            c,
            { x: from[i][0] * 12, y: from[i][1] * 12 },
            { x: 0, y: 0, duration: 0.55, ease: 'back.out(2.2)', overwrite: 'auto' }
          );
        });
      };

      const leave = () => gsap.to(finder, { opacity: 0, duration: 0.35, overwrite: 'auto' });

      const opts = { passive: true, signal: aborter.signal };
      well.addEventListener('pointerenter', enter, opts);
      well.addEventListener('pointermove', aim, opts);
      well.addEventListener('pointerleave', leave, opts);
      // The page can scroll out from under a resting pointer without a
      // pointerleave; blur is the catch-all, as in useCardHover.
      window.addEventListener('blur', leave, opts);
    });

    return () => aborter.abort();
  });
}

/* `deps` re-builds the scene when the rendered set changes (the category
   filter): the cards that remain replay their entrance, which doubles as
   the filter's transition. */
export function useProjectSheets(deps = []) {
  const ref = useRef(null);
  useGsapScene(ref, build, deps);
  return ref;
}
