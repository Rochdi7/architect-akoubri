import { useEffect, useRef, useState } from 'react';
import InkTitle from '../components/InkTitle';
import { Link } from 'react-router-dom';
import { projects, services, stats, process, testimonials, showcase, agencyFaq } from '../data/projects';
import Accordion from '../components/Accordion';
import RadialMarquee from '../components/RadialMarquee';
import ClientLogos from '../components/ClientLogos';
import GetInTouch from '../components/GetInTouch';
import Testimonials from '../components/Testimonials';
import Showcase from '../components/Showcase';
import { useCoupe } from '../hooks/useCoupe';
import { useFloorPlates } from '../hooks/useFloorPlates';
import { usePageMeta } from '../hooks/usePageMeta';

/* Home — laid out on the Zenvira reference homepage.

   Sections marked PROTECTED are the approved designs and are left
   exactly as they are: Showcase (Les espaces que vous imaginez) and
   Testimonials (Ce qu'en disent les maîtres d'ouvrage). Featured
   (Projets récents) was protected until 2026-09-06, when its card grid
   was replaced by the radial wheel (RadialMarquee) at the owner's
   request; its header row is unchanged. Everything else follows the
   reference order, minus its testimonial and pricing blocks.       */
export default function Home() {

  usePageMeta({
    description:
      "Cabinet d'architecture à Marrakech : conception architecturale, accompagnement au permis de construire, suivi de chantier, design d'intérieur et images de synthèse.",
    canonical: '/',
  });

  return (
    <>
      <Hero />
      <ClientLogos />
      <DesignStories />   {/* links to the 3D stage, now its own page  */}
      <Featured />        {/* PROTECTED — Projets récents          */}
      <ImpactBand />
      <Portfolio />
      <Showcase items={showcase} />   {/* PROTECTED — Les espaces  */}
      <CoreValues />
      <Services />
      {/* PROTECTED — le mur d'avis : 24 avis Google réels, repris mot pour
          mot (voir data/projects.js). La garde ne sert qu'à ne pas afficher
          un titre au-dessus du vide si le tableau venait à être vidé. */}
      {testimonials.length > 0 && <Testimonials items={testimonials} />}
      <Process />
      <Faq />
      <GetInTouch />
    </>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────
   Full-viewport film banner. Everything reads bottom-up: eyebrow, title,
   lead and actions stacked on the left; on the right a glass chip naming
   the project on screen, beside the pause control.

   Three decisions worth keeping:

   · The scrim is directional (zv-hero-scrim), not a flat veil. The film
     runs from golden hour into dusk and is already dark; a uniform wash
     crushed it to a silhouette. Weight sits bottom-left under the copy and
     in a short band under the header — the rest of the frame is left alone.
   · The footage is a 576px source scaled up, so it is soft. A fine grain
     layer (zv-hero-grain) makes that softness read as film rather than as
     a bad upscale. It is a static tile: no blend mode, no per-frame cost.
   · Moving content that starts by itself must be pausable (WCAG 2.2.2), so
     there is a real pause button. Reduced-motion and data-saver visitors
     get the poster and a play button instead of autoplay, and the film
     stops decoding whenever the hero is scrolled out of view.            */
function Hero() {
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  // What the visitor asked for, as opposed to what the observer did: a
  // film paused by hand must stay paused when the hero scrolls back in.
  const userPaused = useRef(false);

  /* The source reel is portrait (576×1024). Cropping it to the desktop
     banner throws away most of the frame on a phone, where the hero is
     itself tall — so two cuts are published from the same footage and the
     right one is chosen once, before the element mounts. `<source media>`
     is deliberately avoided: browsers evaluate it only at load, so a
     desktop that starts narrow keeps the phone file forever after. */
  const portrait =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-aspect-ratio: 3/4)').matches;

  const src = portrait
    ? '/media/projets/akoubri_le-sentier-hero-portrait.mp4'
    : '/media/projets/akoubri_le-sentier-hero.mp4';
  const poster = portrait
    ? '/media/projets/akoubri_le-sentier-hero-poster-portrait.webp'
    : '/media/projets/akoubri_le-sentier-hero-poster.webp';

  useEffect(() => {
    const v = videoRef.current;
    const section = sectionRef.current;
    if (!v || !section) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData;
    if (reduced || saveData) {
      // No autoplay: the poster stays, and the button offers the film.
      userPaused.current = true;
      setPaused(true);
      return undefined;
    }

    const play = () => {
      const p = v.play();
      // Autoplay can be refused (low power mode). The poster simply stays
      // put and the control flips to "play" — never a blank frame.
      if (p?.catch) p.catch(() => setPaused(true));
    };

    if (typeof IntersectionObserver === 'undefined') {
      play();
      return undefined;
    }

    // Decode only while the banner is on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPaused.current) play();
        } else {
          v.pause();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      setPaused(false);
      const p = v.play();
      if (p?.catch) p.catch(() => setPaused(true));
    } else {
      userPaused.current = true;
      setPaused(true);
      v.pause();
    }
  };

  return (
    <section ref={sectionRef} className="zv zv-hero">
      {/* Media layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          fetchpriority="high"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            ready ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          src={src}
          poster={poster}
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setReady(true)}
        />
        <div className="zv-hero-scrim" />
        <div className="zv-hero-grain" aria-hidden="true" />
      </div>

      <div className="shell relative z-10 w-full">
        <div className="grid items-end gap-5 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          {/* Copy. Spacing comes from flex gaps, so the rhythm is set in
              one place per group rather than per element. */}
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-7">
            {/* Eyebrow and title are one unit: a tight gap between them, the
                wider stack gap around them. */}
            <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-5">
              <span className="zv-hero-in zv-subtitle zv-hero-eyebrow">
                Architecte à Marrakech
              </span>

              <InkTitle
                as="h1"
                play
                dark
                className="zv-hero-in zv-h1 text-white"
                style={{ '--d': '70ms' }}
              >
                {/* The break is explicit so the ampersand opens the second
                    line instead of dangling at the end of the first. */}
                Cabinet d'architecture
                <br />
                &amp; design d'intérieur
              </InkTitle>
            </div>

            <p className="zv-hero-in zv-hero-lead" style={{ '--d': '140ms' }}>
              Résidences, villas et espaces de travail. De la conception au
              permis de construire, puis au chantier.
              {/* Second sentence from sm up only: on a phone the lead ran to
                  five lines and, with the actions, left no room for the film. */}
              <span className="hidden sm:inline">
                {' '}Des images de synthèse pour décider sur pièces plutôt que
                sur promesse.
              </span>
            </p>

            <div
              style={{ '--d': '210ms' }}
              className="zv-hero-in flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3"
            >
              <Link to="/projets" className="zv-btn zv-btn-light w-full justify-center sm:w-auto">
                Voir les projets
                <ArrowNE />
              </Link>
              <Link to="/contact" className="zv-btn zv-btn-onmedia w-full justify-center sm:w-auto">
                Parler de votre projet
              </Link>
            </div>
          </div>

          {/* Nothing in this banner uses data-reveal. That observer is for
              content scrolled *to*: its rootMargin ignores the bottom 8% of
              the screen, and on a phone the chip row sits entirely inside
              that band — it stayed invisible until the first scroll. The
              banner is on screen at load, so it animates on load
              (zv-hero-in), with --d as the stagger. */}
          {/* On screen now: the film is a real project, so it is named and
              linked rather than left as anonymous atmosphere. */}
          <div className="zv-hero-in flex items-center gap-3" style={{ '--d': '300ms' }}>
            <Link to="/projets/le-sentier" className="zv-hero-chip group">
              <img
                src="/media/projets/akoubri_le-sentier-hero-thumb.webp"
                alt=""
                aria-hidden="true"
                width="56"
                height="56"
                className="zv-hero-chip-thumb"
              />
              <span className="min-w-0">
                <span className="zv-hero-chip-label">À l'image</span>
                <span className="zv-hero-chip-name">Le Sentier</span>
                <span className="zv-hero-chip-meta">Résidence · Marrakech</span>
              </span>
              <span className="zv-hero-chip-arrow" aria-hidden="true">
                <ArrowNE />
              </span>
            </Link>

            <button
              type="button"
              onClick={toggle}
              aria-pressed={paused}
              aria-label={paused ? 'Lire la vidéo de fond' : 'Mettre la vidéo de fond en pause'}
              className="zv-hero-ctrl"
            >
              {paused ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll cue — desktop only; on a phone the next section already
          peeks above the fold and says the same thing. */}
      <div className="zv-hero-cue" aria-hidden="true">
        <span />
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
          <InkTitle className="zv-h2 max-w-[555px]">
            Les lieux que vous imaginez, tenus jusqu'au chantier
          </InkTitle>
          <div className="max-w-[473px]">
            <p className="zv-body zv-muted">
              Chaque projet est modélisé et rendu avant d'être construit. Vous
              arbitrez sur des images fidèles, pas sur des intentions — de la
              conception jusqu'au dépôt du dossier.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                to="/projets"
                className="inline-flex items-center gap-2 border-b border-line pb-1 text-[12px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-clay hover:text-clay"
              >
                Voir les projets
                <ArrowNE />
              </Link>
              <Link
                to="/services/permis-de-construire-marrakech"
                className="inline-flex items-center gap-2 border-b border-line pb-1 text-[12px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-clay hover:text-clay"
              >
                Permis de construire à Marrakech
                <ArrowNE />
              </Link>
            </div>
          </div>
        </div>

        <div className="zv-tile-row grid gap-3 lg:grid-cols-[1fr_281px_281px]">
          <Link
            to="/projets/le-sentier"
            data-reveal
            className="reveal zv-tile group"
            aria-label="Le Sentier — voir le projet"
          >
            <img
              src="/media/projets/akoubri_le-sentier-toiture-piscine-atlas-01.webp"
              alt="Toiture-terrasse du Sentier : piscine à débordement bordée d'une terrasse en bois et de bains de soleil, Atlas enneigé à l'horizon"
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
            { slug: 'zahiya', src: '/media/projets/akoubri_zahiya-entrance-signage-01.webp', name: 'Zahiya', meta: 'Résidence · Marrakech' },
            { slug: 'adostigia', src: '/media/projets/akoubri_adostigia-reception-01.webp', name: 'Adostigia', meta: 'Aménagement de bureaux · Marrakech' },
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
    <section className="zv zv-dark zv-section zv-stat-band">
      <div className="shell">
        {/* Wide enough for the title to set on one line from lg: at 540px it
            broke in two and left the right half of the band empty above a
            row that spans the full width. */}
        <div data-reveal className="reveal mb-9 max-w-[820px] lg:mb-14">
          <span className="zv-subtitle">Domaines</span>
          <InkTitle className="zv-h2 mt-4 lg:mt-5">Quatre familles de projets</InkTitle>
        </div>

        {/* On phones the four figures read as a 2×2 table: a single hairline
            cross drawn by the grid's own gap (zv-stat-grid) replaces the
            per-item left borders, which only ever landed on the right column
            and left the block looking lopsided. From lg the reference's row
            of four with dividers between them takes over. */}
        <div
          ref={plates}
          className="zv-stat-grid zv-stat-cq grid grid-cols-2 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0 m3-plates"
        >
          {stats.map((s, i) => (
            <div key={s.label} className="m3-plate">
            <div
              data-reveal
              data-reveal-delay={i * 80}
              className={`reveal zv-stat px-0 lg:px-8 ${
                i > 0 ? 'lg:border-l lg:border-[var(--zv-border-dark)]' : 'lg:border-l-0 lg:pl-0'
              }`}
            >
              <div className="zv-stat-value">{s.value}</div>
              <div className="zv-small zv-muted zv-stat-label">{s.label}</div>
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
   each captioned over the image. The motion is useCoupe: every tile comes
   in as an esquisse of its own render and a section line develops it.     */
const MOSAIC = [
  {
    slug: 'le-sentier',
    src: '/media/projets/akoubri_le-sentier-toiture-brasero-07.webp',
    alt: "Piscine de la toiture-terrasse du Sentier au crépuscule, bains de soleil alignés et chaîne de l'Atlas enneigée à l'horizon",
    name: 'Le Sentier',
    meta: 'Toiture-terrasse · Marrakech',
  },
  {
    slug: 'adostigia',
    src: '/media/projets/akoubri_adostigia-director-office-16.webp',
    name: 'Adostigia',
    meta: 'Bureau de direction · Marrakech',
  },
  {
    slug: 'farraj',
    src: '/media/projets/akoubri_farraj-vue-aerienne-03.webp',
    name: 'Farraj',
    meta: 'Conserverie · Marrakech',
  },
];

/* One mosaic tile. The esquisse repeats the render's src, so it costs no
   second request; it and the line are decorative and hidden at rest. */
function MosaicTile({ project, index, tall = false }) {
  const { slug, src, name, meta, alt } = project;
  return (
    <div className="m3-coupe-tile">
      <Link to={`/projets/${slug}`} className="zv-tile" aria-label={`${name} — voir le projet`}>
        <span className="m3-coupe-media">
          <img
            src={src}
            alt={alt || `${name} — ${meta}`}
            loading="lazy"
            width="1280"
            height={tall ? 1400 : 720}
            className={
              tall
                ? 'h-full min-h-[380px] w-full object-cover lg:min-h-[620px]'
                : 'h-full min-h-[220px] w-full object-cover lg:min-h-[302px]'
            }
          />
          <span className="m3-coupe-draft" aria-hidden="true">
            <img src={src} alt="" loading="lazy" />
            <span className="m3-coupe-tag">Esquisse · {String(index + 1).padStart(2, '0')}</span>
          </span>
          <span className="m3-coupe-line" aria-hidden="true" />
        </span>
        <span className="zv-tile-cap">
          <span className={`${tall ? 'zv-h5' : 'zv-h6'} block`}>{name}</span>
          <span className="zv-small block">{meta}</span>
        </span>
      </Link>
    </div>
  );
}

function Portfolio() {
  const coupe = useCoupe();
  const [tall, ...stacked] = MOSAIC;
  return (
    <section className="zv zv-section">
      <div className="shell">
        <div data-reveal className="reveal zv-section-head">
          <span className="zv-subtitle">Portfolio</span>
          <InkTitle className="zv-h2">
            Un aperçu du niveau de finition que nous visons
          </InkTitle>
        </div>

        <div ref={coupe} className="grid gap-4 lg:grid-cols-2 m3-coupe">
          <MosaicTile project={tall} index={0} tall />
          <div className="grid gap-4">
            {stacked.map((p, i) => (
              <MosaicTile key={p.slug} project={p} index={i + 1} />
            ))}
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
          <InkTitle className="zv-h2">Ce en quoi nous croyons</InkTitle>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {values.map((v, i) => (
            <div
              key={v.title}
              data-reveal
              data-reveal-delay={i * 80}
              className="reveal flex flex-col gap-4 rounded-t-3xl bg-[var(--zv-bg-alt)] p-5 sm:p-6 md:min-h-[246px] md:justify-between"
            >
              <span className="zv-icon bg-[var(--paper-raised)]">
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
          <InkTitle data-reveal data-reveal-delay="40" className="reveal zv-h2 mt-5">
            Questions
            <br />
            fréquentes
          </InkTitle>
          <div data-reveal data-reveal-delay="90" className="reveal mt-8">
            <Link to="/contact" className="zv-btn zv-btn-outline">
              Poser la vôtre
              <ArrowNE />
            </Link>
          </div>
        </div>

        <Accordion
          items={agencyFaq.slice(0, 5)}
          summaryClass="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:gap-5 sm:p-6"
          renderIcon={() => (
            <span className="zv-acc-icon zv-acc-icon-chevron flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--zv-border)] sm:h-9 sm:w-9">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
          )}
        />
      </div>
    </section>
  );
}

/* Get in touch — the closing enquiry band now lives in
   components/GetInTouch.jsx, shared with the other pages. */

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
    <section className="section-y bg-[var(--sand)] max-lg:pb-12">
      <div className="shell">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 sm:mb-12 sm:gap-6">
          <div data-reveal className="reveal">
            <span className="eyebrow">Sélection</span>
            <InkTitle className="display-md mt-6">Projets récents</InkTitle>
          </div>
          <Link data-reveal data-reveal-delay="100" to="/projets" className="reveal btn btn-ghost shrink-0">
            Tous les projets
          </Link>
        </div>

      </div>

      {/* Full-bleed on purpose: the wheel is clipped by the section's edges,
          not the shell's, so the leaning outer cards run off the viewport. */}
      <div data-reveal data-reveal-delay="140" className="reveal">
        <RadialMarquee projects={projects} />
      </div>

      {/* No index under the wheel. There used to be a numbered list of every
          project here; with eight projects it became a long directory that
          repeated the wheel above it and the « Tous les projets » button, and
          the owner asked for it to go (2026-09-18). The wheel's own cards are
          the links; its box is trimmed in CSS so no empty band is left. */}
    </section>
  );
}

function Services() {
  return (
    <section className="zv zv-alt zv-section">
      <div className="shell">
        <div data-reveal className="reveal zv-section-head">
          <span className="zv-subtitle">Ce que nous faisons</span>
          <InkTitle className="zv-h2">Quatre métiers, un seul interlocuteur</InkTitle>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => (
            <div
              key={s.n}
              data-reveal
              data-reveal-delay={i * 80}
              className="reveal zv-card zv-icon-card"
            >
              <span className="zv-icon">
                <span className="zv-h6 leading-none">{s.n}</span>
              </span>
              <h3 className="zv-h4">{s.title}</h3>
              <p className="zv-body zv-muted">{s.text}</p>
              <ul className="space-y-3 border-t border-[var(--zv-border)] pt-6">
                {s.points.map((pt) => (
                  <li key={pt} className="zv-small zv-muted flex items-start gap-3">
                    <span className="zv-marker" aria-hidden="true" />
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
          <InkTitle className="zv-h2">Comment on travaille</InkTitle>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((s, i) => (
            <div
              key={s.n}
              data-reveal
              data-reveal-delay={i * 90}
              className="reveal zv-card zv-icon-card zv-icon-card--start"
            >
              <span className="zv-icon">
                <span className="zv-h6 leading-none">{s.n}</span>
              </span>
              <h3 className="zv-h5">{s.title}</h3>
              <p className="zv-small zv-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

