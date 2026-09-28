import { useEffect, useRef, useState } from 'react';

/* Tracks which card of a snap rail sits at the resting edge and exposes a
   scroll-to for the indicators. Shared by the Home services and method rails and the Services practice rail. */
export function useSnapRail(count) {
  const railRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cards = rail.querySelectorAll('[data-step]');
        if (!cards.length) return;
        // The last card can't reach the left edge, so "scrolled to the end"
        // counts as the last step rather than leaving the second-last lit.
        if (rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4) {
          setActive(cards.length - 1);
          return;
        }
        const origin = rail.getBoundingClientRect().left + parseFloat(getComputedStyle(rail).scrollPaddingLeft || 0);
        let best = 0;
        let bestDist = Infinity;
        cards.forEach((card, i) => {
          const d = Math.abs(card.getBoundingClientRect().left - origin);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        setActive(best);
      });
    };
    rail.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener('scroll', onScroll);
    };
  }, []);

  const goTo = (i) => {
    const rail = railRef.current;
    const idx = Math.max(0, Math.min(count - 1, i));
    const card = rail?.querySelectorAll('[data-step]')[idx];
    if (!card) return;
    const pad = parseFloat(getComputedStyle(rail).scrollPaddingLeft || 0);
    rail.scrollTo({ left: card.offsetLeft - pad, behavior: 'smooth' });
  };

  return { railRef, active, goTo };
}

export const RAIL_CLASS =
  'reveal scrollbar-hide -mx-[var(--gutter)] flex snap-x snap-mandatory scroll-pl-[var(--gutter)] gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-[var(--gutter)] pb-2 after:block after:w-px after:shrink-0';

export const ARROW_CLASS =
  'flex h-10 w-10 items-center justify-center rounded-full border border-[var(--zv-border-dark)] text-[var(--zv-primary)] transition disabled:opacity-30';
