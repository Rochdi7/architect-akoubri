import { useState } from 'react';
import InkTitle from '../components/InkTitle';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getProject, projects } from '../data/projects';
import { useReveal } from '../hooks/useReveal';
import { useInkFill } from '../hooks/useInkFill';
import Lightbox from '../components/Lightbox';
import { business } from '../data/business';

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

              <QuoteForm project={project} />
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

            <div className="space-y-4">
              {related.map((p, i) => (
                <RelatedRow key={p.slug} project={p} delay={i * 80} />
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

/* ── Quote form ─────────────────────────────────────────────────────────
   The reference puts a short contact form directly on the project page.
   This one posts to the same endpoint as /contact and pre-fills the
   message with the project name so the enquiry arrives with context.    */
function QuoteForm({ project }) {
  const [form, setForm] = useState({ first: '', last: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.first} ${form.last}`.trim(),
          email: form.email,
          message: `[Projet : ${project.name}] ${form.message}`,
        }),
      });
      if (!res.ok) throw new Error('bad status');
      setStatus('sent');
      setForm({ first: '', last: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form data-reveal data-reveal-delay="100" className="reveal zv-panel" onSubmit={onSubmit}>
      {status === 'sent' && (
        <p role="status" className="zv-small mb-6 rounded-xl border border-[var(--zv-primary)] bg-white px-4 py-3">
          Message envoyé. Nous revenons vers vous sous 48 heures ouvrées.
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="zv-small mb-6 rounded-xl border border-red-700 bg-red-50 px-4 py-3 text-red-800">
          L'envoi a échoué. Écrivez-nous à{' '}
          <a href={`mailto:${business.email}`} className="underline">{business.email}</a>.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="zv-label">Prénom</span>
          <input
            type="text"
            value={form.first}
            onChange={set('first')}
            className="zv-input"
            autoComplete="given-name"
            placeholder="Votre prénom"
            required
          />
        </label>
        <label className="block">
          <span className="zv-label">Nom</span>
          <input
            type="text"
            value={form.last}
            onChange={set('last')}
            className="zv-input"
            autoComplete="family-name"
            placeholder="Votre nom"
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="zv-label">E-mail</span>
        <input
          type="email"
          value={form.email}
          onChange={set('email')}
          className="zv-input"
          autoComplete="email"
          placeholder="vous@exemple.com"
          required
        />
      </label>

      <label className="mt-5 block">
        <span className="zv-label">Message</span>
        <textarea
          rows={4}
          value={form.message}
          onChange={set('message')}
          className="zv-input resize-y"
          placeholder="Parlez-nous de votre projet…"
          required
        />
      </label>

      <button type="submit" className="zv-btn mt-6 w-full" disabled={status === 'sending'} aria-busy={status === 'sending'}>
        {status === 'sending' ? 'Envoi…' : 'Demander un devis'}
      </button>
    </form>
  );
}

/* ── Related project row ────────────────────────────────────────────────
   Reference shape: a light panel holding name, description and a "View
   project" pill on the left over a hairline-divided spec list, with the
   image filling the right half. Stacks image-first on mobile.           */
function RelatedRow({ project, delay }) {
  return (
    <div
      data-reveal
      data-reveal-delay={delay}
      className="reveal grid overflow-hidden rounded-3xl border border-[var(--zv-border)] bg-white lg:grid-cols-2"
    >
      <div className="order-2 flex flex-col p-6 sm:p-8 lg:order-1 md:p-10">
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
        className="zv-media order-1 rounded-none lg:order-2"
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
