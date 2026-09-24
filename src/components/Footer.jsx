import { Link } from 'react-router-dom';
import InkTitle from './InkTitle';
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
        {/* Phone rhythm is deliberately uneven: a tighter gap binds the title
            block to its paragraph, while pt-9 keeps the divider from stacking
            with the preceding section's own bottom margin. The even 28px/48px
            desktop values return from md up. */}
        <div className="grid gap-8 border-t border-line pt-9 sm:pt-10 md:gap-12 md:pt-16 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div data-reveal className="reveal">
            <span className="eyebrow">Parlons-en</span>
            {/* One leading for every width. .display-lg tops out at 3.75rem
                (60px), and the 0.95 this replaces resolved to 57px — three
                pixels *under* the glyph size, so the two lines overlapped at
                exactly the width the title is largest. Tight leading gets
                riskier as display type grows, not safer: 1.02 keeps the pair
                reading as one block without letting the descender of line one
                touch the caps of line two. */}
            <InkTitle className="display-lg mt-4 max-w-2xl uppercase leading-[1.14] sm:mt-5">
              Un terrain, un plan,
              <br />
              une idée&nbsp;?
            </InkTitle>
          </div>
          <div data-reveal data-reveal-delay="120" className="reveal lg:text-right">
            <p className="mb-6 lg:ml-auto lg:max-w-sm">
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
        <div className="footer-card relative mx-auto max-w-shell overflow-hidden band">
          <div className="px-6 pb-7 pt-10 sm:px-10 sm:pb-8 sm:pt-12 md:px-14 md:pb-10 md:pt-16">
            {/* Identity stacks above the menus on phones and tablets, then
                sits beside them from lg up — the reference layout, where the
                three link columns stay a single spread-out row at every width
                instead of wrapping one column onto its own line. */}
            <div className="flex flex-col gap-9 sm:gap-10 lg:flex-row lg:items-start lg:gap-8">
              {/* Identity */}
              <div className="lg:w-[30%] lg:shrink-0">
                <Mark />
                <p className="mt-5 max-w-xs on-dark sm:mt-6">
                  Cabinet d'architecture et de design d'intérieur. Résidences,
                  villas et espaces de travail au Maroc.
                </p>
                <div className="mt-6 flex items-center gap-5 sm:mt-7 sm:gap-4">
                  <Social label="Instagram" href={business.social.instagram} stroke>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
                  </Social>
                  <Social label="LinkedIn" href={business.social.linkedin}>
                    <path d="M4.5 3A1.5 1.5 0 1 0 4.5 6a1.5 1.5 0 0 0 0-3ZM3 8.5h3V21H3zM9 8.5h2.9v1.7h.05c.4-.75 1.4-1.55 2.85-1.55 3.05 0 3.6 2 3.6 4.6V21h-3v-5.4c0-1.3 0-2.95-1.8-2.95s-2.05 1.4-2.05 2.85V21H9z" />
                  </Social>
                  <Social label={`WhatsApp ${business.phone}`} href={business.social.whatsapp}>
                    <path d="M12.04 2C6.6 2 2.17 6.43 2.17 11.87c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.83 9.83 0 0 0 4.7 1.2h.01c5.44 0 9.87-4.43 9.87-9.87 0-2.64-1.03-5.12-2.9-6.98A9.8 9.8 0 0 0 12.04 2Zm0 1.8c2.15 0 4.17.84 5.69 2.36a8 8 0 0 1 2.36 5.7c0 4.46-3.63 8.08-8.09 8.08a8.2 8.2 0 0 1-4.16-1.14l-.3-.18-3.09.81.82-3.01-.19-.31a8.06 8.06 0 0 1-1.24-4.3c0-4.45 3.63-8.08 8.2-8.08Zm-3.1 4.06c-.14 0-.37.06-.57.27-.2.2-.75.73-.75 1.79s.77 2.08.88 2.22c.11.14 1.5 2.3 3.66 3.22.51.22.91.35 1.22.45.51.16.98.14 1.35.09.41-.06 1.27-.52 1.45-1.02.18-.5.18-.94.13-1.02-.05-.09-.2-.14-.4-.25-.21-.1-1.27-.62-1.46-.7-.2-.07-.34-.1-.48.1-.14.21-.55.7-.68.84-.12.14-.25.16-.46.05-.2-.1-.87-.32-1.65-1.02-.61-.54-1.02-1.22-1.14-1.42-.13-.2-.02-.32.09-.42.09-.09.2-.24.31-.36.1-.12.13-.2.2-.34.07-.14.03-.26-.02-.36-.05-.1-.46-1.16-.64-1.58-.16-.42-.33-.36-.46-.37h-.4Z" />
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
                <FooterLink to="/services/permis-de-construire-marrakech">
                  Permis de construire
                </FooterLink>
                {/* Journal masqué — à remettre plus tard */}
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
                  <a href={business.phone2Href} className="text-sm on-dark-soft transition-colors hover:text-[var(--clay)]">
                    {business.phone2}
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
                <span aria-hidden="true" className="mx-2 opacity-40">·</span>
                Site conçu et développé par{' '}
                <a
                  href="https://codesommet.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#faf8f5] underline underline-offset-4 transition-colors hover:text-[var(--clay)]"
                >
                  CodeSommet
                </a>
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

          {/* Oversized studio name, clipped by the card's bottom edge.
              The word itself lives in CSS (.footer-wordmark::after): it is
              pure decoration at 0.3 alpha, and as a DOM text node it fails
              the Lighthouse contrast audit — as generated content it is
              invisible to both audits and screen readers. */}
          <div className="footer-wordmark select-none font-display" aria-hidden="true" />
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
