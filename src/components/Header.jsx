import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import AkoubriMark from './AkoubriMark';
import { business } from '../data/business';

const nav = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/projets', label: 'Projets' },
  { to: '/agence', label: 'Agence' },
  { to: '/services', label: 'Services' },
  { to: '/journal', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

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
          <div className="nav-pill relative flex items-center gap-4 rounded-full border border-line bg-[rgba(250,248,245,0.9)] px-3 py-2 shadow-[0_4px_12px_rgba(28,25,23,0.05),0_2px_6px_rgba(28,25,23,0.03)] backdrop-blur-xl">
            {/* Animated gradient sweep — the "flash" across the pill. */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              <div className="nav-sweep absolute left-0 top-0 h-full" />
            </div>

            <Link to="/" className="relative z-10 flex items-center gap-2 pl-3" aria-label="Akoubri — accueil">
              <AkoubriMark size={30} />
              <span className="font-display text-lg tracking-tight">Akoubri</span>
            </Link>

            <nav className="relative z-10 flex items-center gap-1">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && <span className="absolute inset-x-5 bottom-1 h-px bg-clay" />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="relative z-10 flex items-center gap-2 pr-1">
              <Link to="/contact" className="btn-cta">
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile ──────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 lg:hidden">
        <div className="flex w-full justify-center px-4 pb-1 pt-3">
          <div className="nav-pill relative flex w-full max-w-[420px] items-center overflow-hidden rounded-full border border-line bg-[rgba(250,248,245,0.92)] px-3 py-2.5 shadow-[0_4px_12px_rgba(28,25,23,0.05),0_2px_6px_rgba(28,25,23,0.03)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              <div className="nav-sweep absolute left-0 top-0 h-full" />
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[var(--sand)]"
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

            <Link
              to="/contact"
              aria-label="Nous contacter"
              className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-[var(--paper)] transition-colors hover:bg-clay"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
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
            {nav.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={{ transitionDelay: open ? `${110 + i * 55}ms` : '0ms' }}
                className={({ isActive }) =>
                  `border-b border-line py-4 font-display text-[28px] uppercase transition-all duration-500 ease-arch ${
                    open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                  } ${isActive ? 'text-clay' : 'text-ink'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/contact" className="btn btn-primary mt-8 w-full">
            Demander un devis
          </Link>
          <div className="mt-7 space-y-1 text-sm text-ink-muted">
            <a href={`mailto:${business.email}`} className="block hover:text-clay">{business.email}</a>
            <a href={business.phoneHref} className="block hover:text-clay">{business.phone}</a>
          </div>
        </div>
      </div>
    </>
  );
}

