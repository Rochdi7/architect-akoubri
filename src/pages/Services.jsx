import { Link } from 'react-router-dom';
import InkTitle from '../components/InkTitle';
import { services, stats } from '../data/projects';
import { useVolets } from '../hooks/useVolets';
import { useInkFill } from '../hooks/useInkFill';
import { usePageMeta } from '../hooks/usePageMeta';
import { useFaqSchema } from '../hooks/useFaqSchema';
import GetInTouch from '../components/GetInTouch';
import { useSnapRail, RAIL_CLASS, ARROW_CLASS } from '../hooks/useSnapRail';

// Frames for the banner ticker, drawn from across the project renders.
const ticker = [
  '/media/projets/akoubri_le-sentier-toiture-piscine-atlas-01.webp',
  '/media/projets/akoubri_zahiya-entree-enseigne-crepuscule-01.webp',
  '/media/projets/akoubri_adostigia-accueil-enseigne-relief-marbre-01.webp',
  '/media/projets/akoubri_maison-dhote-salon-marocain-coussins-rouges-13.webp',
  '/media/projets/akoubri_le-sentier-toiture-piscine-crepuscule-lounge-06.webp',
  '/media/projets/akoubri_farraj-vue-aerienne-03.webp',
];

/* One reference image per service, chosen for what it demonstrates rather
   than for being the prettiest frame:
   01 Architecture      — a collective amenity level: structure, terrace, view
   02 Design d'intérieur— a finished interior showing materials and light
   03 Images de synthèse— the aerial the 3D film was made from
   04 Direction artistique — signage: an identity applied to a building  */
const shots = [
  {
    src: '/media/projets/akoubri_le-sentier-toiture-piscine-atlas-01.webp',
    alt: "Toiture-terrasse du Sentier : piscine à débordement, terrasse en bois et Atlas enneigé à l'horizon",
  },
  {
    src: '/media/projets/akoubri_zahiya-facade-angle-commerces-07.webp',
    alt: "Angle de la résidence Zahiya : commerces vitrés en rez-de-chaussée, loggias et palmiers",
  },
  {
    src: '/media/projets/akoubri_farraj-vue-aerienne-03.webp',
    alt: "Vue aérienne de synthèse de la conserverie Farraj, bâtiments disposés en L autour d'une aire de manœuvre",
  },
  {
    src: '/media/projets/akoubri_zahiya-entree-enseigne-crepuscule-01.webp',
    alt: "Enseigne lumineuse « ZAHIYA RESIDENCE » sur un bardage vertical sombre, à l'entrée de la résidence",
  },
];

// Louver count for the brise-soleil reveal; the CSS reads it as --n.
const LOUVERS = 9;

/* Not rendered: kept for search engines as FAQPage JSON-LD. */
const faq = [
  {
    q: 'Travaillez-vous en dehors de Marrakech ?',
    a: "Oui. Nous suivons des chantiers partout au Maroc. Au-delà de 200 km, nous calons un rythme de visites groupées pour maîtriser les frais de déplacement.",
  },
  {
    q: 'Pouvez-vous intervenir uniquement sur les images 3D ?',
    a: "Bien sûr. Beaucoup de promoteurs nous confient seulement la production d'images à partir de plans existants, pour une commercialisation ou un dossier d'investisseurs.",
  },
  {
    q: 'Quel est le délai moyen pour une esquisse ?',
    a: "Comptez deux à trois semaines après la visite du site, selon la taille du programme. Vous recevez deux à trois partis architecturaux rendus en 3D.",
  },
  {
    q: 'Comment sont établis vos honoraires ?',
    a: "Au pourcentage du montant des travaux pour une mission complète, ou au forfait pour une mission partielle (permis seul, intérieurs seuls, images seules). Le devis est fixé avant tout démarrage.",
  },
];

export default function Services() {
  const volets = useVolets();
  const ink = useInkFill();
  const heroInk = useInkFill({ play: true });

  usePageMeta({
    description:
      "Missions d'architecture à Marrakech et au Maroc : conception architecturale, permis de construire, suivi de chantier, design d'intérieur, images de synthèse et direction artistique.",
    canonical: '/services',
  });
  useFaqSchema(faq);


  return (
    <>
      {/* ── Banner: centred title over a drifting image strip ── */}
      <section className="zv overflow-hidden pt-24 sm:pt-32 md:pt-44">
        <div className="shell">
          <div data-reveal className="reveal mx-auto max-w-4xl text-center">
            <h1 ref={heroInk} className="zv-h2">
              Une architecture ancrée dans le lieu, l'usage et la matière
            </h1>
            <p className="zv-lead mx-auto mt-5 max-w-xl">
              Mission complète ou intervention ciblée, à Marrakech et partout au
              Maroc. De la conception architecturale à l'accompagnement au{' '}
              <Link
                to="/services/permis-de-construire-marrakech"
                className="zv-inline-link"
              >
                permis de construire
              </Link>
              , puis au suivi de chantier et au design d'intérieur.
            </p>
          </div>
        </div>

        <div data-reveal data-reveal-delay="120" className="reveal zv-ticker mt-16 md:mt-24">
          {/* The frame list is rendered twice so the -50% loop is seamless. */}
          <div className="zv-ticker-track">
            {[...ticker, ...ticker].map((src, i) => (
              <div key={i} className="zv-ticker-frame">
                {/* Not lazy: the track is translated horizontally, so the
                    off-screen frames never intersect the viewport and a
                    lazy image would stay permanently unloaded. */}
                <img
                  src={src}
                  alt=""
                  aria-hidden="true"
                  width="844"
                  height="562"
                  className="aspect-[3/2] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust: statement + staggered figure bars ── */}
      <section className="zv zv-section">
        <div className="shell">
          <div data-reveal className="reveal mx-auto mb-10 max-w-[764px] text-center md:mb-14 lg:mb-20">
            <h2 ref={ink} className="zv-h4">
              De l'esquisse à la réception, nous livrons une architecture tenue —{' '}
              <span className="text-[var(--zv-gray-100)]">
                avec une attention constante au détail et le goût des choses qui durent.
              </span>
            </h2>
          </div>

          {/* `stats` now carries the four programme families rather than the
              old unverified figures, so the staggered bar heights (which only
              made sense against numbers) are gone: each entry is a titled
              card with its one-line definition.

              The index on the rule gives each column a head to hang from —
              without it the row was four bare words under a hairline, and
              read as unfinished beneath a centred statement. Two-up on a
              phone as well: the words are short enough at the h4 size, and
              four full-width stacked rules made a long, thin list. The
              caption is capped so it breaks in two even lines on desktop
              instead of leaving one orphaned word. */}
          {/* Phones: a swipe rail, like the Home services rail. */}
          <PracticeRail />

          {/* Tablet and desktop: the same cards as a grid — the Home
              service-card treatment (hue wash, top rule, number watermark,
              icon chip), one hue per family. */}
          <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                data-reveal
                data-reveal-delay={i * 90}
                data-n={String(i + 1).padStart(2, '0')}
                className={`reveal zv-card zv-icon-card svc-card svc-card--${i + 1}`}
              >
                <PracticeBody item={s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternating service rows */}
      <section className="zv zv-section pt-0">
        <div ref={volets} className="shell space-y-12 sm:space-y-20 md:space-y-28">
          {services.map((s, i) => (
            <div
              key={s.n}
              data-reveal
              className={`reveal grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                i % 2 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              {/* A drawing plate: CAD corner marks and a dimension line
                  frame the render, captioned like a figure on a sheet. */}
              <figure className="svc-plate" style={{ '--n': LOUVERS }}>
                <div className="svc-plate__frame zv-media">
                  <img
                    src={shots[i].src}
                    alt={shots[i].alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    width="1280"
                    height="853"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  {/* Brise-soleil: the same render cut into vertical louvers
                      that swing open with the scroll (useVolets). Hidden
                      until the scene builds, so without JS the plain <img>
                      above is all there is. */}
                  <div className="svc-louvers" aria-hidden="true">
                    {Array.from({ length: LOUVERS }, (_, k) => (
                      <span key={k} className="svc-louver" style={{ '--k': k }}>
                        <span
                          className="svc-louver__face"
                          style={{ backgroundImage: `url(${shots[i].src})` }}
                        />
                        <span className="svc-louver__shade" />
                      </span>
                    ))}
                  </div>
                </div>
                <span className="svc-plate__corner svc-plate__corner--tl" aria-hidden="true" />
                <span className="svc-plate__corner svc-plate__corner--tr" aria-hidden="true" />
                <span className="svc-plate__corner svc-plate__corner--bl" aria-hidden="true" />
                <span className="svc-plate__corner svc-plate__corner--br" aria-hidden="true" />
                <figcaption className="svc-plate__caption">
                  <span className="svc-plate__rule" aria-hidden="true" />
                  <span className="svc-plate__label">
                    Fig. {s.n}&nbsp;— {s.title}
                  </span>
                </figcaption>
              </figure>
              <div>
                <span className="zv-icon">
                  <span className="zv-h6 leading-none">{s.n}</span>
                </span>
                <h2 className="zv-h3 mt-6">{s.title}</h2>
                <p className="zv-lead mt-5 max-w-md">{s.text}</p>
                {/* .zv-marker carries its own half-line offset, so the
                    chevron sits beside line one of a label that wraps rather
                    than centring on the item or riding its top edge. */}
                <ul className="mt-8 grid max-w-md gap-x-8 gap-y-3 border-t border-[var(--zv-border)] pt-7 sm:grid-cols-2">
                  {s.points.map((pt) => (
                    <li key={pt} className="zv-small zv-muted flex items-start gap-3">
                      <span className="zv-marker" aria-hidden="true" />
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* Only the Architecture row carries the permit link: it is
                    the mission the permit actually belongs to. */}
                {s.title === 'Architecture' && (
                  <Link
                    to="/services/permis-de-construire-marrakech"
                    className="zv-small mt-7 inline-flex items-center gap-2 border-b border-[var(--zv-primary)] pb-1 font-medium transition-opacity hover:opacity-70"
                  >
                    Notre accompagnement au permis de construire à Marrakech
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <GetInTouch alt />
    </>
  );
}

/* One line icon per programme family, keyed on its name; same 24-unit
   grid and stroke as the Home service icons. */
const PRACTICE_ICONS = {
  // Résidentiel — a house
  'Résidentiel': 'M3 11 12 4l9 7M5 9.5V20h14V9.5M10 20v-5h4v5',
  // Tertiaire — an office tower
  'Tertiaire': 'M6 21V4h12v17M3 21h18M9 7h2M13 7h2M9 10.5h2M13 10.5h2M9 14h2M13 14h2M11 21v-3h2v3',
  // Industriel — a sawtooth-roof factory with a chimney
  'Industriel': 'M3 21V11l5 3v-3l5 3v-3l5 3V4h3v17zM3 21h18M7 17h2M12 17h2',
  // Hospitalité — a bed
  'Hospitalité': 'M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6M7 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3',
};

function PracticeBody({ item }) {
  return (
    <>
      <span className="zv-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d={PRACTICE_ICONS[item.value]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h3 className="zv-h4">{item.value}</h3>
      <p className="zv-small zv-muted">{item.label}</p>
    </>
  );
}

/* Programme families as a swipe rail, phones only: counter, arrows and a
   copper progress line, the same controls as the Home services rail. */
function PracticeRail() {
  const { railRef, active, goTo } = useSnapRail(stats.length);
  const n = stats.length;

  return (
    <div className="sm:hidden">
      <div ref={railRef} data-reveal role="region" aria-label="Domaines d'intervention" className={RAIL_CLASS}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            data-step
            data-n={String(i + 1).padStart(2, '0')}
            className={`zv-card zv-icon-card svc-card svc-card--${i + 1} !h-auto w-[76vw] max-w-[320px] shrink-0 snap-start`}
          >
            <PracticeBody item={s} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <span className="zv-h6 tabular-nums leading-none" aria-live="polite">
          {String(active + 1).padStart(2, '0')}
          <span className="zv-muted"> / {String(n).padStart(2, '0')}</span>
        </span>
        <span className="relative h-px flex-1 bg-[var(--zv-border)]" aria-hidden="true">
          <span
            className="absolute inset-y-0 left-0 bg-[var(--zv-accent)] transition-[width] duration-300"
            style={{ width: `${((active + 1) / n) * 100}%` }}
          />
        </span>
        <span className="flex gap-2">
          <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Domaine précédent" className={ARROW_CLASS}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
          </button>
          <button type="button" onClick={() => goTo(active + 1)} disabled={active === n - 1} aria-label="Domaine suivant" className={ARROW_CLASS}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
          </button>
        </span>
      </div>
    </div>
  );
}
