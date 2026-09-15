import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CONDITIONS, MOTION_3D, useGsapScene } from '../lib/motion';

/* Retour en haut — the button is revealed by the scroll itself.

   The control is fixed at the bottom-right of the viewport on every page, and
   is mounted once in App so there is a single instance for the whole site.

   The reveal is driven by ScrollTrigger's own callbacks rather than by a
   tween attached to the trigger. A tween would have to be re-measured on
   every route change (the button outlives navigation, so its trigger is never
   rebuilt while the page beneath it changes height), and re-measuring a
   played tween re-records its start values from the revealed state — which
   left the button stuck visible at the top of the next page. Driving two
   plain tweens from onToggle keeps the shown/hidden decision a pure function
   of the current scroll position, so a refresh can never strand it.

   The threshold is a viewport and a half: far enough down that scrolling back
   by hand is a real chore, and short pages never reach it.

   With the motion layer off, or under prefers-reduced-motion, the CSS resting
   state in index.css leaves the button visible and usable rather than
   stranding an invisible control on the page.                              */

function build({ gsap, ScrollTrigger, mm, scope }, stRef) {
  mm.add(CONDITIONS, ({ conditions: { motion } }) => {
    if (!motion) return;

    /* Hidden at rest. Applied by GSAP, never by CSS, so the no-chunk and
       reduced-motion paths keep the button usable. */
    const hidden = { autoAlpha: 0, y: 18, scale: 0.9, pointerEvents: 'none' };
    gsap.set(scope, hidden);

    let shown = false;
    const show = (visible) => {
      if (visible === shown) return;
      shown = visible;
      gsap.to(scope, {
        ...(visible ? { autoAlpha: 1, y: 0, scale: 1, pointerEvents: 'auto' } : hidden),
        duration: visible ? 0.45 : 0.3,
        ease: visible ? 'power3.out' : 'power2.in',
        overwrite: true,
      });
    };

    /* ScrollTrigger's own scroll listener drives the decision, but the
       threshold is read from the scroll position rather than from trigger
       geometry: `document.body` starts at the top of the document, so any
       start expressed against its edges resolves to roughly zero and the
       button would either never hide or never show. A viewport and a half of
       scroll is the actual condition, so test exactly that. */
    stRef.current = ScrollTrigger;
    const update = () => show(window.scrollY > window.innerHeight * 1.5);
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'max',
      onUpdate: update,
      onRefresh: update,
    });
    update();

    return () => trigger.kill();
  });
}

export function useBackToTop() {
  const ref = useRef(null);
  /* Held so the route effect can re-measure without import()ing the motion
     chunk — this button must never be the reason GSAP loads. */
  const stRef = useRef(null);
  const { pathname } = useLocation();

  useGsapScene(
    ref,
    (lib) => build(lib, stRef),
    [],
    /* The button is position: fixed, so it measures as on-screen from the
       first frame — but it does not reveal until 150% down the page. Without
       this it would pull the chunk in on every page load, which is exactly
       what the note in `build` rules out. */
    { defer: true }
  );

  /* Pages that mount a scene of their own refresh ScrollTrigger globally as a
     side effect; the plain ones (contact, mentions légales, 404) do not. The
     button's trigger outlives them all, so re-measure here — otherwise it
     keeps the previous route's height and a short page can inherit a reveal
     it should never have reached. */
  useEffect(() => {
    if (!MOTION_3D) return undefined;
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (!cancelled) stRef.current?.refresh();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return ref;
}
