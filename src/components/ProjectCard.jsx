import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCardHover } from '../hooks/useCardHover';

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
  // Only projects with a second frame get the swap; Villa has a single render
  // and the video-led cards keep their poster, so both skip it.
  const swap = Boolean(project.hover) && !project.video;
  const wellRef = useCardHover(swap);

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
    <article data-reveal data-reveal-delay={delay} className="reveal h-full">
      <Link to={`/projets/${project.slug}`} className="group block h-full">
        <div className="media-card flex h-full flex-col">
          <div ref={wellRef} className="media-well aspect-[16/10]">
            {project.video ? (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={project.video}
                /* The poster is a frame from the clip itself, so the card
                   shows the right subject before the video decodes. */
                poster={project.videoPoster || project.cover}
                loop
                muted
                playsInline
                preload="none"
                aria-hidden="true"
                tabIndex={-1}
              />
            ) : (
              <>
                <img
                  data-card-img="base"
                  src={project.cover}
                  alt={project.coverAlt || `${project.name} — ${project.subtitle}`}
                  loading="lazy"
                  width="1280"
                  height="800"
                  /* The CSS zoom stays on cards without a swap. Where GSAP
                     drives the pair it would fight the tween for the same
                     transform, so it is dropped for those. */
                  className={`h-full w-full object-cover ${
                    swap ? '' : 'transition-transform duration-[1200ms] ease-arch group-hover:scale-105'
                  }`}
                />
                {swap && (
                  <img
                    data-card-img="over"
                    src={project.hover}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width="1280"
                    height="800"
                    /* Starts hidden; GSAP sets the initial scale and drives
                       both. A Tailwind scale-* utility here would write
                       --tw-scale-* vars that GSAP's own transform cannot
                       compose with, and the zoom would silently never apply.
                       Without the chunk this frame simply never shows. */
                    className="absolute inset-0 h-full w-full object-cover opacity-0"
                  />
                )}
              </>
            )}
            <span className="media-tag">{project.category}</span>
          </div>

          <div className="flex flex-1 flex-col px-4 py-4 sm:px-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-xl transition-colors group-hover:text-clay sm:text-2xl">
                {project.name}
              </h3>
              {/* year/surface/status are null wherever they could not be
                  verified. Rendering them raw printed an empty span (and an
                  orphan separator gap); the detail page already prints
                  « À confirmer », so the card omits the line instead of
                  showing a blank. */}
              {project.year && (
                <span className="shrink-0 pt-1.5 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                  {project.year}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              {project.subtitle} · {project.location}
            </p>
            {/* grow pushes the meta row to the card’s foot, so the rules
                line up across a row whether the excerpt runs two lines or
                three. */}
            <p className="mt-3 grow text-sm leading-relaxed text-ink-soft">
              {project.excerpt}
            </p>
            {(project.surface || project.status) && (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-line pt-4 text-xs text-ink-muted">
                {project.surface && <span>{project.surface}</span>}
                {project.status && <span>{project.status}</span>}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
