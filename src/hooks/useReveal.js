import { useEffect } from 'react';

/**
 * Scroll-reveal driver.
 *
 * One IntersectionObserver per mount watches every [data-reveal] element and
 * adds `.is-visible` once. Elements unobserve after firing, so the observer
 * stays cheap on long pages. Re-runs whenever `deps` changes (route change,
 * filtered lists) to pick up newly mounted nodes.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]:not(.is-visible)'));
    if (!nodes.length) return;

    // No IO (or reduced motion): show everything immediately.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Number(el.dataset.revealDelay || 0);
          if (delay) {
            el.style.transitionDelay = `${delay}ms`;
          }
          el.classList.add('is-visible');
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
