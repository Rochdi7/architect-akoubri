import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getProject, projects } from '../data/projects';
import { useReveal } from '../hooks/useReveal';
import { useInkFill } from '../hooks/useInkFill';
import Lightbox from '../components/Lightbox';

/* ── Project detail ─────────────────────────────────────────────────────
   Layout ported from the Zenvira reference (project/cosy-layers.html):

     ┌──────────────────┬──────────────────┐
     │ sticky left      │ scrolling right  │
     │  · title card    │  · cover image   │
     │    + mini specs  │  · image         │
     │  · quote form    │  · rich text     │
     │                  │  · image ×2      │
     └──────────────────┴──────────────────┘
     followed by a full-width "related projects" list.

   The left column is sticky, so the specs and the form stay in view while
   the imagery scrolls past — the behaviour that gives the reference page
   its rhythm. Panels carry top-only rounding, as in the reference.       */
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

  // The right column alternates image / text / image, so the gallery is
  // split around the rich-text block rather than shown as a flat grid.
  const lead = project.gallery.slice(0, 2);
  const rest = project.gallery.slice(2, 6);

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
                  {[
                    ['Année', project.year],
                    ['Catégorie', project.category],
                    ['Surface', project.surface],
                    ['Lieu', project.location],
                    ['Mission', project.mission],
                    ['Statut', project.status],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="zv-small zv-muted">{k} :</dt>
                      <dd className="zv-small mt-2 font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <QuoteForm project={project} />
            </div>

            {/* ── Right: stacked media and the project text ── */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setLightbox(0)}
                data-reveal
                className="mask-reveal zv-panel-media group relative mb-4"
                aria-label={`Agrandir la vue principale de ${project.name}`}
              >
                <img
                  src={project.cover}
                  alt={`${project.name} — vue principale`}
                  width="1280"
                  height="853"
                  fetchpriority="high"
                  className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:min-h-[420px] md:min-h-[619px]"
                />
                <span className="absolute inset-0 transition-colors duration-500 group-hover:bg-black/10" />
              </button>

              {lead.map((src, i) => (
                <GalleryTile
                  key={src}
                  src={src}
                  index={i}
                  name={project.name}
                  onOpen={setLightbox}
                />
              ))}

              {/* Rich text — the reference sets an H5 above the paragraphs. */}
              <div data-reveal className="reveal my-8 md:my-14">
                <h2 className="zv-h5">{project.subtitle} · {project.location}</h2>
                <div className="mt-4 space-y-5">
                  {project.body.map((para, i) => (
                    <p key={i} className="zv-body zv-muted">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {rest.map((src, i) => (
                <GalleryTile
                  key={src}
                  src={src}
                  index={i + lead.length}
                  name={project.name}
                  onOpen={setLightbox}
                  last={i === rest.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Related projects ── */}
        <section className="zv-section">
          <div className="shell">
            <div data-reveal className="reveal zv-section-head">
              <span className="zv-subtitle">Poursuivre</span>
              <h2 className="zv-h2 mt-5">Projets liés</h2>
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
          alt={`${project.name} — vue ${lightbox + 1}`}
          onClose={() => setLightbox(null)}
          onChange={setLightbox}
        />
      )}
    </>
  );
}

/* One image in the right-hand stack. Top-rounded, opens the lightbox. */
function GalleryTile({ src, index, name, onOpen, last }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index + 1)}
      data-reveal
      data-reveal-delay={(index % 3) * 70}
      className={`reveal zv-panel-media group relative ${last ? '' : 'mb-4'}`}
      aria-label={`Agrandir la vue ${index + 2} de ${name}`}
    >
      <img
        src={src}
        alt={`${name} — vue ${index + 2}`}
        loading="lazy"
        width="1280"
        height="853"
        className="w-full object-cover"
      />
      <span className="absolute inset-0 transition-colors duration-500 group-hover:bg-black/10" />
    </button>
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
          <a href="mailto:contact@akoubri.com" className="underline">contact@akoubri.com</a>.
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
            ['Surface', project.surface],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-[var(--zv-border)] py-3 md:py-3.5"
            >
              <dt className="zv-small zv-muted">{k}</dt>
              <dd className="zv-small text-right">{v}</dd>
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
