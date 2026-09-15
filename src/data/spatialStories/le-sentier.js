import { box, wall, mass, slab, glazing, water, paving, columns, fins, openings, steps, rail, strip, group } from './helpers';

/* 01 · Le Sentier — Résidence, Marrakech.

   A corner block: commerce behind full-height glazing under a dark metal
   canopy, three residential floors, a flat roof with a pool. The signature
   move is the central bay, a stack of thick light-concrete frames, one per
   floor, each holding a two-metre loggia with dark glazing behind a thin
   rail. The frames are offset left and right from floor to floor so the
   façade is a series of planes. The flanking wings are earth-tinted render
   with punched windows and slim balconies.

   Modelled from the façade renders (11.56.*) and the rooftop aerials
   (Rooftop PDF, pages 7–9). Palms and roof planting are not modelled.

   Plot: 28 × 18 m, street to +z. Ground floor 4.2 m, floors 3.2 m,
   roof at 13.8 m.                                                          */

const GF = 4.2;
const FH = 3.2;
const ROOF = GF + 3 * FH; // 13.8

/** Places to stand: marker position, eye, and what the eye looks at. */
export const leSentierViews = [
  { id: 'entree', label: "L'entrée", at: [0.2, 1.9, 13.4], eye: [0.6, 1.7, 15.8], look: [0, 2.8, 9.4] },
  { id: 'loggia', label: 'La loggia', at: [1.5, GF + FH + 1.6, 9.1], eye: [-1.8, GF + FH + 2.1, 8.4], look: [9, GF + FH - 1.0, 20] },
  { id: 'toit', label: 'Le toit-terrasse', at: [-4, ROOF + 2.0, 1.2], eye: [-1.2, ROOF + 2.3, -1.6], look: [-7.5, ROOF + 0.2, 6.5] },
];

export function leSentier() {
  const leftWing = wall(-14, GF, -9, 9, 3 * FH, 18); // x -14..-5
  const rightWing = wall(6, GF, -9, 8, 3 * FH, 18); // x 6..14
  const core = wall(-5, GF, -9, 11, 3 * FH, 16.9); // x -5..6, face at z 7.9
  const shell = wall(-14, 0, -9, 28, GF, 16); // solid ground floor, z -9..7

  const out = [
    /* ── Ground floor: commerce set back two metres under the wings ── */
    mass(shell, 'earth'),
    group([box(-13.6, 0.1, 7, 27.2, GF - 0.2, 1.6, 'dark', { e: false })]), // shop interiors, in shadow
    glazing(-13.6, 0.1, 8.55, 27.2, GF - 0.3, 0.3),
    fins(-13.6, 8.7, 13.6, 8.7, 14, 0.1, GF - 0.3, 0.08, 0.36, 'metal', { fine: true }), // mullions
    slab(-14.3, GF - 0.35, 6.9, 28.6, 0.35, 3.5, 'metal'), // the dark canopy, 1.4 m proud of the wings

    /* ── Entrance: dark canopy, two stone piers with brass strips, a light
          signage plane and a line of light ── */
    paving(-3.2, 9, 6.4, 3.0, 'paving', 0.16),
    steps(-2.8, 12, 5.6, 2, 0.16, 0.36),
    group([box(-1.3, 0.1, 8.5, 2.6, 3.1, 1.2, 'dark', { e: false })]), // the entrance hall, in shadow
    group([
      box(-1.9, 0, 9.8, 0.6, 3.2, 0.7, 'concrete'),
      box(1.3, 0, 9.8, 0.6, 3.2, 0.7, 'concrete'),
      box(-1.28, 0.05, 10.52, 0.03, 3.1, 0.03, 'brass', { fine: true, e: false }),
      box(1.25, 0.05, 10.52, 0.03, 3.1, 0.03, 'brass', { fine: true, e: false }),
    ]),
    slab(-3.2, 3.2, 9, 6.4, 0.3, 2.9, 'metal'), // entrance canopy to z 11.9
    group([box(-2.2, 3.5, 11.5, 4.4, 0.55, 0.06, 'plaster')], { anim: 'grow' }), // signage plane
    strip(-3.2, 11.92, 3.2, 11.92, 3.13, 'light', { h: 0.04, t: 0.06 }),

    /* ── The wings ── */
    mass(leftWing, 'earth'),
    mass(rightWing, 'earth'),
    mass(core, 'earth'),
    group([box(-5, GF, 7.9, 11, 3 * FH, 0.1, 'dark', { e: false })]), // the loggias' dark back
  ];

  /* ── Wing windows and balconies, three floors ── */
  const leftWin = [];
  const rightWin = [];
  const sideRight = [];
  const sideLeft = [];
  const leftBalc = [];
  const rightBalc = [];
  const leftRails = [];
  const rightRails = [];
  for (let k = 0; k < 3; k += 1) {
    const v = k * FH + 0.5;
    const y = GF + k * FH;
    leftWin.push([1.0, v, 1.4, 2.2], [4.0, v, 1.6, 2.2]);
    rightWin.push([1.0, v, 1.6, 2.2], [4.6, v, 1.4, 2.2]);
    sideRight.push([2.0, v, 1.4, 2.0], [8.0, v, 1.4, 2.0], [14.0, v, 1.4, 2.0]);
    sideLeft.push([3.0, v, 1.4, 2.0], [10.0, v, 1.4, 2.0]);
    // Slim balconies with a light strip under the edge.
    leftBalc.push(box(-13.2, y, 9, 3.0, 0.22, 1.1, 'earth'));
    leftBalc.push(box(-13.2, y - 0.04, 10.04, 3.0, 0.04, 0.05, 'brass', { fine: true, e: false }));
    rightBalc.push(box(9.4, y, 9, 3.0, 0.22, 1.1, 'earth'));
    rightBalc.push(box(9.4, y - 0.04, 10.04, 3.0, 0.04, 0.05, 'brass', { fine: true, e: false }));
    leftRails.push(box(-13.2, y + 0.22, 10.06, 3.0, 1.0, 0.04, 'metal', { e: false }));
    rightRails.push(box(9.4, y + 0.22, 10.06, 3.0, 1.0, 0.04, 'metal', { e: false }));
  }
  out.push(
    openings('front', leftWing, leftWin),
    openings('front', rightWing, rightWin),
    openings('right', rightWing, sideRight),
    openings('left', leftWing, sideLeft),
    group(leftBalc, { anim: 'drop' }),
    group(rightBalc, { anim: 'drop' }),
    group(leftRails, { fine: true }),
    group(rightRails, { fine: true })
  );

  /* ── The stacked frames: thick light-concrete boxes, one per floor,
        offset left/right, each two metres deep with dark glazing at the
        back and a thin rail at the front ── */
  const spans = [
    [-6.0, 4.6],
    [-3.8, 6.8],
    [-6.2, 4.4],
  ];
  spans.forEach(([x0, x1], k) => {
    const y = GF + k * FH;
    const w = x1 - x0;
    out.push(
      group(
        [
          box(x0, y, 8, w, 0.45, 2.0, 'concrete'), // floor of the frame
          box(x0, y + FH - 0.35, 8, w, 0.35, 2.0, 'concrete'), // head
          box(x0, y, 8, 0.5, FH, 2.0, 'concrete'), // cheeks
          box(x1 - 0.5, y, 8, 0.5, FH, 2.0, 'concrete'),
        ],
        { anim: 'drop' }
      ),
      glazing(Math.max(x0 + 0.5, -4.9), y + 0.45, 8.0, Math.min(x1 - 0.5, 5.9) - Math.max(x0 + 0.5, -4.9), FH - 0.8, 0.06, { fine: true }),
      rail(x0 + 0.5, 9.9, x1 - 0.5, 9.9, y + 0.45, 1.0, 'glass') // a glass rail: one can stand behind it
    );
  });

  /* ── Roof: the terrace the scroll sets down ── */
  const p2 = { phase: 2 };
  out.push(
    slab(-14.3, ROOF, -9.3, 28.6, 0.3, 18.6, 'paving', p2),
    group(
      [
        box(-14.3, ROOF + 0.3, 8.7, 28.6, 0.9, 0.6, 'earth'),
        box(-14.3, ROOF + 0.3, -9.3, 28.6, 0.9, 0.6, 'earth'),
        box(-14.3, ROOF + 0.3, -8.7, 0.6, 0.9, 17.4, 'earth'),
        box(13.7, ROOF + 0.3, -8.7, 0.6, 0.9, 17.4, 'earth'),
      ],
      p2
    ),
    group([box(-13.7, ROOF + 0.3, 7.5, 27.4, 0.5, 1.2, 'concrete')], { ...p2, anim: 'grow' }), // planted parapet trough
    mass(wall(9, ROOF + 0.3, -8.7, 4.6, 2.6, 5), 'earth', p2), // stair and lift head
    group([box(-11.2, ROOF + 0.3, 3.8, 13.4, 0.45, 3.7, 'concrete')], { ...p2, anim: 'grow' }), // pool basin
    water(-11, 4.0, 13, 3.3, { top: ROOF + 0.7, ...p2 }),
    paving(-11.2, 0.3, 13.4, 3.5, 'wood', 0.12, { y: ROOF + 0.3, ...p2 }), // timber deck
    paving(2.2, 3.8, 3.4, 3.7, 'wood', 0.12, { y: ROOF + 0.3, ...p2 }),
    mass(wall(4.4, ROOF + 0.3, -1.6, 5.4, 2.7, 4.4), 'dark', p2), // louvered bar box
    fins(4.4, 0.6, 9.8, 0.6, 8, ROOF + 3.0, 0.1, 0.08, 4.4, 'wood', { ...p2, fine: true }), // its louvers
    columns(-8.5, -3.2, -8.5, -3.2, 1, ROOF + 0.3, 3.4, 0.07, 'metal', p2), // sail-shade masts
    columns(-2.6, -5.4, -2.6, -5.4, 1, ROOF + 0.3, 3.4, 0.07, 'metal', p2),
    columns(1.2, -1.8, 1.2, -1.8, 1, ROOF + 0.3, 3.4, 0.07, 'metal', p2)
  );

  return out;
}
