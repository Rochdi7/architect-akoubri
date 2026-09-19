/* Theme store — light ("jour") and dark ("nuit").

   The theme lives on <html data-theme>, not in React state. index.html sets
   it before first paint (so a night reader never sees a cream flash), every
   colour on the site is a CSS token that answers to that attribute, and the
   toggle's own artwork is styled from it too. React only needs to know the
   value for aria-checked, which is what `subscribe` is for.

   With no stored choice the site follows the OS setting and keeps following
   it; the first click on the toggle is what pins a preference. */

const KEY = 'akoubri-theme';
const GROUND = { light: '#faf8f5', dark: '#0d1522' };
const listeners = new Set();

const root = () => document.documentElement;

export function getTheme() {
  return root().dataset.theme === 'dark' ? 'dark' : 'light';
}

function stored() {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'dark' || v === 'light' ? v : null;
  } catch {
    return null;
  }
}

/* The one place the attribute changes. Listeners run synchronously, inside
   the view-transition callback, so anything that caches a computed colour
   (the ink-fill headings) has repainted before the new frame is captured. */
function paint(theme) {
  root().dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', GROUND[theme]);
  listeners.forEach((fn) => fn(theme));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* Switch theme. Given the toggle's position, the new theme is revealed as a
   circle growing out of it (View Transitions API): the browser holds a
   snapshot of the old page and clips the new one open over it, so nothing
   on the page has to transition its own colours — GSAP scenes, marquees and
   the hero film carry on untouched underneath.

   Without the API, or under prefers-reduced-motion, the swap is immediate
   apart from a short colour cross-fade (the .theme-fade class). */
export function setTheme(theme, origin) {
  try { localStorage.setItem(KEY, theme); } catch { /* private mode */ }
  if (theme === getTheme()) return;

  const el = root();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    paint(theme);
    return;
  }

  if (!document.startViewTransition || !origin) {
    el.classList.add('theme-fade');
    paint(theme);
    window.setTimeout(() => el.classList.remove('theme-fade'), 520);
    return;
  }

  const { x, y } = origin;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  el.style.setProperty('--theme-x', `${x}px`);
  el.style.setProperty('--theme-y', `${y}px`);
  el.style.setProperty('--theme-r', `${Math.ceil(radius)}px`);
  el.classList.add('theme-reveal');

  const transition = document.startViewTransition(() => paint(theme));
  transition.finished.finally(() => el.classList.remove('theme-reveal'));
}

export function toggleTheme(origin) {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark', origin);
}

/* Follow the OS while the reader has not chosen for themselves. */
if (typeof window !== 'undefined' && window.matchMedia) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const follow = (e) => { if (!stored()) paint(e.matches ? 'dark' : 'light'); };
  if (mq.addEventListener) mq.addEventListener('change', follow);
}
