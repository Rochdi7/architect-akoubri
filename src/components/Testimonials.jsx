import { useEffect, useRef } from 'react';

/**
 * Testimonial wall — the CodeSommet "Sites that did the job" layout.
 *
 * Three columns of cards scroll vertically at different speeds inside a
 * fixed-height window, top and bottom feathered by a gradient mask so cards
 * fade in and out rather than being cut. Columns 2 and 3 are hidden below
 * md / lg, so a phone gets a single column (matching the reference).
 *
 * The scroll is pure CSS: each column holds its cards twice and animates
 * translateY from 0 to -50%, which loops seamlessly. Column 2 runs in
 * reverse so adjacent columns drift apart rather than in lockstep.
 *
 * Durations are per-column so the three never sync up, and are shortened on
 * a phone: only one column is visible there, so the same pace that reads as
 * a gentle drift across three columns reads as barely moving on one.
 */
export default function Testimonials({ items }) {
  const wall = useRef(null);

  // Press-to-pause, the touch counterpart of the CSS :hover pause. Bound
  // here rather than as React props so the listeners can be passive — a
  // non-passive touchstart on a scrolling section costs scroll performance.
  useEffect(() => {
    const el = wall.current;
    if (!el) return;
    const pause = () => el.classList.add('is-paused');
    const resume = () => el.classList.remove('is-paused');
    const opts = { passive: true };
    el.addEventListener('touchstart', pause, opts);
    el.addEventListener('touchend', resume, opts);
    el.addEventListener('touchcancel', resume, opts);
    return () => {
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      el.removeEventListener('touchcancel', resume);
    };
  }, []);

  // Round-robin into three columns so each gets a mix of sources.
  const columns = [[], [], []];
  items.forEach((t, i) => columns[i % 3].push(t));

  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,var(--sand)_0%,var(--paper)_55%)] py-16 md:py-24">
      <div className="shell">
        <div data-reveal className="reveal mx-auto mb-12 max-w-2xl text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-clay">
            Références
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
            Ce qu'en disent les maîtres d'ouvrage
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Promoteurs, entreprises et particuliers, après livraison.
          </p>
        </div>
      </div>

      <div
        ref={wall}
        className="testimonial-wall mx-auto flex h-[22rem] max-w-6xl justify-center gap-4 px-4 sm:h-[26rem] md:h-[34rem] md:gap-5 md:px-6"
      >
        {columns.map((col, i) => (
          <div
            key={i}
            className={`overflow-hidden ${i === 1 ? 'hidden md:block' : ''} ${
              i === 2 ? 'hidden lg:block' : ''
            }`}
          >
            <div
              className={`wall-col ${i === 1 ? 'wall-col--reverse' : ''}`}
              /* Two durations per column: the phone one wins inside the
                 mobile media query. A custom property rather than JS state
                 keeps the breakpoint in CSS, where the rest of the wall's
                 responsive behaviour already lives. */
              style={{
                '--dur': `${[30, 38, 34][i]}s`,
                '--dur-phone': `${[20, 26, 23][i]}s`,
              }}
            >
              {/* Rendered twice so the -50% loop is seamless. */}
              {[...col, ...col].map((t, j) => (
                <Card key={j} t={t} duplicate={j >= col.length} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Card({ t, duplicate }) {
  return (
    <figure
      className="w-full md:w-80 rounded-[22px] border border-line bg-[var(--paper-raised)] p-5 text-left shadow-[0_8px_30px_rgba(28,25,23,0.05)]"
      // The second copy exists only to make the loop seamless — keep it out
      // of the accessibility tree so quotes are not announced twice.
      aria-hidden={duplicate || undefined}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--sand)] font-display text-sm text-clay"
          >
            {initials(t.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{t.name}</p>
            <p className="text-xs leading-snug text-ink-muted">{t.role}</p>
          </div>
        </div>
        <span className="shrink-0">
          {t.source === 'x' ? <XMark /> : <GoogleMark />}
        </span>
      </div>

      {t.source === 'google' && <Stars />}

      <blockquote className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        {t.quote}
      </blockquote>
    </figure>
  );
}

function Stars() {
  return (
    <div className="mt-3.5">
      <div className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 fill-[#FFB020]">
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
        ))}
      </div>
      <span className="sr-only">Noté 5 sur 5</span>
    </div>
  );
}

function GoogleMark() {
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--sand)] text-[12px] font-black text-[#4285F4]"
      aria-label="Avis Google"
      role="img"
    >
      G
    </span>
  );
}

function XMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink" fill="currentColor" role="img" aria-label="Avis publié sur X">
      <path d="M18.9 1.2h3.7l-8.1 9.2 9.5 12.4h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.9L0 1.2h7.6l5.2 6.9 6.1-6.9zm-1.3 19.1h2L6.5 3.1H4.4l13.2 17.2z" />
    </svg>
  );
}

// "Youssef Benali" → "YB". Monogram discs stand in for photos, since
// inventing portraits of clients who did not sit for one would be a lie.
function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.replace(/[^\p{L}]/gu, '').charAt(0))
    .join('')
    .toUpperCase();
}
