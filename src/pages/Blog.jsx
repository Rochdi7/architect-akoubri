import { useMemo, useState } from 'react';
import { sortedPosts } from '../data/posts';
import { useReveal } from '../hooks/useReveal';
import { useInkFill } from '../hooks/useInkFill';
import PostCard from '../components/PostCard';

/* Journal index — same anatomy as /projets: a centred banner, a row of
   filter pills, then the grid. The newest post is pulled out as a wide
   featured row above the grid, but only when the unfiltered set is shown;
   inside a filtered view every card stays the same size so the eye can
   compare them. */
export default function Blog() {
  const [filter, setFilter] = useState('Toutes');

  const categories = useMemo(
    () => ['Toutes', ...Array.from(new Set(sortedPosts.map((p) => p.category)))],
    []
  );

  const shown =
    filter === 'Toutes' ? sortedPosts : sortedPosts.filter((p) => p.category === filter);

  const isDefault = filter === 'Toutes';
  const featured = isDefault ? shown[0] : null;
  const rest = isDefault ? shown.slice(1) : shown;

  const ink = useInkFill({ play: true });

  useReveal([filter]);

  return (
    <>
      {/* Banner */}
      <section className="zv relative overflow-hidden pb-4 pt-32 md:pb-6 md:pt-40">
        <div className="shell relative z-10 text-center">
          <span data-reveal className="reveal zv-subtitle">Journal</span>
          <h1 ref={ink} data-reveal data-reveal-delay="80" className="reveal zv-h1 mt-5">
            Notes d&apos;agence
          </h1>
          <p
            data-reveal
            data-reveal-delay="140"
            className="reveal zv-lead zv-muted mx-auto mt-6 max-w-xl"
          >
            Ce que nous apprenons en concevant et en suivant des chantiers au
            Maroc — méthode, matières, lumière et coordination.
          </p>

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
      <section className="zv zv-alt zv-section">
        <div className="shell">
          {featured && (
            <div className="mb-5">
              <PostCard post={featured} featured />
            </div>
          )}

          {rest.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p, i) => (
                <PostCard key={p.slug} post={p} delay={(i % 3) * 80} />
              ))}
            </div>
          )}

          {/* Defensive: every category currently has at least one post, but a
              future edit to posts.js could empty one. */}
          {shown.length === 0 && (
            <p className="zv-body zv-muted py-10 text-center">
              Aucun article dans cette catégorie pour le moment.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
