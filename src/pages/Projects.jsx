import { useMemo, useState } from 'react';
import { projects } from '../data/projects';
import { useReveal } from '../hooks/useReveal';
import { useInkFill } from '../hooks/useInkFill';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [filter, setFilter] = useState('Tous');
  const ink = useInkFill({ play: true });

  const categories = useMemo(
    () => ['Tous', ...Array.from(new Set(projects.map((p) => p.category)))],
    []
  );

  const shown = filter === 'Tous' ? projects : projects.filter((p) => p.category === filter);

  // Re-run the reveal observer when the filtered set changes.
  useReveal([filter]);

  return (
    <>
      {/* Page banner */}
      <section className="zv relative overflow-hidden pb-14 pt-32 md:pt-40">
        <div className="shell relative z-10 text-center">
          <span data-reveal className="reveal zv-subtitle">Réalisations</span>
          <h1 ref={ink} data-reveal data-reveal-delay="80" className="reveal zv-h1 mt-5">
            Projets
          </h1>
          <p
            data-reveal
            data-reveal-delay="140"
            className="reveal zv-lead zv-muted mx-auto mt-6 max-w-xl"
          >
            Résidences, sièges sociaux et maisons individuelles. Chaque projet est
            présenté avec ses images de synthèse et ses données de programme.
          </p>

          {/* Filter pills */}
          <div
            data-reveal
            data-reveal-delay="200"
            className="reveal -mx-[var(--gutter)] mt-10 flex gap-2.5 overflow-x-auto px-[var(--gutter)] pb-2 scrollbar-hide sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
          >
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                aria-pressed={filter === c}
                className={`zv-btn shrink-0 ${filter === c ? '' : 'zv-btn-outline'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-[var(--sand)] py-14 md:py-20">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {shown.map((p, i) => (
              <ProjectCard key={p.slug} project={p} delay={(i % 2) * 90} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
