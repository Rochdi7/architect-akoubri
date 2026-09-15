import { useEffect, useRef } from 'react';
import { MOTION_3D, loadMotion } from '../lib/motion';

/* Project-card hover — the cover cross-fades to a second frame.

   Both images are stacked in the well. On pointer-enter the second one fades
   up and both drift: the outgoing frame settles back slightly while the
   incoming one arrives from a touch of scale, so the swap reads as a camera
   move between two shots of the same project rather than a slideshow cut.

   Pointer devices only, and only when the card actually has a second frame.
   On touch a tap leaves :hover asserted, which would strand the card showing
   its hover image; the same trap froze the testimonial marquees. Everything
   here is driven by real pointerenter/pointerleave events rather than CSS
   :hover, and those are registered only when the device reports a fine
   pointer, so a tap can never latch the swapped state.

   The tween is quickTo-based: a pointer can re-enter mid-fade, and quickTo
   retargets the running tween instead of stacking a new one on top, so a
   fast in-out-in never leaves the two frames both half-visible.

   Falls back to nothing at all: without the GSAP chunk the card keeps its
   cover and the second frame stays at its CSS opacity of 0.                */

export function useCardHover(enabled) {
  const ref = useRef(null);

  useEffect(() => {
    if (!MOTION_3D || !enabled) return undefined;

    const card = ref.current;
    if (!card) return undefined;

    // A coarse pointer gets the static cover. Checked here rather than in CSS
    // so the listeners are never even attached on a phone. Reduced motion is
    // honoured the same way every other scene in the motion layer does it:
    // no listeners, so the card simply keeps its cover.
    const ok = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    ).matches;
    if (!ok) return undefined;

    let cancelled = false;
    let ctx = null;
    const aborter = new AbortController();

    // Hover is its own intent signal: a reader can point at a card without
    // ever scrolling, so this must not sit behind the scroll gate. Instead
    // the chunk is fetched when the pointer first approaches this card —
    // early enough that the tween is ready by the time it is wanted, and
    // still nothing on load. `loadMotion` de-dupes, so whichever signal
    // lands first (this or a scroll) serves every other scene too.
    const hovered = new Promise((resolve) => {
      card.addEventListener('pointerenter', resolve, {
        once: true,
        passive: true,
        signal: aborter.signal,
      });
    });

    Promise.race([hovered.then(() => loadMotion({ now: true })), loadMotion()])
      .then(({ gsap, ease }) => {
        if (cancelled || !ref.current) return;

        ctx = gsap.context(() => {
          const base = card.querySelector('[data-card-img="base"]');
          const over = card.querySelector('[data-card-img="over"]');
          const tag = card.querySelector('.media-tag');
          if (!base || !over) return;

          // Establish the start state through GSAP so it owns the transform
          // outright; a Tailwind scale utility writes --tw-scale-* custom
          // properties that GSAP's matrix cannot compose with.
          gsap.set(over, { scale: 1.06 });

          // quickTo drives opacity: a pointer can re-enter mid-fade, and
          // quickTo retargets the running tween instead of stacking a new one.
          const overFade = gsap.quickTo(over, 'opacity', { duration: 0.55, ease });

          // `scale` is NOT a quickTo-able property: quickTo drives exactly one
          // property, while GSAP expands `scale` into scaleX/scaleY, so a
          // quickTo built on it silently never updates the transform (the
          // element kept its start scale while opacity animated fine).
          // A normal tween with overwrite:'auto' gets the same
          // interrupt-safety — a new tween kills the one it supersedes.
          const scaleTo = (el, v) =>
            gsap.to(el, { scale: v, duration: 0.9, ease, overwrite: 'auto' });

          // The badge lifts and a sheen sweeps across it, so the glass reads
          // as a physical panel catching light rather than a static chip.
          // The sweep is one-shot per enter: a looping shimmer on four cards
          // would composite forever for no information gain.
          // The sheen lives on .media-tag::after, which CSS drives from the
          // --media-tag-sheen custom property on the pill; GSAP animates the
          // property and the pseudo-element follows. `opacity` is tweened on
          // the same timeline so the highlight only exists while travelling.
          const tagSweep = tag
            ? gsap
                .timeline({ paused: true })
                .fromTo(
                  tag,
                  { '--media-tag-sheen': '-120%' },
                  { '--media-tag-sheen': '120%', duration: 0.85, ease: 'power2.inOut' },
                  0
                )
                .fromTo(
                  tag,
                  { '--media-tag-sheen-o': 0 },
                  { '--media-tag-sheen-o': 1, duration: 0.2 },
                  0
                )
                .to(tag, { '--media-tag-sheen-o': 0, duration: 0.25 }, 0.6)
            : null;

          const enter = () => {
            // Decode before the first reveal so the fade never lands on a
            // blank box; after that the browser has it cached.
            if (over.dataset.ready !== '1') {
              over.dataset.ready = '1';
              if (over.decode) over.decode().catch(() => {});
            }
            overFade(1);
            scaleTo(over, 1);
            scaleTo(base, 1.06);
            if (tag) {
              gsap.to(tag, {
                y: -2,
                scale: 1.04,
                duration: 0.5,
                ease,
                overwrite: 'auto',
              });
              tagSweep?.restart();
            }
          };

          const leave = () => {
            overFade(0);
            scaleTo(over, 1.06);
            scaleTo(base, 1);
            if (tag) {
              gsap.to(tag, { y: 0, scale: 1, duration: 0.5, ease, overwrite: 'auto' });
            }
          };

          card.addEventListener('pointerenter', enter, { signal: aborter.signal });
          card.addEventListener('pointerleave', leave, { signal: aborter.signal });
          // A card can be left by the pointer while the page scrolls under it
          // without firing pointerleave; blur is the reliable catch-all.
          window.addEventListener('blur', leave, { signal: aborter.signal });
        }, card);
      })
      .catch(() => {
        /* No chunk, no swap — the card rests on its cover. */
      });

    return () => {
      cancelled = true;
      aborter.abort();
      ctx?.revert();
    };
  }, [enabled]);

  return ref;
}
