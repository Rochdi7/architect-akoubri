/**
 * Client logos — the "ils nous ont fait confiance" band on Home, directly
 * under the hero. It replaced the disciplines strip ("Quatre métiers, un
 * seul interlocuteur"), which the owner removed on 2026-09-19.
 *
 * ── Where these marks come from ───────────────────────────────────────────
 * Three of the eight projects carry a real, visible brand in their renders,
 * and those three are redrawn here as vector rather than cropped out of the
 * image:
 *
 *   · ADOSTIGIA  — the triangular A over the wordmark, copper on the
 *                  backlit dark-marble reception panel
 *                  (akoubri_adostigia-accueil-enseigne-relief-marbre-01.webp, -accueil-banque-monolithique-02.webp).
 *   · FARAJ      — the olive tree over the wordmark, on the totems at the
 *                  administration entrance and the shop/mosque block
 *                  (akoubri_farraj-administration-entree-01.webp, -magasin-mosquee-07.webp).
 *   · ZAHIYA     — the backlit ZAHIYA / RESIDENCE lettering on the dark
 *                  entrance pier (akoubri_zahiya-entree-enseigne-crepuscule-01.webp).
 *
 * The crops themselves are unusable as logos: the sources top out at
 * 1280–1600px wide, so each mark is only ~100–270px across and arrives with
 * its own marble, paper or timber background baked in. Redrawn as SVG they
 * stay sharp at any size, take one flat colour, and sit on the cream band
 * without a stray backdrop.
 *
 * The remaining five projects are private commissions with no brand mark
 * anywhere in their images. Inventing a logo for them would be inventing a
 * client identity, so they render as plain wordmarks in the site's own
 * display face — which is what they actually are: project names.
 *
 * Every id is namespaced with useId(): the strip mounts each logo four times
 * (the track is repeated for a seamless loop) and duplicate SVG ids in one
 * document make the later instances resolve against the first.
 */
import { useId } from 'react';

/* ── The three real marks ──────────────────────────────────────────────── */

/* ADOSTIGIA: an outlined triangle whose inner void is a second, smaller
   triangle, with a tail that sweeps out of the lower-left foot. Drawn with
   even-odd fill so the counter stays open at any size. */
function Adostigia() {
  return (
    <span className="zv-logo-lockup">
      <svg viewBox="0 0 64 56" className="zv-logo-glyph" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M32 2 L62 54 H48.5 L32 25 L20.5 45 H33 L39 54 H2 Z
             M32 33.5 L38.5 45 H25.5 Z"
        />
      </svg>
      <span className="zv-logo-word">Adostigia</span>
    </span>
  );
}

/* FARAJ: an olive crown over the wordmark. The canopy is a scatter of short
   strokes on a radial spray of branches rather than a solid blob — at strip
   size a filled circle would read as a dot, and the tree is the whole point
   of the mark. */
function Faraj() {
  return (
    <span className="zv-logo-lockup zv-logo-lockup--stacked">
      {/* The viewBox carries 2px of slack under the trunk: its round cap
          would otherwise be shaved by the edge. */}
      <svg viewBox="0 0 56 48" className="zv-logo-glyph zv-logo-glyph--tree" aria-hidden="true">
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {/* trunk and the branches fanning out of it */}
          <path d="M28 45 V24" strokeWidth="2.2" />
          <path d="M28 27 C22 23, 17 19, 13 14" />
          <path d="M28 27 C34 23, 39 19, 43 14" />
          <path d="M28 24 C25 18, 23 14, 21 9" />
          <path d="M28 24 C31 18, 33 14, 35 9" />
          <path d="M28 22 V7" />
          {/* the canopy: short strokes seeded along the branch ends */}
          <g strokeWidth="1.3">
            <path d="M12 15 l-3 -3 M14 11 l-2 -4 M18 8 l-2 -4 M23 5 l-1 -4 M28 3 l0 -3 M33 5 l1 -4 M38 8 l2 -4 M42 11 l2 -4 M44 15 l3 -3" />
            <path d="M16 17 l-4 -1 M21 12 l-3 -2 M26 8 l-2 -3 M31 8 l2 -3 M36 12 l3 -2 M40 17 l4 -1" />
            <path d="M19 20 l-4 1 M24 15 l-3 1 M33 15 l3 1 M38 20 l4 1" />
          </g>
        </g>
      </svg>
      <span className="zv-logo-word">Faraj</span>
    </span>
  );
}

/* ZAHIYA: pure lettering on the building — no glyph. The two lines keep the
   render's relationship: a large name over a widely-tracked qualifier. */
function Zahiya() {
  return (
    <span className="zv-logo-lockup zv-logo-lockup--stacked zv-logo-lockup--tight">
      <span className="zv-logo-word">Zahiya</span>
      <span className="zv-logo-sub">Residence</span>
    </span>
  );
}

/* ── The five unbranded projects ───────────────────────────────────────── */

function Wordmark({ name, sub }) {
  return (
    <span
      className={`zv-logo-lockup${sub ? ' zv-logo-lockup--stacked zv-logo-lockup--tight' : ''}`}
    >
      <span className="zv-logo-word">{name}</span>
      {sub ? <span className="zv-logo-sub">{sub}</span> : null}
    </span>
  );
}

/* Order alternates the drawn marks with the wordmarks so the strip never
   shows three plain names in a row. */
const LOGOS = [
  { key: 'adostigia', label: 'Adostigia', node: <Adostigia /> },
  { key: 'le-sentier', label: 'Le Sentier', node: <Wordmark name="Le Sentier" sub="Résidence" /> },
  { key: 'faraj', label: 'Faraj', node: <Faraj /> },
  { key: 'villa-jumelee', label: 'Villa Jumelée', node: <Wordmark name="Villa Jumelée" /> },
  { key: 'zahiya', label: 'Zahiya Residence', node: <Zahiya /> },
  { key: 'maison-dhote', label: "Maison d'hôtes", node: <Wordmark name="Maison d'hôtes" /> },
];

export default function ClientLogos() {
  const uid = useId().replace(/:/g, '');

  return (
    <section className="zv zv-clients" aria-labelledby={`${uid}-clients`}>
      {/* ── The heading, drawn as a dimension line ──────────────────────
          This is an architecture studio, so the label is annotated the way
          a drawing annotates a measure: a witness tick standing at each
          end, the dimension line running between them, and the text
          sitting in a break in that line — exactly how a plan calls out a
          span. It beats a generic arrow-and-rule because it comes from the
          client's own drawing language.

          All of it is decorative except the words, so the ticks and rules
          are aria-hidden and the <p> alone names the section. */}
      <div className="shell">
        <p id={`${uid}-clients`} data-reveal className="reveal zv-clients-label">
          <span className="zv-dim zv-dim--start" aria-hidden="true">
            <span className="zv-dim-tick" />
            <span className="zv-dim-line" />
          </span>

          <span className="zv-clients-label-text">Ils nous ont fait confiance</span>

          <span className="zv-dim zv-dim--end" aria-hidden="true">
            <span className="zv-dim-line" />
            <span className="zv-dim-tick" />
          </span>
        </p>
      </div>

      {/* The set is rendered four times. Six marks are not wide enough to
          fill a desktop row, so a single copy would drag a long empty gap
          across the band before coming round again; four copies keep the
          belt continuously populated at any width. The keyframe shifts by
          exactly one copy (-25%), landing on the identical mark, so the
          restart is invisible.

          Only the first copy is read out: a screen reader should hear the
          six clients once, not twenty-four. */}
      <div data-reveal data-reveal-delay="80" className="reveal zv-clients-rail">
        <div className="zv-clients-track">
          {[0, 1, 2, 3].map((copy) => (
            <ul
              key={copy}
              className={`zv-clients-set${copy > 0 ? ' zv-clients-set--clone' : ''}`}
              aria-hidden={copy > 0 ? 'true' : undefined}
            >
              {LOGOS.map((logo) => (
                <li key={logo.key} className="zv-client" title={logo.label}>
                  {logo.node}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
