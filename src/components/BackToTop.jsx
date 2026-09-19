import { useBackToTop } from '../hooks/useBackToTop';

/**
 * BackToTop — a fixed control at the bottom-right of the viewport, on every
 * page. Mounted once in App so there is exactly one instance and one
 * ScrollTrigger for the whole site.
 *
 * The reveal is GSAP's (see useBackToTop); everything here is the resting
 * appearance, which stays correct if the motion chunk never arrives.
 */
export default function BackToTop() {
  const ref = useBackToTop();

  const toTop = () => {
    /* Matches RouteEffects' reasoning in reverse: here the smooth glide is
       the point, so let `html { scroll-behavior: smooth }` do the work —
       except when the reader has asked for less motion. */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? 'instant' : 'smooth' });
  };

  return (
    <button ref={ref} type="button" className="back-to-top" onClick={toTop} aria-label="Retour en haut de la page">
      {/* The water: rises with scroll progress (`--fill`, written by
          useBackToTop). Two wave crests ride its surface at different speeds
          so the level reads as liquid rather than as a progress bar. */}
      <span className="back-to-top__water" aria-hidden="true">
        <Wave className="back-to-top__wave back-to-top__wave--back" />
        <Wave className="back-to-top__wave" />
      </span>
      <ArrowUp />
    </button>
  );
}

/* Two full periods across the viewBox, so sliding the crest by half its own
   width loops without a seam. */
function Wave({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 12" preserveAspectRatio="none" focusable="false">
      <path d="M0 6Q15 0 30 6T60 6T90 6T120 6V12H0Z" fill="currentColor" />
    </svg>
  );
}

function ArrowUp() {
  return (
    <svg className="back-to-top__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
