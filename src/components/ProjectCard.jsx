import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/**
 * Project card — the CodeSommet our-work card anatomy: a white shell with
 * thin padding, a rounded media well, a frosted tag, then the text block.
 *
 * Where a project has footage, the well autoplays a muted loop. Unlike the
 * CodeSommet version (which autoplays every video on load), playback here is
 * gated on visibility: off-screen cards stay paused, so a grid of clips does
 * not decode four videos at once on a phone.
 */
export default function ProjectCard({ project, delay = 0 }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Respect data-saver and reduced-motion: leave the poster in place.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData;
    if (reduced || saveData) return;

    if (typeof IntersectionObserver === 'undefined') {
      v.play().catch(() => {});
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <article data-reveal data-reveal-delay={delay} className="reveal">
      <Link to={`/projets/${project.slug}`} className="group block">
        <div className="media-card">
          <div className="media-well aspect-[16/10]">
            {project.video ? (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={project.video}
                poster={project.cover}
                loop
                muted
                playsInline
                preload="none"
                aria-hidden="true"
                tabIndex={-1}
              />
            ) : (
              <img
                src={project.cover}
                alt={`${project.name} — ${project.subtitle}`}
                loading="lazy"
                width="1280"
                height="800"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-arch group-hover:scale-105"
              />
            )}
            <span className="media-tag">{project.category}</span>
          </div>

          <div className="px-4 py-4 sm:px-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-xl transition-colors group-hover:text-clay sm:text-2xl">
                {project.name}
              </h3>
              <span className="shrink-0 pt-1.5 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                {project.year}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              {project.subtitle} · {project.location}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {project.excerpt}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-line pt-4 text-xs text-ink-muted">
              <span>{project.surface}</span>
              <span>{project.status}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
