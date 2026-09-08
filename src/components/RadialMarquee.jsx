import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* Radial marquee — the recent projects on a slowly turning wheel.

   The cards sit on the rim of a large circle whose centre is far below the
   section, so only the top arc is visible: the middle card upright, its
   neighbours leaning away like sheets fanned on a drawing board. The wheel
   turns continuously (a CSS keyframe, so it runs with no script at all and
   stops under prefers-reduced-motion by media query), and scrolling spins it
   faster: the script scales the animation's playbackRate with scroll speed
   and lets it ease back to 1.

   Four projects fill eight slots; the four repeats are aria-hidden with
   their links out of the tab order, so assistive tech and the keyboard see
   four projects, not eight. Eight is also what the phone's depth cylinder
   needs: fewer slots means a bigger angular step, so neighbours do not
   overlap once they are ringed around it. Images are deliberately not lazy: the wheel is
   a transformed track, so a frame in the hidden half never intersects the
   viewport and a lazy image there would only load as it swung into view.
   Four unique files are fetched; the repeats hit the cache.

   Off-screen the animation is paused (IntersectionObserver), so a wheel
   below the fold costs nothing. Hovering a card pauses the wheel too, so a
   moving link can actually be clicked.                                    */

const SLOTS = 20;
const MAX_RATE = 7; // playbackRate ceiling while scrolling hard
const GAIN = 3; // rate per px/ms of scroll velocity
const DECAY = 0.08; // ease-back factor per frame

export default function RadialMarquee({ projects }) {
  const wheelRef = useRef(null);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return undefined;

    // Pause while the section is out of view.
    let io;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => wheel.classList.toggle('is-paused', !entry.isIntersecting),
        { threshold: 0.02 }
      );
      io.observe(wheel.parentElement);
    }

    // Scroll speed → spin speed. Reads the CSS animation through the Web
    // Animations API; under reduced motion there is no animation and this
    // is a no-op.
    let lastY = window.scrollY;
    let lastT = performance.now();
    let rate = 1;
    let raf = 0;
    const spin = () => wheel.getAnimations()[0];

    const tick = () => {
      rate += (1 - rate) * DECAY;
      const a = spin();
      if (Math.abs(rate - 1) > 0.01) {
        if (a) a.playbackRate = rate;
        raf = requestAnimationFrame(tick);
      } else {
        rate = 1;
        if (a) a.playbackRate = 1;
        raf = 0;
      }
    };
    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const v = Math.abs(y - lastY) / Math.max(now - lastT, 1);
      lastY = y;
      lastT = now;
      rate = Math.min(Math.max(rate, 1 + v * GAIN), MAX_RATE);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const slots = Array.from({ length: SLOTS }, (_, i) => ({
    project: projects[i % projects.length],
    i,
    repeat: i >= projects.length,
  }));

  return (
    <div className="m3-radial">
      <div ref={wheelRef} className="m3-radial__wheel">
        {slots.map(({ project: p, i, repeat }) => (
          <div
            key={i}
            className="m3-radial__slot"
            style={{ '--i': i }}
            aria-hidden={repeat ? 'true' : undefined}
          >
            <Link
              to={`/projets/${p.slug}`}
              className="m3-radial__card"
              tabIndex={repeat ? -1 : undefined}
            >
              <img
                src={p.cover}
                alt={repeat ? '' : `${p.name} — ${p.subtitle}`}
                width="1280"
                height="800"
                draggable="false"
              />
              <span className="m3-radial__caption">
                <span className="m3-radial__name">{p.name}</span>
                <span className="m3-radial__meta">
                  {p.subtitle} · {p.location}
                </span>
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
