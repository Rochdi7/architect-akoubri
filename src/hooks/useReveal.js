import { useEffect } from 'react';

/* How far past a viewport edge an element must travel before it is reset.
   Must exceed the 28px the hidden state shifts it by (see .reveal): a short
   element reset the moment it left would be pushed straight back into view
   by its own offset, earn .is-visible again, and flicker in a loop. */
const RESET_MARGIN = 80;

function setFrom(el, above) {
  if (above) el.dataset.revealFrom = 'above';
  else delete el.dataset.revealFrom;
}

/**
 * Scroll-reveal driver.
 *
 * Every [data-reveal] element gains `.is-visible` as it scrolls into view and
 * loses it once it is well clear of the viewport, so the reveal plays again
 * on the way back — in either direction. An element waiting above the
 * viewport carries `data-reveal-from="above"` and arrives moving downward,
 * so the motion always follows the scroll.
 *
 * Two observers, because showing and hiding need different lines: one line
 * for both would toggle an element resting on it with every pixel of scroll.
 * Re-runs whenever `deps` changes (route change, filtered lists) to pick up
 * newly mounted nodes.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!nodes.length) return;

    // No IO (or reduced motion): show everything immediately.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('is-visible'));
      return;
    }

    const show = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.classList.contains('is-visible')) return;
          // A jump (anchor link, End key) can carry an element from one side
          // of the viewport to the other without it ever intersecting, so the
          // side recorded when it left is stale. Re-seat it, untransitioned,
          // before the reveal starts; an ordinary scroll never gets here.
          const above = entry.boundingClientRect.top < 0;
          if (above !== (el.dataset.revealFrom === 'above')) {
            el.style.transition = 'none';
            setFrom(el, above);
            void el.offsetWidth;
            el.style.transition = '';
          }
          const delay = Number(el.dataset.revealDelay || 0);
          el.style.transitionDelay = delay ? `${delay}ms` : '';
          el.classList.add('is-visible');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const hide = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) return;
          const el = entry.target;
          // Which side it left by decides which way it comes back in.
          setFrom(el, entry.boundingClientRect.bottom <= 0);
          // The stagger belongs to the entrance; the reset is off screen and
          // should be done before the reader can turn around.
          el.style.transitionDelay = '';
          el.classList.remove('is-visible');
        });
      },
      { threshold: 0, rootMargin: `${RESET_MARGIN}px 0px ${RESET_MARGIN}px 0px` }
    );

    nodes.forEach((n) => {
      show.observe(n);
      hide.observe(n);
    });
    return () => {
      show.disconnect();
      hide.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
