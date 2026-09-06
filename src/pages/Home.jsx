import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects, services, stats, process, testimonials, showcase, agencyFaq } from '../data/projects';
import { useReveal } from '../hooks/useReveal';
import RadialMarquee from '../components/RadialMarquee';
import Testimonials from '../components/Testimonials';
import Showcase from '../components/Showcase';
import { useAxonometric } from '../hooks/useAxonometric';
import { useFloorPlates } from '../hooks/useFloorPlates';

/* Home — laid out on the Zenvira reference homepage.

   Sections marked PROTECTED are the approved designs and are left
   exactly as they are: Showcase (Les espaces que vous imaginez) and
   Testimonials (Ce qu'en disent les maîtres d'ouvrage). Featured
   (Projets récents) was protected until 2026-09-06, when its card grid
   was replaced by the radial wheel (RadialMarquee) at the owner's
   request; its header row is unchanged. Everything else follows the
   reference order, minus its testimonial and pricing blocks.       */
export default function Home() {
  useReveal();

  return (
    <>
      <Hero />
      <Marks />
      <DesignStories />
      <Featured />        {/* PROTECTED — Projets récents          */}
      <ImpactBand />
      <Portfolio />
      <Showcase items={showcase} />   {/* PROTECTED — Les espaces  */}
      <CoreValues />
      <Services />
      <Testimonials items={testimonials} />  {/* PROTECTED         */}
      <Process />
      <Faq />
    </>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────
   Reference banner shape: full-bleed media with the title set large and
   bottom-left in Fjalla One, over a scrim. The video loop is kept — only
   copy layout changes.                                                   */
function Hero() {
  const [ready, setReady] = useState(false);
  const videoRef = useRef(null);

  // Autoplay can be refused (data saver, low power mode). If it is, the
  // poster simply stays put — the section never shows a blank frame.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p?.catch) p.catch(() => {});
  }, []);

  return (
    <section className="zv zv-hero">
      {/* Media layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/media/video/hero-poster.jpg"
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            ready ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          src="/media/video/hero-loop.mp4"
          poster="/media/video/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
        />

        {/* Scrims. The loop is bright daylight footage, so the copy needs
            more cover than the reference's dark interior still: a heavy
            bottom gradient carries the title, and a flat veil holds the
            mid-tones down across the whole frame. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/15" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Copy — bottom-left, as in the reference banner. */}
      <div className="shell relative z-10 w-full">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h1
            data-reveal
            className="reveal zv-h1 max-w-[620px] text-white"
          >
            Cabinet d'architecture &amp; design d'intérieur
          </h1>

          <div data-reveal data-reveal-delay="140" className="reveal max-w-md">
            <p className="zv-body text-white/85">
              Résidences, villas et espaces de travail. De l'esquisse au
              chantier, avec des images de synthèse pour décider sur pièces
              plutôt que sur promesse.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-7">
              <Link to="/projets" className="zv-btn zv-btn-light w-full justify-center sm:w-auto">
                Voir les projets
              </Link>
              <Link to="/contact" className="zv-btn zv-btn-onmedia w-full justify-center sm:w-auto">
                Parler de votre projet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Marks ──────────────────────────────────────────────────────────────
   The reference's "trusted companies" strip under the banner. Here it
   carries the disciplines rather than client logos.                     */
function Marks() {
  const items = [
    'Architecture',
    "Design d'intérieur",
    'Images de synthèse',
    'Suivi de chantier',
    'Direction artistique',
  ];
  return (
    <section className="zv py-8 md:py-16">
      <div className="shell">
        <p data-reveal className="reveal zv-small zv-muted mb-5 text-center md:mb-9">
          Quatre métiers, un seul interlocuteur
        </p>
        <div data-reveal data-reveal-delay="80" className="reveal zv-marks">
          {items.map((t) => (
            <span key={t} className="zv-mark">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--zv-primary)]" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Design stories ─────────────────────────────────────────────────────
   Reference shape: a split section title with a wide feature image beside
   two narrower ones. The wide tile carries a round action button.        */
function DesignStories() {
  return (
    <section className="zv zv-section pt-0">
      <div className="shell">
        <div data-reveal className="reveal mb-8 flex flex-wrap items-start justify-between gap-6 md:mb-24">
          <h2 className="zv-h2 max-w-[555px]">
            Les lieux que vous imaginez, tenus jusqu'au chantier
          </h2>
          <p className="zv-body zv-muted max-w-[473px]">
            Chaque projet est modélisé et rendu avant d'être construit. Vous
            arbitrez sur des images fidèles, pas sur des intentions.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_281px_281px]">
          <Link
            to="/projets/le-sentier"
            data-reveal
            className="reveal zv-tile group"
            aria-label="Le Sentier — voir le projet"
          >
            <img
              src="/media/le-sentier/sentier-05.jpg"
              alt="Le Sentier — façade principale"
              width="1388"
              height="1000"
              className="h-full min-h-[320px] w-full object-cover md:min-h-[460px]"
            />
            <span className="zv-tile-btn">
              <ArrowNE />
            </span>
            <span className="zv-tile-cap">
              <span className="zv-h5 block">Le Sentier</span>
              <span className="zv-small">Résidence · Marrakech</span>
            </span>
          </Link>

          {[
            { slug: 'zahiya', src: '/media/zahiya/zahiya-12.jpg', name: 'Zahiya', meta: 'Résidence · Marrakech' },
            { slug: 'adostigia', src: '/media/adostigia/adostigia-22.jpg', name: 'Adostigia', meta: 'Siège social · Casablanca' },
          ].map((p, i) => (
            <Link
              key={p.slug}
              to={`/projets/${p.slug}`}
              data-reveal
              data-reveal-delay={(i + 1) * 90}
              className="reveal zv-tile group"
              aria-label={`${p.name} — voir le projet`}
            >
              <img
                src={p.src}
                alt={`${p.name} — ${p.meta}`}
                loading="lazy"
                width="562"
                height="1000"
                className="h-full min-h-[260px] w-full object-cover md:min-h-[460px]"
              />
              <span className="zv-tile-cap">
                <span className="zv-h6 block">{p.name}</span>
                <span className="zv-small">{p.meta}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Impact band ────────────────────────────────────────────────────────
   Dark full-width band carrying the practice figures, as the reference
   places beneath its featured projects.                                  */
function ImpactBand() {
  const plates = useFloorPlates();
  return (
    <section className="zv zv-dark zv-section">
      <div className="shell">
        <div data-reveal className="reveal mb-14 max-w-[540px]">
          <span className="zv-subtitle">En chiffres</span>
          <h2 className="zv-h2 mt-5">Douze ans de projets livrés</h2>
        </div>

        <div ref={plates} className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0 m3-plates">
          {stats.map((s, i) => (
            <div key={s.label} className="m3-plate">
            <div
              key={s.label}
              data-reveal
              data-reveal-delay={i * 80}
              className={`reveal px-0 lg:px-8 ${
                i % 2 === 1 ? 'border-l border-[var(--zv-border-dark)]' : ''
              } ${i > 0 ? 'lg:border-l lg:border-[var(--zv-border-dark)]' : 'lg:border-l-0 lg:pl-0'}`}
            >
              <div className="zv-h2">{s.value}</div>
              <div className="zv-small zv-muted mt-3">{s.label}</div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Portfolio mosaic ───────────────────────────────────────────────────
   Reference layout: one tall tile on the left, two stacked on the right,
   each captioned over the image.                                         */
function Portfolio() {
  const axo = useAxonometric();
  return (
    <section className="zv zv-section">
      <div className="shell">
        <div data-reveal className="reveal zv-section-head">
          <span className="zv-subtitle">Portfolio</span>
          <h2 className="zv-h2 mt-5">
            Un aperçu du niveau de finition que nous visons
          </h2>
        </div>

        <div ref={axo} className="m3-axo">
        <div className="grid gap-4 lg:grid-cols-2 m3-axo-grid">
          <div className="m3-axo-tile">
          <Link
            to="/projets/villa-bambou"
            data-reveal
            className="reveal zv-tile"
            aria-label="Villa Bambou — voir le projet"
          >
            <img
              src="/media/villa/villa-01.jpg"
              alt="Villa Bambou — vue sur la piscine"
              loading="lazy"
              width="1280"
              height="1400"
              className="h-full min-h-[380px] w-full object-cover lg:min-h-[620px]"
            />
            <span className="zv-tile-cap">
              <span className="zv-h5 block">Villa Bambou</span>
              <span className="zv-small">Maison individuelle · Marrakech</span>
            </span>
          </Link>
          </div>

          <div className="grid gap-4 m3-axo-grid">
            {[
              { slug: 'adostigia', src: '/media/adostigia/adostigia-16.jpg', name: 'Adostigia', meta: 'Bureau de direction · Casablanca' },
              { slug: 'zahiya', src: '/media/zahiya/zahiya-01.jpg', name: 'Zahiya', meta: 'Séjour livré · Marrakech' },
            ].map((p, i) => (
              <div key={p.slug} className="m3-axo-tile">
              <Link
                key={p.slug}
                to={`/projets/${p.slug}`}
                data-reveal
                data-reveal-delay={(i + 1) * 90}
                className="reveal zv-tile"
                aria-label={`${p.name} — voir le projet`}
              >
                <img
                  src={p.src}
                  alt={`${p.name} — ${p.meta}`}
                  loading="lazy"
                  width="1280"
                  height="720"
                  className="h-full min-h-[220px] w-full object-cover lg:min-h-[302px]"
                />
                <span className="zv-tile-cap">
                  <span className="zv-h6 block">{p.name}</span>
                  <span className="zv-small">{p.meta}</span>
                </span>
              </Link>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

/* ── Core values ────────────────────────────────────────────────────────
   The reference's "what we believe in" grid: three tinted cards holding a
   short principle each.                                                  */
function CoreValues() {
  const values = [
    { title: 'Le site d\'abord', text: "Orientation, vents dominants, vis-à-vis, règlement. Un plan qui ignore son terrain produit un bâtiment qu'il faut corriger ensuite." },
    { title: 'Peu de gestes', text: "Un projet lisible tient en une idée. Nous préférons une loggia bien dimensionnée à cinq décrochés qui se neutralisent." },
    { title: 'La matière tient le budget', text: "Béton teinté, travertin, noyer, laiton. Des matières durables, disponibles localement, qui vieillissent sans se dégrader." },
  ];

  return (
    <section className="zv zv-section">
      <div className="shell">
        <div data-reveal className="reveal zv-section-head">
          <span className="zv-subtitle">Convictions</span>
          <h2 className="zv-h2 mt-5">Ce en quoi nous croyons</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {values.map((v, i) => (
            <div
              key={v.title}
              data-reveal
              data-reveal-delay={i * 80}
              className="reveal flex flex-col gap-4 rounded-t-3xl bg-[var(--zv-bg-alt)] p-5 sm:p-6 md:min-h-[246px] md:justify-between"
            >
              <span className="zv-icon bg-white">
                <ValueIcon i={i} />
              </span>
              <div>
                <h3 className="zv-h5">{v.title}</h3>
                <p className="zv-small mt-2 text-[var(--zv-gray-400)]">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────────────
   Sticky title on the left, accordion list on the right — the reference's
   home-page FAQ shape.                                                   */
function Faq() {
  return (
    <section className="zv zv-section">
      <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <span data-reveal className="reveal zv-subtitle">FAQ</span>
          <h2 data-reveal data-reveal-delay="40" className="reveal zv-h2 mt-5">
            Questions
            <br />
            fréquentes
          </h2>
          <div data-reveal data-reveal-delay="90" className="reveal mt-8">
            <Link to="/contact" className="zv-btn zv-btn-outline">
              Poser la vôtre
              <ArrowNE />
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {agencyFaq.slice(0, 5).map((f, i) => (
            <details
              key={f.q}
              data-reveal
              data-reveal-delay={i * 60}
              className="reveal zv-accordion group"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:gap-5 sm:p-6">
                <span className="zv-h5">{f.q}</span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--zv-border)] transition-transform duration-300 ease-arch group-open:rotate-180 sm:h-9 sm:w-9">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <p className="zv-body zv-muted px-6 pb-6">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowNE() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ValueIcon({ i }) {
  const d = [
    'M4 20h16M6 20V9l6-4 6 4v11',   // site
    'M4 16 10 8l4 5 6-8',           // few gestures
    'M4 8h16v12H4zM4 8l8-4 8 4',    // material
  ][i % 3];
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Featured() {
  return (
    <section className="section-y bg-[var(--sand)]">
      <div className="shell">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div data-reveal className="reveal">
            <span className="eyebrow">Sélection</span>
            <h2 className="display-md mt-6">Projets récents</h2>
          </div>
          <Link data-reveal data-reveal-delay="100" to="/projets" className="reveal btn btn-ghost">
            Tous les projets
          </Link>
        </div>

      </div>

      {/* Full-bleed on purpose: the wheel is clipped by the section's edges,
          not the shell's, so the leaning outer cards run off the viewport. */}
      <div data-reveal data-reveal-delay="140" className="reveal">
        <RadialMarquee projects={projects} />
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="zv zv-alt zv-section">
      <div className="shell">
        <div data-reveal className="reveal zv-section-head">
          <span className="zv-subtitle">Ce que nous faisons</span>
          <h2 className="zv-h2 mt-5">Quatre métiers, un seul interlocuteur</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => (
            <div
              key={s.n}
              data-reveal
              data-reveal-delay={i * 80}
              className="reveal zv-card"
            >
              <span className="zv-icon">
                <span className="zv-h6 leading-none">{s.n}</span>
              </span>
              <h3 className="zv-h4 mt-6">{s.title}</h3>
              <p className="zv-body zv-muted mt-3">{s.text}</p>
              <ul className="mt-7 space-y-3 border-t border-[var(--zv-border)] pt-6">
                {s.points.map((pt) => (
                  <li key={pt} className="zv-small zv-muted flex items-center gap-3">
                    <span className="h-px w-4 shrink-0 bg-[var(--zv-primary)]" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="zv zv-dark zv-section">
      <div className="shell">
        <div data-reveal className="reveal zv-section-head">
          <span className="zv-subtitle">Méthode</span>
          <h2 className="zv-h2 mt-5">Comment on travaille</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((s, i) => (
            <div
              key={s.n}
              data-reveal
              data-reveal-delay={i * 90}
              className="reveal zv-card"
            >
              <span className="zv-icon">
                <span className="zv-h6 leading-none">{s.n}</span>
              </span>
              <h3 className="zv-h5 mt-6">{s.title}</h3>
              <p className="zv-small zv-muted mt-3">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

