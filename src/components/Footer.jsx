import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import AkoubriMark from './AkoubriMark';
import { business } from '../data/business';

/**
 * Footer — a dark rounded card inset from the page edges, with the studio
 * name set oversized along the bottom and clipped by the card itself.
 *
 * The wordmark is deliberately allowed to run past the right edge: it reads
 * as a printed band rather than a heading, which is why it carries
 * aria-hidden and never wraps.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="pt-2">
      {/* CTA band, on the paper ground above the card */}
      <div className="shell pb-14 sm:pb-16 md:pb-24">
        <div className="grid gap-7 border-t border-line pt-12 md:gap-10 md:pt-16 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div data-reveal className="reveal">
            <span className="eyebrow">Parlons-en</span>
            <h2 className="display-lg mt-6 max-w-2xl uppercase leading-[0.95]">
              Un terrain, un plan,
              <br />
              une idée&nbsp;?
            </h2>
          </div>
          <div data-reveal data-reveal-delay="120" className="reveal lg:text-right">
            <p className="mb-6 leading-relaxed text-ink-soft md:mb-7 lg:ml-auto lg:max-w-sm">
              Premier échange sans engagement. On vous dit franchement si le projet
              tient debout — techniquement et budgétairement.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Nous écrire
              <ArrowNE />
            </Link>
          </div>
        </div>
      </div>

      {/* Dark card */}
      <div className="footer-shell px-[var(--gutter)] pb-[var(--gutter)]">
        <div className="footer-card relative mx-auto max-w-shell overflow-hidden bg-ink">
          <div className="px-6 pb-7 pt-10 sm:px-10 sm:pb-8 sm:pt-12 md:px-14 md:pb-10 md:pt-16">
            {/* Identity stacks above the menus on phones and tablets, then
                sits beside them from lg up — the reference layout, where the
                three link columns stay a single spread-out row at every width
                instead of wrapping one column onto its own line. */}
            <div className="flex flex-col gap-9 sm:gap-10 lg:flex-row lg:items-start lg:gap-8">
              {/* Identity */}
              <div className="lg:w-[30%] lg:shrink-0">
                <Mark />
                <p className="mt-5 max-w-xs text-sm leading-relaxed on-dark-soft sm:mt-6 sm:text-base">
                  Cabinet d'architecture et de design d'intérieur. Résidences,
                  villas et espaces de travail au Maroc.
                </p>
                <div className="mt-6 flex items-center gap-5 sm:mt-7 sm:gap-4">
                  <Social label="Instagram" href="https://instagram.com/" stroke>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
                  </Social>
                  <Social label="LinkedIn" href="https://linkedin.com/">
                    <path d="M4.5 3A1.5 1.5 0 1 0 4.5 6a1.5 1.5 0 0 0 0-3ZM3 8.5h3V21H3zM9 8.5h2.9v1.7h.05c.4-.75 1.4-1.55 2.85-1.55 3.05 0 3.6 2 3.6 4.6V21h-3v-5.4c0-1.3 0-2.95-1.8-2.95s-2.05 1.4-2.05 2.85V21H9z" />
                  </Social>
                  <Social label="Pinterest" href="https://pinterest.com/">
                    <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.15-2 .03-2.9l1.17-4.95s-.3-.6-.3-1.5c0-1.4.8-2.45 1.8-2.45.85 0 1.26.64 1.26 1.4 0 .85-.54 2.13-.82 3.31-.24.99.5 1.8 1.47 1.8 1.77 0 3.13-1.87 3.13-4.56 0-2.38-1.71-4.05-4.16-4.05a4.3 4.3 0 0 0-4.5 4.32c0 .85.33 1.77.74 2.27.08.1.09.19.07.29l-.28 1.1c-.04.19-.15.23-.34.14-1.25-.58-2.03-2.4-2.03-3.87 0-3.15 2.29-6.04 6.6-6.04 3.46 0 6.16 2.47 6.16 5.77 0 3.44-2.17 6.21-5.18 6.21-1.01 0-1.96-.53-2.29-1.15l-.62 2.37c-.22.87-.83 1.95-1.24 2.61A10 10 0 1 0 12 2Z" />
                  </Social>
                </div>
              </div>

              {/* Menu columns: one row, spread edge to edge. gap-x is small so
                  three columns fit a 320px card; the labels are short enough
                  not to wrap at that width. */}
              <div className="flex w-full flex-wrap gap-x-4 gap-y-8 sm:flex-nowrap sm:justify-between sm:gap-x-6 lg:flex-1 lg:gap-x-8">
              <FooterCol title="Navigation" className="w-[45%] shrink-0 sm:w-auto">
                <FooterLink to="/">Accueil</FooterLink>
                <FooterLink to="/projets">Projets</FooterLink>
                <FooterLink to="/agence">Agence</FooterLink>
                <FooterLink to="/services">Services</FooterLink>
                <FooterLink to="/journal">Journal</FooterLink>
                <FooterLink to="/contact">Contact</FooterLink>
              </FooterCol>

              <FooterCol title="Projets" className="w-[45%] shrink-0 sm:w-auto">
                {projects.map((p) => (
                  <FooterLink key={p.slug} to={`/projets/${p.slug}`}>
                    {p.name}
                  </FooterLink>
                ))}
              </FooterCol>

              <FooterCol title="Contact" className="w-full sm:w-auto" listClass="space-y-2.5 sm:space-y-3">
                <li>
                  <a href={`mailto:${business.email}`} className="block break-words text-sm on-dark-soft transition-colors hover:text-[var(--clay)]">
                    {business.email}
                  </a>
                </li>
                <li>
                  <a href={business.phoneHref} className="text-sm on-dark-soft transition-colors hover:text-[var(--clay)]">
                    {business.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={business.maps.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm leading-relaxed on-dark-soft transition-colors hover:text-[var(--clay)]"
                  >
                    {business.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </a>
                </li>
              </FooterCol>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-[rgba(250,248,245,0.12)] pt-5 text-xs on-dark-muted sm:mt-14 sm:pt-6 sm:text-sm md:flex-row md:items-center md:justify-between md:gap-6">
              <span>
                © {year} <span className="on-dark">Akoubri</span>. Tous droits réservés.
              </span>
              <nav className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <Link to="/mentions-legales" className="transition-colors hover:text-[var(--clay)]">
                  Mentions légales
                </Link>
                <span aria-hidden="true" className="opacity-40">·</span>
                <Link to="/confidentialite" className="transition-colors hover:text-[var(--clay)]">
                  Confidentialité
                </Link>
              </nav>
            </div>
          </div>

          {/* Oversized studio name, clipped by the card's bottom edge. */}
          <div className="footer-wordmark select-none font-display" aria-hidden="true">
            Akoubri
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className, listClass }) {
  return (
    <div className={`min-w-0 ${className || ''}`}>
      <div className="mb-4 text-sm font-semibold on-dark sm:mb-5 sm:text-base">{title}</div>
      <ul className={listClass || 'space-y-2.5 sm:space-y-3'}>{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-sm on-dark-soft transition-colors hover:text-[var(--clay)]">
        {children}
      </Link>
    </li>
  );
}

function Social({ label, href, children, stroke }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="on-dark transition-colors duration-300 hover:text-[var(--clay)]"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={stroke ? 'none' : 'currentColor'}
        stroke={stroke ? 'currentColor' : undefined}
        strokeWidth={stroke ? 1.7 : undefined}
        aria-hidden="true"
      >
        {children}
      </svg>
    </a>
  );
}

/* Lockup — the animated mark beside the wordmark, on the dark card. */
function Mark() {
  return (
    <span className="flex items-center gap-2.5">
      <AkoubriMark size={36} className="akoubri-mark--on-dark" />
      <span className="font-display text-xl on-dark">Akoubri</span>
    </span>
  );
}

function ArrowNE() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
