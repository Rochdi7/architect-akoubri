/* A very small tween runner for the scene. GSAP is already in the project,
   but it lives in the lazily loaded motion chunk; the 3D chunk only needs
   a handful of eased numbers, so it carries its own thirty lines instead of
   coupling the two lazy bundles together. */

export const ease = {
  linear: (t) => t,
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 - (1 - t) ** 3,
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  outQuint: (t) => 1 - (1 - t) ** 5,
  outExpo: (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
};

export function createTweener() {
  let list = [];

  return {
    /** Tween a number from `from` to `to`; `onUpdate(value, eased)` per frame. */
    to({ from, to, duration, delay = 0, ease: fn = ease.outQuint, onUpdate, onComplete }) {
      const tw = { t: 0, from, to, duration, delay, fn, onUpdate, onComplete, dead: false };
      list.push(tw);
      return tw;
    },

    /** Run `fn` once after `delay` seconds. */
    after(delay, fn) {
      const tw = { t: 0, from: 0, to: 1, duration: 0, delay, fn: ease.linear, onUpdate: null, onComplete: fn, dead: false };
      list.push(tw);
      return tw;
    },

    /** Advance all tweens; returns true while anything is still running. */
    update(dt) {
      if (!list.length) return false;
      for (const tw of list) {
        if (tw.dead) continue;
        tw.t += dt;
        let raw;
        if (tw.duration > 0) raw = (tw.t - tw.delay) / tw.duration;
        else raw = tw.t >= tw.delay ? 1 : -1;
        if (raw < 0) continue;
        const u = raw >= 1 ? 1 : raw;
        const e = tw.fn(u);
        if (tw.onUpdate) tw.onUpdate(tw.from + (tw.to - tw.from) * e, e);
        if (raw >= 1) {
          tw.dead = true;
          if (tw.onComplete) tw.onComplete();
        }
      }
      list = list.filter((tw) => !tw.dead);
      return list.length > 0;
    },

    kill(tw) {
      if (tw) tw.dead = true;
    },

    killAll() {
      list.forEach((tw) => {
        tw.dead = true;
      });
      list = [];
    },

    get active() {
      return list.length > 0;
    },
  };
}
