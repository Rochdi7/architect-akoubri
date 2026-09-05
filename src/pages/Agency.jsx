import { Link } from 'react-router-dom';
import { stats, journey, agencyFaq } from '../data/projects';
import { useReveal } from '../hooks/useReveal';

const values = [
  {
    title: 'Le site d\'abord',
    text: "Orientation, vents dominants, vis-à-vis, règlement d'urbanisme. Un plan qui ignore son terrain produit un bâtiment qu'il faut corriger ensuite.",
    icon: 'site',
  },
  {
    title: 'Peu de gestes',
    text: "Un projet lisible tient en une idée. Nous préférons une loggia bien dimensionnée à cinq décrochés qui se neutralisent.",
    icon: 'line',
  },
  {
    title: 'La matière tient le budget',
    text: "Béton teinté, travertin, noyer, laiton. Des matières durables, disponibles localement, qui vieillissent sans se dégrader.",
    icon: 'material',
  },
  {
    title: 'Rendre avant de bâtir',
    text: "Chaque arbitrage se prend sur une image fidèle. Cela évite les surprises en réception — et les reprises coûteuses en chantier.",
    icon: 'render',
  },
  {
    title: 'Le chantier compte double',
    text: "Un beau dossier mal suivi donne un bâtiment médiocre. Visite hebdomadaire, arbitrages en direct, comptes rendus écrits.",
    icon: 'site-visit',
  },
  {
    title: 'Dire non quand il faut',
    text: "Si un programme ne tient pas dans son budget ou son terrain, nous le disons avant de signer, pas au moment de la réception.",
    icon: 'honest',
  },
];

export default function Agency() {
  useReveal();

  return (
    <>
      <SplitHero />
      <AboutStats />
      <Journey />
      <CoreValues />
      <Faq />
    </>
  );
}

/* ── Split hero ─────────────────────────────────────────────────────────
   Dark rounded panel carrying the copy, paired with a full-bleed render.
   Stacks to panel-over-image on mobile.                                  */
function SplitHero() {
  return (
    <section className="pb-12 pt-20 sm:pt-28 md:pb-20 md:pt-36">
      <div className="shell">
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          <div
            data-reveal
            className="reveal flex flex-col justify-center rounded-[28px] bg-ink p-6 sm:p-10 md:p-14"
          >
            <div className="flex items-center gap-3">
              <Monograms />
              <span className="text-sm on-dark-soft">
                7 personnes, 2 bureaux
              </span>
            </div>

            <h1 className="display-lg mt-7 uppercase leading-[0.95] on-dark">
              Une équipe courte,
              <br />
              un interlocuteur
            </h1>

            <p className="mt-6 max-w-md leading-relaxed on-dark-soft">
              Chaque ligne, chaque matière et chaque ouverture est choisie pour une
              raison. Nous dessinons des lieux qui parlent bas et tiennent longtemps.
            </p>

            <Link
              to="/contact"
              className="mt-9 inline-flex w-max items-center gap-3 rounded-full border border-on-dark px-7 py-4 text-sm font-medium on-dark transition-colors duration-300 hover:bg-[var(--paper)] hover:text-ink"
            >
              Démarrer un projet
              <ArrowNE />
            </Link>
          </div>

          <div data-reveal data-reveal-delay="120" className="reveal overflow-hidden rounded-[28px]">
            <img
              src="/media/zahiya/zahiya-01.jpg"
              alt="Séjour livré — plâtre lisse et grès cérame grand format"
              width="1280"
              height="853"
              fetchPriority="high"
              className="h-full min-h-[280px] w-full object-cover md:min-h-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── About + stats strip ────────────────────────────────────────────────
   Label in a narrow left column, statement set large on the right, then a
   ruled row of figures divided by hairlines.                             */
function AboutStats() {
  return (
    <section className="zv zv-section">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-[160px_1fr] md:gap-12">
          <div data-reveal className="reveal">
            <span className="zv-subtitle">L'agence</span>
          </div>
          <div data-reveal data-reveal-delay="80" className="reveal">
            <h2 className="zv-h4">
              Chaque terrain est une contrainte avant d'être une opportunité —
              orientation, vues, règlement. Notre travail consiste à faire de
              cette contrainte le sujet du projet.
            </h2>
            <p className="zv-lead zv-muted mt-6 max-w-3xl">
              Nous travaillons avec un vocabulaire court : béton teinté, travertin,
              noyer, laiton. Ce qui fait un projet, ce n'est pas le nombre de gestes,
              c'est la justesse d'un seul — une loggia assez profonde, une corniche
              lumineuse bien placée, un seuil qui donne envie d'entrer.
            </p>
          </div>
        </div>

        {/* Figures */}
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 border-y border-[var(--zv-border)] py-10 md:mt-20 md:grid-cols-4 md:gap-x-0 md:gap-y-0 md:py-14">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              data-reveal-delay={i * 70}
              className={`reveal px-2 text-center md:px-6 ${
                i % 2 === 1 ? 'border-l border-[var(--zv-border)]' : ''
              } ${i > 0 ? 'md:border-l md:border-[var(--zv-border)]' : 'md:border-l-0'}`}
            >
              <div className="zv-h2">{s.value}</div>
              <div className="zv-small zv-muted mt-3">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Offset image pair */}
        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-[1.5fr_1fr] md:gap-6">
          <div data-reveal className="reveal relative">
            <div className="zv-media">
              <img
                src="/media/adostigia/adostigia-05.jpg"
                alt="Salle de réunion — travail sur plans"
                loading="lazy"
                width="1280"
                height="720"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
            {/* Floating spec card, as in the reference. */}
            <div className="absolute bottom-3 left-3 w-40 rounded-2xl border border-[var(--zv-border)] bg-white p-2.5 sm:bottom-6 sm:left-6 sm:w-52 sm:p-3">
              <div className="zv-small zv-muted">Le Sentier, Marrakech</div>
              <div className="zv-h5 mt-1">4 200 m²</div>
              <img
                src="/media/le-sentier/sentier-05.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="mt-2 aspect-[16/9] w-full rounded-lg object-cover"
              />
            </div>
          </div>

          <div data-reveal data-reveal-delay="120" className="reveal zv-media md:mt-14">
            <img
              src="/media/adostigia/adostigia-16.jpg"
              alt="Bureau de direction — noyer et laiton"
              loading="lazy"
              width="1280"
              height="720"
              className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Journey timeline ───────────────────────────────────────────────────
   Sticky title on the left, vertical rule with pinned dots on the right.  */
function Journey() {
  return (
    <section className="zv zv-alt zv-section">
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <span data-reveal className="reveal zv-subtitle">Parcours</span>
          <h2 data-reveal data-reveal-delay="40" className="reveal zv-h2 mt-5">
            Notre parcours
            <br />
            en cinq étapes
          </h2>
          <p data-reveal data-reveal-delay="90" className="reveal zv-body zv-muted mt-5 max-w-sm">
            D'une pièce unique à deux bureaux, une trajectoire construite sur des
            projets livrés plutôt que sur des annonces.
          </p>
        </div>

        <ol className="relative">
          {/* The rule stops at the last dot rather than running past it. */}
          <span
            aria-hidden="true"
            className="absolute left-[19px] top-3 -z-10 w-px bg-[var(--zv-border)]"
            style={{ bottom: '3rem' }}
          />

          {journey.map((j, i) => (
            <li
              key={j.year}
              data-reveal
              data-reveal-delay={i * 70}
              className="reveal relative flex gap-4 pb-8 last:pb-0 sm:gap-6 sm:pb-12"
            >
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--zv-primary)] text-white">
                <StepIcon i={i} />
              </span>
              <div className="pt-1">
                <div className="zv-small zv-muted">
                  {j.year} <span className="px-1">·</span> {j.month}
                </div>
                <h3 className="zv-h4 mt-2">{j.title}</h3>
                <p className="zv-body zv-muted mt-3 max-w-lg">{j.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Core values ────────────────────────────────────────────────────────
   Full-bleed dark band, centred header, three-up cards with round icons.  */
function CoreValues() {
  return (
    <section className="zv zv-dark zv-section">
      <div className="shell">
        <div data-reveal className="reveal zv-section-head">
          <span className="zv-subtitle">Convictions</span>
          <h2 className="zv-h2 mt-5">Nos convictions</h2>
          <p className="zv-body zv-muted mx-auto mt-5 max-w-xl">
            Six principes qui décident de la façon dont nous dessinons, chiffrons
            et suivons un projet.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <div
              key={v.title}
              data-reveal
              data-reveal-delay={(i % 3) * 80}
              className="reveal zv-card text-center"
            >
              <span className="zv-icon mx-auto">
                <ValueIcon name={v.icon} />
              </span>
              <h3 className="zv-h5 mt-6">{v.title}</h3>
              <p className="zv-small zv-muted mt-3">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────────────
   Big title and CTA on the left, stacked accordion pills on the right.    */
function Faq() {
  return (
    <section className="zv zv-section">
      <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
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
          {agencyFaq.map((f, i) => (
            <details
              key={f.q}
              data-reveal
              data-reveal-delay={i * 60}
              className="reveal zv-accordion group"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-6">
                <span className="zv-h5">{f.q}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--zv-border)] transition-transform duration-300 ease-arch group-open:rotate-180">
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

/* ── Bits ───────────────────────────────────────────────────────────── */

function Monograms() {
  return (
    <span className="flex -space-x-2" aria-hidden="true">
      {['YB', 'SA', 'KT'].map((m) => (
        <span
          key={m}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-[var(--sand)] font-display text-[11px] text-ink"
        >
          {m}
        </span>
      ))}
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

// Timeline markers: a simple geometric progression rather than clip-art.
function StepIcon({ i }) {
  const paths = [
    'M12 5v6m0 0 3-3m-3 3-3-3M6 18h12',        // seed
    'M5 18 12 6l7 12M9 14h6',                   // form
    'M4 12h16M12 4v16',                         // reach
    'M6 18V9m6 9V5m6 13v-6',                    // growth
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18', // global
  ];
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[i % paths.length]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ValueIcon({ name }) {
  const d = {
    site: 'M4 20h16M6 20V9l6-4 6 4v11',
    line: 'M4 16 10 8l4 5 6-8',
    material: 'M4 8h16v12H4zM4 8l8-4 8 4',
    render: 'M3 6h18v12H3zM8 18v2h8v-2M9 12l2 2 4-4',
    'site-visit': 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11M12 9v3',
    honest: 'M5 12l4 4L19 7',
  }[name];
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
