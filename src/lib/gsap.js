/* The motion layer's single lazy chunk.

   Only ever reached through the dynamic import() in motion.js, so GSAP never
   enters the initial bundle. Plugins are registered here, once, at module
   evaluation — the one place that is guaranteed to run exactly one time. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Mobile browsers fire `resize` when the address bar collapses mid-scroll;
// recomputing every trigger for that is wasted work on the target device.
ScrollTrigger.config({ ignoreMobileResize: true });

// --ease-arch from the stylesheet (cubic-bezier(0.22, 1, 0.36, 1)) as a GSAP
// ease, so a GSAP-driven move settles the way a CSS-driven one does. CustomEase
// ships in the free package since 3.13; the fallback is the nearest built-in.
let ease = 'power3.out';
try {
  CustomEase.create('arch', '0.22,1,0.36,1');
  ease = 'arch';
} catch {
  /* keep the approximation */
}

export { gsap, ScrollTrigger, ease };
