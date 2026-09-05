import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Angled-slab carousel.
 *
 * Three panels: the centre one is a plain rectangle, the two flanking it are
 * clipped into mirrored trapezoids that lean in toward it — the slabs read
 * like a plan cut through the building, which is why the shape suits an
 * architecture practice rather than being decoration for its own sake.
 *
 * Only the centre slide is interactive. The side panels are previews of the
 * neighbouring slides and are hidden from assistive tech, so a screen reader
 * gets one coherent slide at a time.
 */
export default function Showcase({ items }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const touch = useRef(null);
  const n = items.length;

  const at = useCallback((k) => items[((k % n) + n) % n], [items, n]);

  const go = useCallback(
    (step) => {
      setDir(step);
      setI((v) => ((v + step) % n + n) % n);
    },
    [n]
  );

  // Arrow keys page through while the carousel has focus.
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };

  // Horizontal swipe on touch devices. Both axes are tracked because a
  // vertical page scroll that drifts sideways would otherwise page the
  // carousel out from under the reader.
  const onTouchStart = (e) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  // Preload the neighbours so paging never shows a blank panel.
  useEffect(() => {
    [at(i + 1), at(i - 1)].forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
  }, [i, at]);

  const current = at(i);

  return (
    <section className="section-y overflow-hidden">
      <div className="shell">
        {/* Header + controls */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div data-reveal className="reveal mx-auto max-w-2xl text-center md:mx-0 md:text-left">
            <span className="eyebrow eyebrow--centered justify-center md:justify-start">Intérieurs</span>
            <h2 className="display-md mt-5 uppercase leading-[0.95] md:mt-6">
              Les espaces que
              <br />
              vous imaginez
            </h2>
            <p className="mt-4 text-ink-soft md:hidden">
              Des volumes clairs, des matières franches et une lumière pensée
              pièce par pièce.
            </p>
          </div>

          {/* Arrows are desktop-only; on a phone the carousel is driven by
              swipe and by the dots, so a second control is redundant. */}
          <div data-reveal data-reveal-delay="100" className="reveal hidden gap-3 md:flex">
            <NavBtn label="Image précédente" onClick={() => go(-1)} dir="prev" />
            <NavBtn label="Image suivante" onClick={() => go(1)} dir="next" />
          </div>
        </div>
      </div>

      {/* Slabs */}
      <div
        className="slab-stage shell"
        role="group"
        aria-roledescription="carrousel"
        aria-label="Intérieurs réalisés"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="slab-row">
          {/* Left preview — trapezoid leaning right */}
          <figure className="slab slab--left" aria-hidden="true">
            <img key={at(i - 1).src} src={at(i - 1).src} alt="" loading="lazy" />
          </figure>

          {/* Centre — the real slide */}
          <figure className="slab slab--main">
            <img
              key={current.src}
              src={current.src}
              alt={current.title}
              loading={i === 0 ? 'eager' : 'lazy'}
              width="1280"
              height="853"
              className={dir > 0 ? 'slab-in-right' : 'slab-in-left'}
            />

            <Link
              to={`/projets/${current.slug}`}
              className="slab-cta"
              aria-label={`Voir le projet — ${current.title}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <figcaption className="slab-caption">
              <span className="font-display text-lg uppercase md:text-xl">{current.title}</span>
              <span className="mt-1 block text-sm text-white/75">{current.caption}</span>
            </figcaption>
          </figure>

          {/* Right preview — trapezoid leaning left */}
          <figure className="slab slab--right" aria-hidden="true">
            <img key={at(i + 1).src} src={at(i + 1).src} alt="" loading="lazy" />
          </figure>
        </div>

        {/* Live region so the slide change is announced without moving focus. */}
        <p className="sr-only" aria-live="polite">
          {`Image ${i + 1} sur ${n} : ${current.title}`}
        </p>

        {/* Caption for phones, where it cannot sit over the small panel. */}
        <div className="mt-5 text-center md:hidden">
          <p className="font-display text-lg uppercase">{current.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{current.caption}</p>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2 md:mt-8">
          {items.map((s, k) => (
            <button
              key={s.src}
              type="button"
              onClick={() => { setDir(k > i ? 1 : -1); setI(k); }}
              aria-label={`Aller à l'image ${k + 1} : ${s.title}`}
              aria-current={k === i || undefined}
              /* The dot is 8px tall by design; the button around it is
                 44px so it can actually be hit with a thumb. */
              className="group flex h-11 items-center px-1"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-400 ease-arch ${
                  k === i ? 'w-7 bg-ink' : 'w-2 bg-line-strong group-hover:bg-ink-muted'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function NavBtn({ label, onClick, dir }) {
  const prev = dir === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group flex h-12 w-12 items-center justify-center rounded-full border border-line-strong transition-colors duration-300 hover:border-ink hover:bg-ink md:h-14 md:w-14"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="text-ink transition-colors duration-300 group-hover:text-[var(--paper)]"
      >
        <path
          d={prev ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
