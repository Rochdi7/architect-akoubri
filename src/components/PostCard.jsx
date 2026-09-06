import { Link } from 'react-router-dom';
import { formatDate } from '../data/posts';

/**
 * Journal card — System B (olive). Top-only rounded media, as everywhere
 * else in the Zenvira layer, over a flat bordered body with no shadow.
 *
 * `featured` renders the lead post as a two-column row on large screens;
 * the same markup collapses to the standard stacked card below `lg`.
 */
export default function PostCard({ post, delay = 0, featured = false }) {
  return (
    <article data-reveal data-reveal-delay={delay} className="reveal">
      <Link
        to={`/journal/${post.slug}`}
        className={`group flex h-full flex-col overflow-hidden rounded-[20px] border border-[var(--zv-border)] bg-[var(--zv-white)] transition-colors duration-300 hover:border-[var(--zv-primary)] ${
          featured ? 'lg:flex-row' : ''
        }`}
      >
        <div className={`overflow-hidden bg-[var(--zv-bg-alt)] ${featured ? 'lg:w-[55%] lg:shrink-0' : ''}`}>
          <img
            src={post.cover}
            alt=""
            aria-hidden="true"
            loading={featured ? 'eager' : 'lazy'}
            width="1280"
            height="853"
            className={`w-full object-cover transition-transform duration-[900ms] ease-arch group-hover:scale-[1.04] ${
              featured ? 'aspect-[16/10] lg:h-full' : 'aspect-[3/2]'
            }`}
          />
        </div>

        <div className={`flex flex-1 flex-col p-5 sm:p-6 ${featured ? 'lg:justify-center lg:p-10' : ''}`}>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8125rem] leading-5">
            <span className="font-medium text-[var(--zv-primary)]">{post.category}</span>
            <span aria-hidden="true" className="text-[var(--zv-gray-100)]">·</span>
            <time dateTime={post.date} className="text-[var(--zv-gray-400)]">
              {formatDate(post.date)}
            </time>
          </div>

          <h3
            className={`zv-h5 zv-card-title mt-3 ${
              featured ? 'zv-card-title--featured sm:mt-4' : ''
            }`}
          >
            {post.title}
          </h3>

          <p className={`zv-muted mt-3 line-clamp-3 text-[0.9375rem] leading-[1.55] ${featured ? 'sm:text-base' : ''}`}>
            {post.excerpt}
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-[var(--zv-border)] pt-4 sm:mt-6 sm:pt-5">
            <span className="text-[0.8125rem] leading-5 text-[var(--zv-gray-400)]">
              {post.readingTime} min de lecture
            </span>
            <span className="inline-flex items-center gap-2 text-[0.8125rem] font-medium leading-5 transition-transform duration-300 ease-arch group-hover:translate-x-1">
              Lire
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
