import { useId } from 'react';

/**
 * Akoubri logo mark — the interlocked A of the Akoubri Architecture & Design
 * identity: a copper A whose right stroke is replaced by a striped navy band
 * that peels away from a solid navy leg.
 *
 * The source of truth is public/brand/akoubri-architecture-logo-mark-animated.svg;
 * it is inlined here rather than loaded through <img> because SMIL inside an
 * <img> only runs in some engines, and an inline tree lets the mark inherit the
 * page's currentColor-free palette without a second network request.
 *
 * Every mask and clipPath id is namespaced with useId(): the Header and the
 * Footer both mount this, and duplicate SVG ids in one document make the second
 * instance resolve its masks against the first one's — which renders it blank.
 *
 * The five reveals share ONE 5s repeatCount="indefinite" timeline rather than
 * each carrying its own begin/dur: on separate timelines they would drift out of
 * phase over a long session, and the stripes would start appearing before the
 * band that carries them. Each keeps its original stagger and easing, encoded as
 * keyTimes fractions of the 5s cycle, then holds drawn until the cycle restarts.
 *
 * Under prefers-reduced-motion the CSS in index.css pins every reveal to its end
 * state, so the mark is drawn complete rather than looping or never appearing.
 */
export default function AkoubriMark({ size = 30, className = '', title = 'Akoubri Architecture & Design' }) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="240 262 480 384"
      width={size}
      height={(size * 384) / 480}
      className={`akoubri-mark ${className}`}
      role="img"
      aria-label={title}
    >
      <defs>
          <clipPath id={`${uid}-akCopperCut`} clipPathUnits="userSpaceOnUse">
            <path d="M0 0 L638.3 0 L638.3 276 C596 335, 545 411, 513 448 C490 476, 445 505, 394 533 L394 1000 L0 1000 Z"/>
          </clipPath>
          <mask id={`${uid}-akRevealA`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
            <path d="M255 700 L467 255 L560 460" fill="none" stroke="#fff" strokeWidth="210"
                  strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10"
                  strokeDasharray="720" strokeDashoffset="720">
              <animate attributeName="stroke-dashoffset" values="720;720;0;0" keyTimes="0;0.07;0.24;1"
                       dur="5s" repeatCount="indefinite"
                       calcMode="spline" keySplines="0 0 1 1; 0.16 1 0.3 1; 0 0 1 1"/>
            </path>
          </mask>
          <mask id={`${uid}-akRevealBand`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
            <path d="M675.4 238 L675.4 276 C634 335, 581.5 411.5, 552.5 448 C530 476, 462.5 506.5, 394 533 L345 547"
                  fill="none" stroke="#fff" strokeWidth="230" strokeLinecap="butt"
                  strokeDasharray="490" strokeDashoffset="490">
              <animate attributeName="stroke-dashoffset" values="490;490;0;0" keyTimes="0;0.15;0.29;1"
                       dur="5s" repeatCount="indefinite"
                       calcMode="spline" keySplines="0 0 1 1; 0.22 1 0.36 1; 0 0 1 1"/>
            </path>
          </mask>
          <mask id={`${uid}-akRevealLeg`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
            <path d="M530 410 L690 700" fill="none" stroke="#fff" strokeWidth="200" strokeLinecap="butt"
                  strokeDasharray="340" strokeDashoffset="340">
              <animate attributeName="stroke-dashoffset" values="340;340;0;0" keyTimes="0;0.21;0.31;1"
                       dur="5s" repeatCount="indefinite"
                       calcMode="spline" keySplines="0 0 1 1; 0.22 1 0.36 1; 0 0 1 1"/>
            </path>
          </mask>
          {/* transparent stripes: cut through the band, not painted white */}
          <mask id={`${uid}-akBandHoles`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
            <path d="M638.3 276 C596 335, 545 411, 513 448 C490 476, 445 505, 394 533 C480 508, 570 476, 592 448 C618 412, 672 335, 712.5 276 Z" fill="#fff"/>
            <g fill="none" stroke="#000" strokeWidth="2.2" opacity="0">
              <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.27;0.37;1" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1; 0.33 0 0.15 1; 0 0 1 1"/>
              <path d="M645.7 276 C603.6 335, 552.3 411.1, 520.9 448 C498.0 476, 448.5 505.3, 409 526"/>
              <path d="M653.1 276 C611.2 335, 559.6 411.2, 528.8 448 C506.0 476, 452.0 505.6, 409 526"/>
              <path d="M660.6 276 C618.8 335, 566.9 411.3, 536.7 448 C514.0 476, 455.5 505.9, 409 526"/>
              <path d="M668.0 276 C626.4 335, 574.2 411.4, 544.6 448 C522.0 476, 459.0 506.2, 409 526"/>
              <path d="M675.4 276 C634.0 335, 581.5 411.5, 552.5 448 C530.0 476, 462.5 506.5, 409 526"/>
              <path d="M682.8 276 C641.6 335, 588.8 411.6, 560.4 448 C538.0 476, 466.0 506.8, 409 526"/>
              <path d="M690.2 276 C649.2 335, 596.1 411.7, 568.3 448 C546.0 476, 469.5 507.1, 409 526"/>
              <path d="M697.7 276 C656.8 335, 603.4 411.8, 576.2 448 C554.0 476, 473.0 507.4, 409 526"/>
              <path d="M705.1 276 C664.4 335, 610.7 411.9, 584.1 448 C562.0 476, 476.5 507.7, 409 526"/>
            </g>
          </mask>
          {/* transparent keyline: 3-unit gap cut from leg and copper along the band edge */}
          <mask id={`${uid}-akKeyline`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
            <rect width="1000" height="1000" fill="#fff"/>
            <path d="M638.3 276 C596 335, 545 411, 513 448 C490 476, 445 505, 394 533 C480 508, 570 476, 592 448 C618 412, 672 335, 712.5 276 Z" fill="none" stroke="#000" strokeWidth="6" strokeLinejoin="round"/>
            <g fill="none" stroke="#000" strokeWidth="2.2" opacity="0">
              <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.27;0.37;1" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1; 0.33 0 0.15 1; 0 0 1 1"/>
              <path d="M645.7 276 C603.6 335, 552.3 411.1, 520.9 448 C498.0 476, 448.5 505.3, 409 526"/>
              <path d="M653.1 276 C611.2 335, 559.6 411.2, 528.8 448 C506.0 476, 452.0 505.6, 409 526"/>
              <path d="M660.6 276 C618.8 335, 566.9 411.3, 536.7 448 C514.0 476, 455.5 505.9, 409 526"/>
              <path d="M668.0 276 C626.4 335, 574.2 411.4, 544.6 448 C522.0 476, 459.0 506.2, 409 526"/>
              <path d="M675.4 276 C634.0 335, 581.5 411.5, 552.5 448 C530.0 476, 462.5 506.5, 409 526"/>
              <path d="M682.8 276 C641.6 335, 588.8 411.6, 560.4 448 C538.0 476, 466.0 506.8, 409 526"/>
              <path d="M690.2 276 C649.2 335, 596.1 411.7, 568.3 448 C546.0 476, 469.5 507.1, 409 526"/>
              <path d="M697.7 276 C656.8 335, 603.4 411.8, 576.2 448 C554.0 476, 473.0 507.4, 409 526"/>
              <path d="M705.1 276 C664.4 335, 610.7 411.9, 584.1 448 C562.0 476, 476.5 507.7, 409 526"/>
            </g>
          </mask>
        </defs>
                {/* COPPER A */}
        <g mask={`url(#${uid}-akRevealA)`}>
          <g mask={`url(#${uid}-akKeyline)`}><g clipPath={`url(#${uid}-akCopperCut)`}>
            <path d="M445.5 274.6 L489.5 274.6 L616 500 L535 500 L467.8 373.7 L323.5 634.7 L249.3 634.7 Z" fill="#c58b66"/>
          </g></g>
        </g>
        {/* SOLID NAVY LEG (sits UNDER the band; stripes run across it) */}
        <g mask={`url(#${uid}-akRevealLeg)`}>
          <g mask={`url(#${uid}-akKeyline)`}><path d="M513.2 450 L591.3 450 L692.9 634.7 L614.8 634.7 Z" fill="#0f243e"/></g>
        </g>
        {/* STRIPED BAND */}
        <g mask={`url(#${uid}-akRevealBand)`}>
          <g mask={`url(#${uid}-akBandHoles)`}><path d="M638.3 276 C596 335, 545 411, 513 448 C490 476, 445 505, 394 533 C480 508, 570 476, 592 448 C618 412, 672 335, 712.5 276 Z" fill="#0f243e"/></g>
        </g>
    </svg>
  );
}
