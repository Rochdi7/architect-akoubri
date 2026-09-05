import { useState } from 'react';
import { services, stats, projects } from '../data/projects';
import { useReveal } from '../hooks/useReveal';

// Frames for the banner ticker, drawn from across the project renders.
const ticker = [
  '/media/le-sentier/sentier-05.jpg',
  '/media/zahiya/zahiya-12.jpg',
  '/media/adostigia/adostigia-22.jpg',
  '/media/villa/villa-01.jpg',
  '/media/adostigia/adostigia-16.jpg',
  '/media/zahiya/zahiya-01.jpg',
];

// One reference image per service, drawn from the project renders.
const shots = [
  { src: '/media/le-sentier/sentier-05.jpg', alt: 'Façade Le Sentier — architecture résidentielle' },
  { src: '/media/zahiya/zahiya-12.jpg', alt: 'Séjour Zahiya — design d\'intérieur' },
  { src: '/media/adostigia/adostigia-22.jpg', alt: 'Salon corporate — image de synthèse' },
  { src: '/media/adostigia/adostigia-01.jpg', alt: 'Signalétique en laiton sur mur de travertin' },
];

// Bar heights for the trust graph, in the reference's staggered order
// (short, tall, medium, shortest) — the row is bottom-aligned, so the
// varying heights are what give the section its skyline.
const BAR_HEIGHTS = ['150px', '288px', '205px', '107px'];

const faq = [
  {
    q: 'Travaillez-vous en dehors de Marrakech et Casablanca ?',
    a: "Oui. Nous suivons des chantiers partout au Maroc. Au-delà de 200 km, nous calons un rythme de visites groupées pour maîtriser les frais de déplacement.",
  },
  {
    q: 'Pouvez-vous intervenir uniquement sur les images 3D ?',
    a: "Bien sûr. Beaucoup de promoteurs nous confient seulement la production d'images à partir de plans existants, pour une commercialisation ou un dossier d'investisseurs.",
  },
  {
    q: 'Quel est le délai moyen pour une esquisse ?',
    a: "Comptez deux à trois semaines après la visite du site, selon la taille du programme. Vous recevez deux à trois partis architecturaux rendus en 3D.",
  },
  {
    q: 'Comment sont établis vos honoraires ?',
    a: "Au pourcentage du montant des travaux pour une mission complète, ou au forfait pour une mission partielle (permis seul, intérieurs seuls, images seules). Le devis est fixé avant tout démarrage.",
  },
];

export default function Services() {
  useReveal();

  return (
    <>
      {/* ── Banner: centred title over a drifting image strip ── */}
      <section className="zv overflow-hidden pt-24 sm:pt-32 md:pt-44">
        <div className="shell">
          <div data-reveal className="reveal mx-auto max-w-4xl text-center">
            <h1 className="zv-h2">
              Une architecture ancrée dans le lieu, l'usage et la matière
            </h1>
            <p className="zv-lead zv-muted mx-auto mt-5 max-w-xl">
              Mission complète ou intervention ciblée. Nous adaptons le périmètre à
              l'état d'avancement de votre projet.
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
          <div data-reveal className="reveal mx-auto mb-12 max-w-[764px] text-center md:mb-20 lg:mb-32">
            <h2 className="zv-h4">
              De l'esquisse à la réception, nous livrons une architecture tenue —{' '}
              <span className="text-[var(--zv-gray-100)]">
                avec une attention constante au détail et le goût des choses qui durent.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 items-end gap-x-3 gap-y-6 sm:gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                data-reveal
                data-reveal-delay={i * 90}
                className="reveal flex flex-col gap-2 sm:gap-3"
              >
                {/* The height is a custom property, not an inline height:
                    below sm the stylesheet ignores it and lets the bar size
                    to its label, which otherwise spills past a 107px bar. */}
                <div className="zv-graph" style={{ '--bar-h': BAR_HEIGHTS[i] }}>
                  <span className="zv-graph-line" />
                  <span className="zv-graph-label">{s.label}</span>
                </div>
                <div className="zv-h3">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternating service rows */}
      <section className="zv zv-section pt-0">
        <div className="shell space-y-12 sm:space-y-20 md:space-y-28">
          {services.map((s, i) => (
            <div
              key={s.n}
              data-reveal
              className={`reveal grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                i % 2 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
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
              <div>
                <span className="zv-icon">
                  <span className="zv-h6 leading-none">{s.n}</span>
                </span>
                <h2 className="zv-h3 mt-6">{s.title}</h2>
                <p className="zv-lead zv-muted mt-5 max-w-md">{s.text}</p>
                <ul className="mt-8 grid max-w-md gap-3 border-t border-[var(--zv-border)] pt-7 sm:grid-cols-2">
                  {s.points.map((pt) => (
                    <li key={pt} className="zv-small zv-muted flex items-start gap-3">
                      <span className="h-px w-4 shrink-0 bg-[var(--zv-primary)]" />
                      {pt}
                    </li>
                  ))}
                </ul>
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
            <h2 className="zv-h2 mt-5">Avant de nous écrire</h2>
          </div>
          <div className="space-y-4">
            {faq.map((f, i) => (
              <details
                key={f.q}
                data-reveal
                data-reveal-delay={i * 70}
                className="reveal zv-accordion group"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6">
                  <span className="zv-h5">{f.q}</span>
                  <span className="relative h-4 w-4 shrink-0">
                    <span className="absolute top-1/2 block h-px w-full bg-[var(--zv-primary)]" />
                    <span className="absolute left-1/2 block h-full w-px bg-[var(--zv-primary)] transition-transform duration-300 ease-arch group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="zv-body zv-muted max-w-2xl px-6 pb-6">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaWithCards />
    </>
  );
}

/* ── CTA with floating project cards ────────────────────────────────────
   Reference shape: a centred form with four small cards pinned to the
   corners of the section. The cards are decorative framing, so they are
   hidden below 1280px (where they would overlap the form) and marked
   aria-hidden — the same projects are reachable from the nav.          */
function CtaWithCards() {
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
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error('bad status');
      setStatus('sent');
      setForm({ first: '', last: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  // Corner placements, in the reference's order. `inset-*` values are
  // relative to the shell, which is given a min-height below so the two
  // bottom cards have something to anchor to.
  const spots = [
    'left-0 top-6',
    'right-1 top-6',
    'bottom-16 left-1',
    'bottom-14 right-1',
  ];

  return (
    <section className="zv zv-section relative overflow-hidden">
      <div className="shell relative xl:min-h-[720px] xl:py-10">
        {projects.slice(0, 4).map((p, i) => (
          <div key={p.slug} className={`zv-cta-card ${spots[i]}`} aria-hidden="true">
            <div className="mb-4 flex items-center gap-2">
              <CardIcon i={i} />
              <span className="zv-body font-medium">{p.name}</span>
            </div>
            <div className="zv-cta-card-media">
              <img
                src={p.cover}
                alt=""
                loading="lazy"
                width="420"
                height="280"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </div>
        ))}

        <div className="relative z-10 mx-auto max-w-[530px] xl:py-8">
          <form data-reveal className="reveal" onSubmit={onSubmit}>
            {status === 'sent' && (
              <p role="status" className="zv-small mb-6 rounded-xl border border-[var(--zv-primary)] bg-white px-4 py-3">
                Message envoyé. Nous revenons vers vous sous 48 heures ouvrées.
              </p>
            )}
            {status === 'error' && (
              <p role="alert" className="zv-small mb-6 rounded-xl border border-red-700 bg-red-50 px-4 py-3 text-red-800">
                L'envoi a échoué. Écrivez-nous à{' '}
                <a href="mailto:contact@adostigia.com" className="underline">contact@adostigia.com</a>.
              </p>
            )}

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6 sm:flex-row">
                <label className="block w-full">
                  <span className="zv-small font-medium">Prénom</span>
                  <input
                    type="text"
                    value={form.first}
                    onChange={set('first')}
                    className="zv-field"
                    autoComplete="given-name"
                    placeholder="Votre prénom"
                    required
                  />
                </label>
                <label className="block w-full">
                  <span className="zv-small font-medium">Nom</span>
                  <input
                    type="text"
                    value={form.last}
                    onChange={set('last')}
                    className="zv-field"
                    autoComplete="family-name"
                    placeholder="Votre nom"
                  />
                </label>
              </div>

              <label className="block">
                <span className="zv-small font-medium">E-mail</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  className="zv-field"
                  autoComplete="email"
                  placeholder="vous@exemple.com"
                  required
                />
              </label>

              <label className="block">
                <span className="zv-small font-medium">Message</span>
                <textarea
                  value={form.message}
                  onChange={set('message')}
                  className="zv-field"
                  placeholder="Parlez-nous de votre projet…"
                  required
                />
              </label>

              <button type="submit" className="zv-btn w-full" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                {status === 'sending' ? 'Envoi…' : 'Démarrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// Small glyph on each floating card, echoing the reference's icon chips.
function CardIcon({ i }) {
  const d = [
    'M4 20h16M6 20V9l6-4 6 4v11',           // building
    'M4 8h16v12H4zM4 8l8-4 8 4',            // volume
    'M3 6h18v12H3zM8 18v2h8v-2',            // screen
    'M4 16 10 8l4 5 6-8',                   // line
  ][i % 4];
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
