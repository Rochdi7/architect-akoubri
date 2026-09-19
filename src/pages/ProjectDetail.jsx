import { useState } from 'react';
import InkTitle from '../components/InkTitle';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getProject, projects } from '../data/projects';
import { useReveal } from '../hooks/useReveal';
import { useInkFill } from '../hooks/useInkFill';
import Lightbox from '../components/Lightbox';
import ContactForm from '../components/ContactForm';

/* ── Project detail ─────────────────────────────────────────────────────
   Layout ported from the Zenvira reference (project/cosy-layers.html):

     ┌──────────────────┬──────────────────┐
     │ sticky left      │ scrolling right  │
     │  · title card    │  · cover         │
     │    + mini specs  │  · two strongest │
     │  · quote form    │  · rich text     │
     │                  │  · film          │
     │                  │  · rest of set   │
     └──────────────────┴──────────────────┘
     followed by a full-width "related projects" list.

   The sequence is deliberate rather than a flat grid: the gallery is
   authored strongest-first in data/projects.js, so slicing it here yields
   hero → two lead frames → text → film → the remainder. Drawings are
   pulled out of that flow and given their own light panel, because a CAD
   plan cropped to a photo's aspect ratio is unreadable.                  */
export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug);
  const [lightbox, setLightbox] = useState(null); // index or null

  const ink = useInkFill({ play: true });

  useReveal([slug]);

  if (!project) return <Navigate to="/projets" replace />;

  const idx = projects.findIndex((p) => p.slug === slug);
  // Every other project, in order, starting after the current one.
  const related = Array.from(
    { length: projects.length - 1 },
    (_, i) => projects[(idx + 1 + i) % projects.length]
  );

  /* Drawings live in the same gallery array (so the lightbox can page
     through everything) but are shown in their own block. */
  const isPlan = (g) => g.src.includes('-plan-');
  const photos = project.gallery.filter((g) => !isPlan(g));
  const plans = project.gallery.filter(isPlan);

  const lead = photos.slice(1, 3); // [0] is the cover, shown above
  const rest = photos.slice(3);

  /* Spec rows. A null value is printed as « À confirmer » rather than
     invented or silently dropped — the project data file leaves year,
     surface and status null wherever they could not be verified. */
  const specs = [
    ['Catégorie', project.category],
    ['Lieu', project.location],
    ['Mission', project.mission],
    ['Année', project.year],
    ['Surface', project.surface],
    ['Statut', project.status],
  ];

  const indexOf = (entry) => project.gallery.indexOf(entry);

  return (
    <>
      <article className="zv pt-24 sm:pt-28 md:pt-32">
        <div className="shell">
          <Link
            to="/projets"
            className="zv-small zv-muted -my-2 inline-flex min-h-[44px] items-center gap-2 py-2 transition-opacity hover:opacity-70"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Tous les projets
          </Link>

          <div className="mt-6 grid items-start gap-4 lg:grid-cols-2">
            {/* ── Left: sticky typography panel + quote form ── */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-28">
              <div data-reveal className="reveal zv-panel">
                <h1 ref={ink} className="zv-h3">{project.name}</h1>
                <p className="zv-body zv-muted mt-5 md:mt-8">{project.excerpt}</p>

                <dl className="mt-10 grid max-w-sm grid-cols-1 gap-y-5 min-[420px]:grid-cols-2 min-[420px]:gap-x-6 min-[420px]:gap-y-8 md:mt-16">
                  {specs.map(([k, v]) => (
                    <div key={k}>
                      <dt className="zv-small zv-muted">{k} :</dt>
                      <dd className={`zv-small mt-2 ${v ? 'font-medium' : 'italic opacity-60'}`}>
                        {v || 'À confirmer'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* The enquiry form is the shared one, so this page asks for
                  exactly what /contact and the header dialog ask for — and
                  inherits their validation and honeypot. `context` tags the
                  message with the project name on the way out. The reveal
                  lives on this wrapper rather than on the form: ContactForm
                  swaps in a status banner on submit, and a reveal on the
                  form itself would re-run against the changed subtree. */}
              <div data-reveal data-reveal-delay="100" className="reveal zv-panel">
                <h2 className="zv-h5">Demander un devis</h2>
                <p className="zv-small zv-muted mt-2 mb-7">
                  Un projet comparable&nbsp;? Décrivez le vôtre, nous revenons
                  vers vous sous 48&nbsp;heures ouvrées.
                </p>
                <ContactForm
                  compact
                  context={`Projet : ${project.name}`}
                  submitLabel="Demander un devis"
                />
              </div>
            </div>

            {/* ── Right: stacked media and the project text ── */}
            <div className="flex flex-col gap-4">
              {/* Hero. A project whose strongest asset is its film leads
                  with the film; the others lead with the cover still. */}
              {project.video && project.leadWithVideo !== false && project.gallery.length < 12 ? (
                <ProjectVideo
                  src={project.video}
                  poster={project.videoPoster}
                  caption={project.videoCaption}
                  priority
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setLightbox(0)}
                  data-reveal
                  className="mask-reveal zv-panel-media group relative"
                  aria-label={`Agrandir : ${project.gallery[0].alt}`}
                >
                  <img
                    src={project.cover}
                    alt={project.coverAlt || project.gallery[0].alt}
                    width="1280"
                    height="853"
                    fetchpriority="high"
                    className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:min-h-[420px] md:min-h-[619px]"
                  />
                  <span className="absolute inset-0 transition-colors duration-500 group-hover:bg-black/10" />
                  <ExpandBadge count={project.gallery.length} />
                </button>
              )}

              {lead.map((g) => (
                <GalleryTile
                  key={g.src}
                  entry={g}
                  index={indexOf(g)}
                  onOpen={setLightbox}
                />
              ))}

              {/* Rich text — the reference sets an H5 above the paragraphs. */}
              <div data-reveal className="reveal py-6 md:py-10">
                <h2 className="zv-h5">{project.subtitle} · {project.location}</h2>
                <div className="mt-4 space-y-5">
                  {project.body.map((para, i) => (
                    <p key={i} className="zv-body zv-muted">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* The film, where it did not already lead the page. */}
              {project.video && !(project.leadWithVideo !== false && project.gallery.length < 12) && (
                <ProjectVideo
                  src={project.video}
                  poster={project.videoPoster}
                  caption={project.videoCaption}
                />
              )}

              {project.secondaryVideo && (
                <ProjectVideo
                  src={project.secondaryVideo}
                  poster={project.secondaryVideoPoster}
                  caption={project.secondaryVideoCaption}
                />
              )}

              {rest.map((g) => (
                <GalleryTile
                  key={g.src}
                  entry={g}
                  index={indexOf(g)}
                  onOpen={setLightbox}
                />
              ))}
            </div>
          </div>

          {/* ── Drawings ──
              Shown on a light ground at their own aspect ratio, never
              cropped: a plan that loses its dimension strings is no longer
              a plan. `object-contain` and a neutral panel do that job.  */}
          {plans.length > 0 && (
            <section className="mt-10 md:mt-16">
              <div data-reveal className="reveal mb-5 md:mb-7">
                <span className="zv-subtitle">Plans</span>
                <h2 className="zv-h4 mt-3">Distribution</h2>
              </div>
              <div className={`grid gap-4 ${plans.length > 1 ? 'md:grid-cols-2' : ''}`}>
                {plans.map((g) => (
                  <figure key={g.src} data-reveal className="reveal">
                    <button
                      type="button"
                      onClick={() => setLightbox(indexOf(g))}
                      className="group relative block w-full overflow-hidden rounded-2xl border border-[var(--zv-border)] bg-white"
                      aria-label={`Agrandir : ${g.alt}`}
                    >
                      <img
                        src={g.src}
                        alt={g.alt}
                        loading="lazy"
                        className="max-h-[520px] w-full bg-white object-contain p-3"
                      />
                      <ExpandBadge />
                    </button>
                    {g.caption && (
                      <figcaption className="zv-small zv-muted mt-2.5">{g.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Related projects ── */}
        <section className="zv-section">
          <div className="shell">
            <div data-reveal className="reveal zv-section-head">
              <span className="zv-subtitle">Poursuivre</span>
              <InkTitle className="zv-h2">Projets liés</InkTitle>
            </div>

            {/* Below lg the alternating rows become a swipeable card rail:
                stacked, each row is a full spec list plus a 240px image, so
                five of them bury the rest of the page. The rail keeps the
                same projects one thumb-swipe apart. Full-bleed via negative
                shell margins so a card can sit flush against the edge while
                its neighbour peeks in.

                The rail reveals as one piece, not card by card: a card
                parked off to the right never intersects, so it would wait at
                the reveal's translateY(28px), and that offset made the rail
                scroll vertically — a thumb drag then slid the cards up and
                cut their top corners square. overflow-y-hidden is the belt
                to that brace. */}
            <div
              data-reveal
              className="reveal scrollbar-hide -mx-[var(--gutter)] flex snap-x snap-mandatory scroll-pl-[var(--gutter)] gap-4 overflow-x-auto overflow-y-hidden px-[var(--gutter)] pb-2 after:block after:w-px after:shrink-0 lg:hidden"
            >
              {related.map((p) => (
                <RelatedCard key={p.slug} project={p} />
              ))}
            </div>

            <div className="hidden space-y-4 lg:block">
              {related.map((p, i) => (
                <RelatedRow key={p.slug} project={p} delay={i * 80} flip={i % 2 === 1} />
              ))}
            </div>
          </div>
        </section>
      </article>

      {lightbox !== null && (
        <Lightbox
          images={project.gallery}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onChange={setLightbox}
        />
      )}
    </>
  );
}

/* ── Project film ───────────────────────────────────────────────────────
   Muted, looping and inline where the clip is a silent architectural
   loop; a narrated tour keeps its controls and its sound, and is never
   autoplayed. The distinction is drawn from the file itself: the loops
   were exported without an audio track.

   `preload="none"` plus a real poster means the page costs one WebP until
   the visitor asks for the film. The wrapper carries the aspect ratio so
   nothing reflows when the video element finally loads.                 */
function ProjectVideo({ src, poster, caption, priority = false }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure data-reveal className="reveal">
      <div className="zv-panel-media relative">
        {playing ? (
          <video
            src={src}
            poster={poster}
            className="aspect-video w-full bg-black object-cover"
            controls
            autoPlay
            playsInline
            preload="metadata"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group relative block w-full"
            aria-label={caption ? `Lire la vidéo : ${caption}` : 'Lire la vidéo du projet'}
          >
            <img
              src={poster}
              alt=""
              aria-hidden="true"
              width="1280"
              height="720"
              {...(priority
                ? { fetchpriority: 'high' }
                : { loading: 'lazy' })}
              className="aspect-video w-full object-cover"
            />
            <span className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/30" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-transform duration-300 group-hover:scale-105 md:h-20 md:w-20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6 md:h-7 md:w-7" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {caption && <figcaption className="zv-small zv-muted mt-2.5">{caption}</figcaption>}
    </figure>
  );
}

/* One image in the right-hand stack. Top-rounded, opens the lightbox. */
function GalleryTile({ entry, index, onOpen }) {
  return (
    <figure data-reveal data-reveal-delay={(index % 3) * 70} className="reveal">
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="zv-panel-media group relative block w-full"
        aria-label={`Agrandir : ${entry.alt}`}
      >
        <img
          src={entry.src}
          alt={entry.alt}
          loading="lazy"
          width="1280"
          height="853"
          className="w-full object-cover"
        />
        <span className="absolute inset-0 transition-colors duration-500 group-hover:bg-black/10" />
        <ExpandBadge />
      </button>
      {entry.caption && (
        <figcaption className="zv-small zv-muted mt-2.5">{entry.caption}</figcaption>
      )}
    </figure>
  );
}

/* Corner affordance telling the visitor the image opens a full-screen
   carousel. Purely decorative — the whole tile is already the button. */
function ExpandBadge({ count }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-2 text-white/90 backdrop-blur-sm transition duration-300 group-hover:bg-black/70 group-hover:text-white md:right-4 md:top-4"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" />
      </svg>
      {count ? (
        <span className="zv-small text-[11px] font-medium leading-none">
          {count}
        </span>
      ) : null}
    </span>
  );
}

/* ── Related project card (mobile) ─────────────────────────
   The phone form of RelatedRow: same project, same link target, but the
   spec list is cut to Catégorie + Lieu and the whole card is one tap
   target. Width is capped at 76vw so the next card always peeks in —
   that sliver is what tells a visitor the row scrolls, without a hint
   label. `snap-start` rather than centre: the first card should rest
   flush with the shell gutter, matching the headline above it.        */
function RelatedCard({ project }) {
  return (
    <Link
      to={`/projets/${project.slug}`}
      className="group flex w-[76vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-[var(--zv-border)] bg-[var(--paper-raised)]"
    >
      {/* Not .zv-media: zenvira.css loads after the utilities, so its 20px
          radius beat `rounded-none` and rounded the well's bottom corners —
          the image read as tucked under the text block. The card's own
          overflow-hidden rounds the top; the bottom edge stays square. */}
      <div className="overflow-hidden bg-[var(--zv-bg-alt)]">
        <img
          src={project.cover}
          alt=""
          loading="lazy"
          decoding="async"
          width="1280"
          height="960"
          className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-arch group-hover:scale-[1.04]"
        />
      </div>

      {/* flex-1 + mt-auto on the list: the rail stretches every card to the
          tallest, so the spec rows and the link line up across cards whether
          the excerpt clamps at two lines or three. */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="zv-h5">{project.name}</h3>
        <p className="zv-small zv-muted mt-2.5 line-clamp-3">{project.excerpt}</p>

        <dl className="mt-auto pt-5">
          {[
            ['Catégorie', project.category],
            ['Lieu', project.location],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-[var(--zv-border)] py-2.5"
            >
              <dt className="zv-small zv-muted">{k}</dt>
              <dd className="zv-small text-right">{v || 'À confirmer'}</dd>
            </div>
          ))}
        </dl>

        <span className="zv-small mt-5 inline-flex items-center gap-2 font-medium">
          Voir le projet
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/* ── Related project row ────────────────────────────────────────────────
   Reference shape: a light panel holding name, description and a "View
   project" pill on the left over a hairline-divided spec list, with the
   image filling the right half. Stacks image-first on mobile.

   `flip` mirrors the halves so the list alternates text/image, image/text
   down the page. The swap is lg-only: below that both halves collapse to
   one column, where the order-1/order-2 pair already pins the image first
   and a flip would just bury it under the spec list.                     */
function RelatedRow({ project, delay, flip = false }) {
  return (
    <div
      data-reveal
      data-reveal-delay={delay}
      className="reveal grid overflow-hidden rounded-3xl border border-[var(--zv-border)] bg-[var(--paper-raised)] lg:grid-cols-2"
    >
      <div
        className={`order-2 flex flex-col p-6 sm:p-8 md:p-10 ${
          flip ? 'lg:order-2' : 'lg:order-1'
        }`}
      >
        <h3 className="zv-h4">{project.name}</h3>
        <p className="zv-small zv-muted mt-3 max-w-sm">{project.excerpt}</p>

        <Link to={`/projets/${project.slug}`} className="zv-btn zv-btn-outline mt-6 w-max max-w-full md:mt-7">
          Voir le projet
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <dl className="mt-auto pt-6 md:pt-10">
          {[
            ['Catégorie', project.category],
            ['Lieu', project.location],
            ['Mission', project.mission],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-[var(--zv-border)] py-3 md:py-3.5"
            >
              <dt className="zv-small zv-muted">{k}</dt>
              <dd className="zv-small text-right">{v || 'À confirmer'}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Link
        to={`/projets/${project.slug}`}
        className={`zv-media order-1 rounded-none ${flip ? 'lg:order-1' : 'lg:order-2'}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={project.cover}
          alt=""
          loading="lazy"
          width="1280"
          height="853"
          className="h-full min-h-[240px] w-full object-cover md:min-h-[380px]"
        />
      </Link>
    </div>
  );
}
