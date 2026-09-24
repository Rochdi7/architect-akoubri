import { Link } from 'react-router-dom';
import InkTitle from '../components/InkTitle';
import { services, stats } from '../data/projects';
import Accordion from '../components/Accordion';
import { useVolets } from '../hooks/useVolets';
import { useInkFill } from '../hooks/useInkFill';
import { usePageMeta } from '../hooks/usePageMeta';
import GetInTouch from '../components/GetInTouch';

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
          <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-x-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                data-reveal
                data-reveal-delay={i * 90}
                className="reveal border-t border-[var(--zv-primary)] pt-4"
              >
                <span className="zv-subtitle">{String(i + 1).padStart(2, '0')}</span>
                <div className="zv-h4 mt-5 sm:mt-7">{s.value}</div>
                <p className="zv-small mt-3 max-w-[24ch]">{s.label}</p>
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
              <div className="m3-volet">
              <div className="zv-media">
                <img
                  src={shots[i].src}
                  alt={shots[i].alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  width="1280"
                  height="853"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              </div>
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

      {/* FAQ */}
      <section className="zv zv-alt zv-section">
        <div className="shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div data-reveal className="reveal lg:sticky lg:top-32 lg:self-start">
            <span className="zv-subtitle">Questions</span>
            <InkTitle className="zv-h2 mt-5">Avant de nous écrire</InkTitle>
          </div>
          <Accordion
            items={faq}
            stagger={70}
            summaryClass="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:gap-6 sm:p-6"
            bodyClass="zv-body zv-muted max-w-2xl px-6 pb-6"
            renderIcon={() => (
              <span className="relative h-4 w-4 shrink-0">
                <span className="absolute top-1/2 block h-px w-full bg-[var(--zv-primary)]" />
                <span className="zv-acc-icon zv-acc-icon-bar absolute left-1/2 block h-full w-px bg-[var(--zv-primary)]" />
              </span>
            )}
          />
        </div>
      </section>

      <GetInTouch />
    </>
  );
}
