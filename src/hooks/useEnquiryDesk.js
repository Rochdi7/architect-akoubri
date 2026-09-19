import { useRef } from 'react';
import { CONDITIONS, replayOnScroll, useGsapScene } from '../lib/motion';

/* VI. Le bureau — the enquiry band that closes every page.

   Two moves that share one section and never touch each other's nodes.

   The flanking project cards are dealt onto the page like prints tossed
   onto a desk: each arrives from further out in its own corner, deeper in
   Z and over-rotated, then settles onto the tilt the markup already gives
   it. Afterwards they keep drifting — a slow scrub against scroll, each
   card at its own rate — so the margins are never quite still while the
   reader is filling the form. The drift is what turns four static
   decorations into a scene with air in it.

   The form writes itself in below: each field lifts a few px while its
   underline rule draws across from the left, staggered down the column,
   and the submit button arrives last. The rule is the point — the fields
   are bottom-ruled at rest (.zv-field), so drawing that 1px line is the
   band's own idiom rather than a generic fade.

   Nothing here is load-bearing. The cards are already aria-hidden
   decoration; the form is fully usable from the first paint, and every
   inline style is cleared on completion so the band rests exactly as
   rendered. A reader who starts typing mid-entrance is never interrupted:
   the tween touches transform and opacity only, and the scrub drift runs
   on the cards, which sit behind the form with pointer-events: none.

   Markup contract (GetInTouch.jsx):
     [ref]            the <section> — the scope
       .m3-card       each decorative <figure> in the margins
       .m3-desk       the form column wrapper
         .m3-line     one per field row: the drawn rule
         .m3-row      the field itself (label + control)
         .m3-send     the submit button                                   */

/* Where each card is dealt from, clockwise from top-left. Signs follow the
   corner so every card travels outward-to-inward, and the over-rotation is
   opposite the resting tilt so it unwinds into place. */
const DEAL = [
  { x: -90, y: -40, rotate: -10 },
  { x: 90, y: -40, rotate: 10 },
  { x: -90, y: 40, rotate: 8 },
  { x: 90, y: 40, rotate: -8 },
];

/* px each card drifts across the section's whole passage through the
   viewport. Alternating sign makes the pairs counter-move, which reads as
   depth; the outer cards travel further than the inner ones. */
const DRIFT = [-64, 52, -44, 68];

const DEPTH = { desktop: -420, phone: -240 };
const LIFT = { desktop: 26, phone: 18 };

function build({ gsap, ScrollTrigger, mm, scope, ease }) {
  const cards = gsap.utils.toArray('.m3-card', scope);
  const desk = scope.querySelector('.m3-desk');
  const rows = gsap.utils.toArray('.m3-row', scope);
  const lines = gsap.utils.toArray('.m3-line', scope);
  const send = scope.querySelector('.m3-send');

  mm.add(CONDITIONS, ({ conditions: { motion, desktop } }) => {
    if (!motion) return;

    const depth = desktop ? DEPTH.desktop : DEPTH.phone;
    const lift = desktop ? LIFT.desktop : LIFT.phone;

    /* ── The cards ──────────────────────────────────────────────────── */
    if (cards.length) {
      const dealt = gsap.timeline({
        paused: true,
        defaults: { ease, duration: 1.2 },
        onStart: () => gsap.set(cards, { willChange: 'transform, opacity' }),
        // The resting tilt lives in a Tailwind rotate utility, so transform
        // must be cleared rather than zeroed — and transformOrigin with it,
        // which GSAP would otherwise leave behind resolved to px.
        onComplete: () =>
          gsap.set(cards, { clearProps: 'transform,transformOrigin,opacity,willChange' }),
      });

      cards.forEach((card, i) => {
        const from = DEAL[i % DEAL.length];
        dealt.from(
          card,
          { ...from, z: depth, opacity: 0, transformOrigin: '50% 50%' },
          i * 0.09
        );
      });

      replayOnScroll({ ScrollTrigger, animation: dealt, trigger: scope });

      /* The drift is a separate, scrubbed tween — it must keep running after
         the entrance has cleared its props, and it owns only `yPercent`, a
         property neither the deal nor the markup's tilt writes. Kept off the
         entrance timeline so replaying one never rewinds the other. */
      cards.forEach((card, i) => {
        gsap.to(card, {
          yPercent: (DRIFT[i % DRIFT.length] / card.offsetHeight) * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: scope,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        });
      });
    }

    /* ── The form ───────────────────────────────────────────────────── */
    if (!desk) return;

    const writing = gsap.timeline({
      paused: true,
      defaults: { ease, duration: 0.9 },
      onStart: () => gsap.set([...rows, ...lines], { willChange: 'transform, opacity' }),
      onComplete: () =>
        gsap.set([...rows, ...lines, send].filter(Boolean), {
          clearProps: 'transform,opacity,willChange,scaleX,transformOrigin',
        }),
    });

    if (rows.length) {
      writing.from(rows, { y: lift, opacity: 0, stagger: 0.1 }, 0);
    }

    /* Each rule is drawn from its left edge, a beat behind its own field,
       then fades as it lands — the ink sinks into the paper and leaves the
       field's resting border. The element is transparent in CSS, so the
       clearProps at the end puts it back exactly where it started. */
    if (lines.length) {
      writing.fromTo(
        lines,
        { scaleX: 0, opacity: 1, transformOrigin: '0% 50%' },
        { scaleX: 1, duration: 1, stagger: 0.1 },
        0.12
      );
      writing.to(lines, { opacity: 0, duration: 0.5, stagger: 0.1 }, 0.72);
    }

    if (send) {
      writing.from(send, { y: lift, opacity: 0, duration: 0.8 }, '-=0.5');
    }

    replayOnScroll({ ScrollTrigger, animation: writing, trigger: desk, start: 'top 85%' });
  });
}

export function useEnquiryDesk() {
  const ref = useRef(null);
  useGsapScene(ref, build);
  return ref;
}
