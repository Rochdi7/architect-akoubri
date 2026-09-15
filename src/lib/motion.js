import { useEffect } from 'react';

/* GSAP 3D motion layer — entry point.

   Everything the layer does is reachable only through useGsapScene(), and
   useGsapScene() does nothing unless MOTION_3D is true. Flip it to false and
   the library is never even requested: the wrappers the scenes hang off stay
   in the DOM as inert, unstyled-at-rest blocks, and the site renders exactly
   as it did before the layer existed. */
export const MOTION_3D = true;

/* Shared gsap.matchMedia() conditions. `motion` false means no 3D at all.
   `desktop` only scales intensity: below 1024px every set piece still runs,
   at angles and depths tuned so the moving sheet stays inside a 390px
   viewport and a mid-range Android has fewer pixels to composite. */
export const CONDITIONS = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 1024px)',
};

/* One shared promise so every scene on a page resolves the same chunk; a
   failed load is forgotten so a later mount can retry. */
let pending = null;
function importMotion() {
  if (!pending) {
    pending = import('./gsap').catch((err) => {
      pending = null;
      throw err;
    });
  }
  return pending;
}

/* ── Deferred fetch ───────────────────────────────────────────────────────
   The chunk is not on the critical path: nothing above the fold needs it, so
   the request waits rather than competing with the fonts and the hero image
   during the initial load.

   The catch is that it must not wait for the *scroll itself*. A set piece
   sits a screen or two down; if the fetch only started on the first wheel
   tick, the chunk would still be in flight as the section came into view and
   its reveal would be missed entirely. So the gate opens on the earliest
   signal that the reader is engaging at all — a pointer moving over the page,
   a key, a touch — which in practice lands hundreds of milliseconds before
   any scrolling begins, and falls back to an idle timer for a session where
   nothing moves at all. By the time a scene is actually reached, GSAP is
   there.

   All listeners are passive and one-shot. A scene already inside the viewport
   on load bypasses the gate entirely (see `useGsapScene`). Once anything
   opens it, it stays open for the rest of the session. */
let gate = null;

const INTENT = [
  'pointermove',
  'pointerdown',
  'wheel',
  'touchstart',
  'touchmove',
  'keydown',
  'scroll',
];

/* A reader who has not moved anything at all still gets the chunk eventually,
   so a keyboard-free, mouse-free session is not left unanimated. Long enough
   that the load itself is well past — this is a backstop, not the main path;
   in practice `pointermove` opens the gate first. */
const IDLE_MS = 6000;

/* One gate for the whole session, created on first use and never torn down.

   It must be shared rather than per-caller: several scenes wait on it at
   once, and under StrictMode each of them mounts, cleans up and mounts
   again. A per-caller gate would let the first cleanup remove the listeners
   the second mount is still waiting on, and nothing would ever resolve. */
function openWhenEngaged() {
  if (gate) return gate;
  if (typeof window === 'undefined') return (gate = Promise.resolve());

  // Already scrolled (a reload part-way down, or a #hash landing).
  if (window.scrollY > 0) return (gate = Promise.resolve());

  gate = new Promise((resolve) => {
    const aborter = new AbortController();
    let timer = 0;
    const fire = () => {
      clearTimeout(timer);
      aborter.abort();
      resolve();
    };
    INTENT.forEach((ev) =>
      window.addEventListener(ev, fire, { passive: true, once: true, signal: aborter.signal })
    );
    timer = setTimeout(fire, IDLE_MS);
  });
  return gate;
}

/* Request the chunk. `now: true` skips the scroll gate — used by scenes that
   are already on screen, where waiting would mean a visible pop-in. */
export function loadMotion({ now = false } = {}) {
  if (now) {
    // An on-screen scene needs it immediately; mark the gate open so every
    // other waiting scene proceeds too rather than sitting on a gesture.
    gate = Promise.resolve();
    return importMotion();
  }
  return openWhenEngaged().then(importMotion);
}

/* Lazy images (the site sets width/height everywhere, but a late decode can
   still move a trigger by a pixel or two). One refresh, debounced, once the
   remaining images in scope have settled. */
function refreshAfterImages(ScrollTrigger, scope, signal) {
  const waiting = Array.from(scope.querySelectorAll('img')).filter((img) => !img.complete);
  if (!waiting.length) return;
  let timer;
  const bump = () => {
    clearTimeout(timer);
    timer = setTimeout(() => ScrollTrigger.refresh(), 120);
  };
  waiting.forEach((img) => {
    img.addEventListener('load', bump, { once: true, signal });
    img.addEventListener('error', bump, { once: true, signal });
  });
  signal.addEventListener('abort', () => clearTimeout(timer));
}

/* Builds one scene inside a gsap.context() bound to `scopeRef`, after the
   library has loaded.

   `build({ gsap, ScrollTrigger, ease, mm, scope })` is called once; anything
   it creates — tweens, timelines, ScrollTriggers, matchMedia branches — is
   reverted when the component unmounts or `deps` change. That revert is what
   keeps StrictMode's double-mount and every route change from leaking
   triggers: ScrollTrigger.getAll().length must not grow with navigation.

   The page is fully laid out and visible before any of this runs. A start
   state is only ever applied by GSAP itself, so a chunk that never arrives
   leaves the site looking correct, just unanimated. */
export function useGsapScene(scopeRef, build, deps = [], { defer = false } = {}) {
  useEffect(() => {
    if (!MOTION_3D || !scopeRef.current) return undefined;

    let cancelled = false;
    let ctx = null;
    let mm = null;
    let settle = 0;
    const aborter = new AbortController();

    // A scene already inside (or just below) the viewport must not wait on a
    // gesture — it would pop in mid-read. Anything further down rides the
    // scroll gate, so the chunk stays off the critical path on load.
    // `defer` is for a scope whose position says nothing about when it
    // animates — a viewport-fixed control, say, which sits at the top of the
    // box model but only reveals far down the page.
    const box = scopeRef.current.getBoundingClientRect();
    const near =
      !defer && box.top < window.innerHeight * 1.5 && box.bottom > 0;

    loadMotion({ now: near })
      .then((lib) => {
        const scope = scopeRef.current;
        if (cancelled || !scope) return;
        ctx = lib.gsap.context(() => {
          mm = lib.gsap.matchMedia(scope);
          build({ ...lib, mm, scope });
        }, scope);
        // Positions were computed against the layout at mount; the route just
        // changed and scrolled to top, so measure once more now it has settled.
        lib.ScrollTrigger.refresh();
        refreshAfterImages(lib.ScrollTrigger, scope, aborter.signal);
        // The chunk usually lands before the self-hosted display font does;
        // triggers measured against the fallback face are off by every
        // heading's reflow. Measure again once the fonts are in.
        if (document.fonts?.ready) {
          document.fonts.ready.then(() => {
            if (!cancelled) lib.ScrollTrigger.refresh();
          });
        }
        // useReveal's wrappers sit 28px low until their reveal fires and its
        // 900ms transition ends; a trigger measured through one of them is
        // off by that much. Measure once more after they have settled.
        settle = setTimeout(() => {
          if (!cancelled) lib.ScrollTrigger.refresh();
        }, 1300);
      })
      .catch(() => {
        /* No chunk, no animation — the page is already in its resting state. */
      });

    return () => {
      cancelled = true;
      clearTimeout(settle);
      aborter.abort();
      mm?.revert();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* A `once` ScrollTrigger created when the page is already scrolled past its
   end (fast scroll on a slow connection, before the chunk arrived) resolves
   its toggle action to "none" and would leave a from() tween sitting at its
   hidden start. Jump such a timeline straight to its resting state. */
export function settleIfPassed(tl) {
  const st = tl.scrollTrigger;
  if (st && st.progress >= 1) tl.progress(1);
}
