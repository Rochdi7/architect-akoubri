import { useCallback, useEffect, useRef, useState } from 'react';
import InkTitle from './InkTitle';
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
  // Which preview a touch tap is opening (-1 left, 1 right, 0 none). On a
  // pointer the preview has already widened under hover before the click;
  // a finger has no hover, so the tap plays that widening first and only
  // then pages. Kept in a data-* attribute, not the className.
  const [opening, setOpening] = useState(0);
  const openTimer = useRef(null);
  const n = items.length;
  const phone = usePhone();

  const at = useCallback((k) => items[((k % n) + n) % n], [items, n]);

  const go = useCallback(
    (step) => {
      setDir(step);
      setI((v) => ((v + step) % n + n) % n);
    },
    [n]
  );

  const openPreview = (step) => {
    if (opening) return;
    const hoverOpens = window.matchMedia(
      '(min-width: 1024px) and (hover: hover) and (pointer: fine)'
    ).matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hoverOpens || still || phone) { go(step); return; }
    setOpening(step);
    openTimer.current = setTimeout(() => {
      setOpening(0);
      go(step);
    }, 520);
  };

  useEffect(() => () => clearTimeout(openTimer.current), []);

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
    if (!touch.current || opening) return;
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
            <InkTitle className="display-md display-md--stacked mt-5 uppercase leading-[1.14] md:mt-6">
              Les espaces que
              <br />
              vous imaginez
            </InkTitle>
            <p className="mt-4 md:hidden">
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
        {phone ? (
          /* Phone: a track, not three fixed slots. Each figure is keyed by
             the slide it shows, so paging hands the same node a new role
             and CSS eases its width: the tapped sliver grows into the centre
             while the old centre narrows into a sliver, with nothing
             swapped or snapped back. Two zero-width figures wait off each
             edge so the incoming sliver has a node to grow from. */
          <div className="slab-row slab-track">
            {[-2, -1, 0, 1, 2].map((off) => {
              const k = (((i + off) % n) + n) % n;
              const s = items[k];
              const role =
                off === 0 ? 'main' : off === -1 ? 'left' : off === 1 ? 'right'
                : off < 0 ? 'off-left' : 'off-right';
              return (
                <figure
                  key={k}
                  className={`slab slab--${role}`}
                  aria-hidden={off === 0 ? undefined : 'true'}
                  onClick={off === -1 || off === 1 ? () => openPreview(off) : undefined}
                >
                  <img
                    src={s.src}
                    alt={off === 0 ? s.title : ''}
                    loading={Math.abs(off) <= 1 ? 'eager' : 'lazy'}
                  />
                  {off === 0 && (
                    <Link
                      to={`/projets/${s.slug}`}
                      className="slab-cta"
                      aria-label={`Voir le projet — ${s.title}`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  )}
                </figure>
              );
            })}
          </div>
        ) : (
        <div
          className="slab-row"
          data-opening={opening < 0 ? 'left' : opening > 0 ? 'right' : undefined}
        >
          {/* Left preview — trapezoid leaning right. It widens on hover, so
              it is also clickable: a panel that opens up under the pointer
              but does nothing when clicked reads as broken. Kept out of the
              a11y tree — the arrows, dots and keyboard already page the
              carousel, so this is a pointer shortcut, not a new control. */}
          <figure
            className="slab slab--left"
            aria-hidden="true"
            onClick={() => openPreview(-1)}
          >
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

          {/* Right preview — trapezoid leaning left. Clickable for the same
              reason as its mirror above. */}
          <figure
            className="slab slab--right"
            aria-hidden="true"
            onClick={() => openPreview(1)}
          >
            <img key={at(i + 1).src} src={at(i + 1).src} alt="" loading="lazy" />
          </figure>
        </div>
        )}

        {/* Live region so the slide change is announced without moving focus. */}
        <p className="sr-only" aria-live="polite">
          {`Image ${i + 1} sur ${n} : ${current.title}`}
        </p>

        {/* Caption for phones, where it cannot sit over the small panel. */}
        <div className="mt-5 text-center md:hidden">
          <p className="font-display text-lg uppercase">{current.title}</p>
          <p className="mt-1">{current.caption}</p>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2 md:mt-8">
          {items.map((s, k) => (
            <button
              key={s.src}
              type="button"
              onClick={() => { setDir(k > i ? 1 : -1); setI(k); }}
              aria-label={`Aller à l'image ${k + 1} : ${s.title}`}
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

/* True below the phone breakpoint, kept in sync on resize/rotation. */
function usePhone() {
  const query = '(max-width: 767.98px)';
  const [phone, setPhone] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return phone;
}
