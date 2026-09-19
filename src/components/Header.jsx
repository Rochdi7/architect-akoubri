import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AkoubriMark from './AkoubriMark';
import QuoteModal from './QuoteModal';
import ThemeToggle from './ThemeToggle';
import { business } from '../data/business';

// A chunk that fails to load must not take the header down with it: lazy()
// rethrows a rejected import at the nearest error boundary.
const SmokeFill = lazy(() => import('./SmokeFill').catch(() => ({ default: () => null })));

const nav = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/projets', label: 'Projets' },
  { to: '/agence', label: 'Agence' },
  { to: '/services', label: 'Services' },
  { to: '/services/permis-de-construire-marrakech', label: 'Permis' },
  // { to: '/journal', label: 'Journal' },  // masqué — à remettre plus tard
  { to: '/contact', label: 'Contact' },
];

// One entry at most is current. NavLink matches by prefix, so on the Permis
// page — which lives under /services/… — it lit Services as well; the longest
// matching `to` wins instead, and the more specific page takes the state.
function activeEntry(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  return nav
    .filter((item) =>
      item.end || item.to === '/' ? path === item.to : path === item.to || path.startsWith(`${item.to}/`)
    )
    .sort((a, b) => b.to.length - a.to.length)[0]?.to;
}

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState(false);
  const { pathname } = useLocation();
  const current = activeEntry(pathname);

  // The desktop active state is a single capsule that slides between the
  // links, so it is measured from the current link rather than drawn per item.
  // The observer covers everything that moves the links without a route
  // change: the xl padding step, the webfont landing, and the header going
  // from display:none to block when a phone-width window is widened.
  const navRef = useRef(null);
  const [capsule, setCapsule] = useState(null);
  const [slide, setSlide] = useState(false);

  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return undefined;
    const measure = () => {
      const link = el.querySelector('[aria-current="page"]');
      // No current link (legal pages, 404): keep the last box and fade out,
      // so the capsule does not fly to the left edge on its way out.
      setCapsule((prev) =>
        link && link.offsetWidth
          ? { left: link.offsetLeft, width: link.offsetWidth, on: true }
          : prev && { ...prev, on: false }
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [current]);

  // Sliding starts one frame after the first placement; otherwise the capsule
  // would travel in from 0 on load.
  useEffect(() => {
    if (!capsule || slide) return undefined;
    const id = requestAnimationFrame(() => setSlide(true));
    return () => cancelAnimationFrame(id);
  }, [capsule, slide]);

  // Hide-on-scroll-down / show-on-scroll-up, same behaviour as the
  // CodeSommet header (app.js handleHeaderScroll).
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 90);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  // overflowY, not the `overflow` shorthand: the shorthand would overwrite
  // the `overflow-x: clip` that index.css sets deliberately, and swapping
  // that to `hidden` makes body a scroll container, which silently kills
  // `position: sticky` on every descendant while the menu is open.
  useEffect(() => {
    document.body.style.overflowY = open ? 'hidden' : '';
    return () => { document.body.style.overflowY = ''; };
  }, [open]);

  return (
    <>
      {/* ── Desktop ─────────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-6 z-50 hidden px-6 transition-transform duration-500 ease-arch lg:block ${
          hidden ? '-translate-y-[140%]' : 'translate-y-0'
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <div className="nav-pill relative flex items-center gap-4 rounded-full border border-line bg-[var(--pill)] px-3 py-2 shadow-[0_4px_12px_rgba(28,25,23,0.05),0_2px_6px_rgba(28,25,23,0.03)] backdrop-blur-xl">
            {/* Animated gradient sweep — the "flash" across the pill. */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              <div className="nav-sweep absolute left-0 top-0 h-full" />
            </div>

            <Link to="/" className="relative z-10 flex items-center gap-2 pl-3" aria-label="Akoubri — accueil">
              <AkoubriMark size={30} />
              <span className="font-display text-lg tracking-tight">Akoubri</span>
            </Link>

            <nav ref={navRef} className="relative z-10 flex items-center gap-1">
              {capsule && (
                <span
                  aria-hidden="true"
                  style={{ width: capsule.width, transform: `translateX(${capsule.left}px)` }}
                  className={`pointer-events-none absolute inset-y-0 left-0 rounded-full border border-line bg-[var(--paper-raised)] shadow-[0_1px_2px_rgba(15,36,62,0.06),0_4px_10px_rgba(15,36,62,0.05)] motion-reduce:transition-none ${
                    slide ? 'transition-[transform,width,opacity] duration-500 ease-arch' : ''
                  } ${capsule.on ? 'opacity-100' : 'opacity-0'}`}
                >
                  <span className="absolute bottom-[5px] left-1/2 h-[2px] w-3.5 -translate-x-1/2 rounded-full bg-clay" />
                </span>
              )}
              {nav.map((item) => {
                const isActive = item.to === current;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-offset-0 xl:px-5 ${
                      isActive ? 'text-ink' : 'text-ink-soft hover:bg-[var(--hover-wash)] hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="relative z-10 flex items-center gap-3 pr-1">
              <ThemeToggle />
              <button type="button" onClick={() => setQuote(true)} className="btn-cta">
                {/* Decorative: a failed chunk or a missing WebGL context
                    leaves the CSS gradient underneath, which is the button
                    as it was before. */}
                <Suspense fallback={null}>
                  <SmokeFill className="btn-cta__smoke" />
                </Suspense>
                <span className="btn-cta__label">Demander un devis</span>
                <span className="btn-cta__chip" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile ──────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 lg:hidden">
        <div className="flex w-full justify-center px-4 pb-1 pt-3">
          <div className="nav-pill relative grid w-full max-w-[420px] grid-cols-[1fr_auto_1fr] items-center overflow-hidden rounded-full border border-line bg-[var(--pill)] px-3 py-2.5 shadow-[0_4px_12px_rgba(28,25,23,0.05),0_2px_6px_rgba(28,25,23,0.03)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              <div className="nav-sweep absolute left-0 top-0 h-full" />
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center justify-self-start rounded-full transition-colors hover:bg-[var(--sand)]"
            >
              <span className="relative block h-3 w-[18px]">
                <span
                  className={`absolute left-0 block h-[1.5px] w-full rounded bg-ink transition-all duration-300 ease-arch ${
                    open ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[1.5px] w-full rounded bg-ink transition-all duration-300 ease-arch ${
                    open ? 'top-1.5 -rotate-45' : 'top-3'
                  }`}
                />
              </span>
            </button>

            {/* The logo is a centred flex child rather than an absolutely
                positioned one: the two 44px controls flank it as equal
                min-w-0 columns, so the mark+wordmark group lands on the
                pill's true centre and can never overlap either button on
                a narrow phone. */}
            <div className="relative z-10 flex min-w-0 flex-1 justify-center">
              <Link
                to="/"
                className="flex items-center gap-2"
                aria-label="Akoubri — accueil"
              >
                {/* The mark's viewBox is 5:4, so its ink centre sits above the
                    wordmark's optical centre; the 1px nudge lines the two up. */}
                <AkoubriMark size={28} className="translate-y-px" />
                <span className="font-display text-[17px] leading-none tracking-tight">Akoubri</span>
              </Link>
            </div>

            {/* The right-hand cell holds two controls against the left's one. The
                grid's two 1fr columns keep the logo on the pill's centre all the
                same; only under ~350px does the wider cell win and nudge it. */}
            <div className="relative z-10 flex items-center gap-1 justify-self-end">
              <ThemeToggle compact />
              {/* The phone's only always-visible CTA — the drawer button is
                  two taps away. Opens the dialog rather than routing to
                  /contact, which the nav already reaches. */}
              <button
                type="button"
                onClick={() => { setOpen(false); setQuote(true); }}
                aria-label="Demander un devis"
                className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-[var(--paper)] transition-colors hover:bg-clay"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        /* Closed, the panel is only transparent — without this its five
           links stay in the tab order and in the accessibility tree. */
        aria-hidden={!open}
        inert={open ? undefined : ''}
        className={`fixed inset-0 z-40 bg-[var(--paper)] transition-opacity duration-400 ease-arch lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* justify-center only once there is room to spare: on a short
            phone the five links, the button and the contact block add up
            to more than the viewport, and centring would crop both ends
            with no way to reach them.

            The top inset clears the fixed header pill (12px offset + ~66px
            tall). It is set as an inline style rather than a `pt-*` utility
            because `.shell` sets the `padding` shorthand, which has the same
            specificity and lands later in the sheet — it would reset
            padding-top to 0 and leave the first link under the pill. */}
        <div
          style={{ paddingTop: '6rem' }}
          className="shell flex h-full flex-col overflow-y-auto overscroll-contain pb-10 min-[380px]:pb-12 sm:justify-center"
        >
          <nav className="flex flex-col">
            {nav.map((item, i) => {
              const isActive = item.to === current;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ transitionDelay: open ? `${110 + i * 55}ms` : '0ms' }}
                  className={`flex items-center justify-between border-b py-4 font-display text-[28px] uppercase transition-all duration-500 ease-arch ${
                    open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                  } ${isActive ? 'border-clay text-clay' : 'border-line text-ink'}`}
                >
                  {item.label}
                  {isActive && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-clay" />}
                </Link>
              );
            })}
          </nav>
          {/* The drawer closes first: it owns a body scroll lock of its own,
              and leaving both up would have the two restore it in whichever
              order they happen to unmount. */}
          <button
            type="button"
            onClick={() => { setOpen(false); setQuote(true); }}
            className="btn btn-primary mt-8 w-full"
          >
            Demander un devis
          </button>
          <div className="mt-7 space-y-1 text-sm text-ink-muted">
            <a href={`mailto:${business.email}`} className="block hover:text-clay">{business.email}</a>
            <a href={business.phoneHref} className="block hover:text-clay">{business.phone}</a>
            <a href={business.phone2Href} className="block hover:text-clay">{business.phone2}</a>
          </div>
        </div>
      </div>

      <QuoteModal open={quote} onClose={() => setQuote(false)} />
    </>
  );
}

