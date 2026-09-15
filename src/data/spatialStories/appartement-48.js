import { box, paving, fins, openings, rail, group } from './helpers';

/* 05 · Le Sentier — Appartement témoin N°48, 4ᵉ étage (121,35 m²,
   terrasse 42,42 m²). Built from the floor plan, as a dollhouse cut: the
   slab, the walls to 1.4 m on the terrace side and full height at the
   back, no ceiling.

   Plan (metres, from the drawing), x to the right, terrace to +z:
     Salon 4.01 × 4.24 on the right; Cuisine 2.32 × 3.10 and SDB 1.40 × 3.10
     in the middle; Chambre 4.56 × 2.80 on the left; a corridor behind;
     a second Chambre 3.30 deep at the back-left with its SDB 1.77 × 2.02
     and a dressing; the wrap-around Terrasse 12.64 × 2.80 turning the
     corner for 7.83 m on the right.

   Materials from the renders: warm plaster, wood-panel TV wall, dark marble
   kitchen bar, wood floors in the bedrooms, micro-cement in the bathrooms,
   wood slat dressing (fine). Furniture: the L sofa, the beds and the
   kitchen run only. The terrace balustrade and the loggia frame above it
   (the same thick frame as chapter 01) are the phase-2 pieces.           */

const S = 0.3; // slab
const Y = S + 0.04; // finished floor
const H = 2.5; // wall height above the floor (full)
const CUT = 1.1; // wall height on the terrace side (≈ 1.4 m over the slab)
const PL = 'plaster';

// Walls are authored as plan rectangles: x, z, w, d, height.
const pw = (x, z, w, d, h = H, m = PL) => box(x, Y, z, w, h, d, m);

// Centre the plan on the plinth.
const dx = -6.45;
const dz = 3.3;
const v3 = ([x, y, z]) => [x + dx, y, z + dz];

/** Places to stand, in plan coordinates then centred like the pieces. */
export const appartement48Views = [
  { id: 'sejour', label: 'Le séjour', at: [11.0, Y + 1.5, -0.8], eye: [10.6, Y + 1.5, 0.3], look: [11.6, Y + 0.7, -4.3] },
  { id: 'terrasse', label: 'La terrasse', at: [1.5, Y + 1.5, 1.5], eye: [0.7, Y + 1.5, 1.3], look: [12.5, Y + 1.3, 2.6] },
  { id: 'chambre', label: 'La chambre', at: [3.9, Y + 1.5, -1.0], eye: [4.35, Y + 1.5, -0.7], look: [0.8, Y + 0.7, -3.0] },
].map((v) => ({ ...v, at: v3(v.at), eye: v3(v.eye), look: v3(v.look) }));

function build() {
  const p2 = { phase: 2 };
  const frontWall = { x: -0.2, y: Y, z: -0.2, w: 13.3, h: CUT, d: 0.2 };
  const list = [
    /* ── Slab: the apartment (an L) and the terrace ── */
    group([box(-0.2, 0, -5.9, 13.3, S, 5.9, 'concrete'), box(-0.2, 0, -10.4, 5.2, S, 4.5, 'concrete')]),
    group([box(-0.2, 0, 0, 13.3, S, 2.8, 'concrete'), box(5.06, 0, 2.8, 8.03, S, 0.9, 'concrete')], { anim: 'grow' }),

    /* ── Floors ── */
    paving(0, 0, 13.1, 2.8, 'paving', 0.04, { y: S }),
    paving(5.06, 2.8, 8.03, 0.9, 'paving', 0.04, { y: S }),
    paving(0.2, -3.2, 4.56, 3.0, 'wood', 0.04, { y: S }), // chambre 1
    paving(4.96, -3.3, 2.32, 3.1, 'marble', 0.04, { y: S }), // cuisine
    paving(7.38, -3.3, 1.4, 3.1, 'cement', 0.04, { y: S }), // sdb 1
    paving(8.88, -4.44, 4.01, 4.24, 'marble', 0.04, { y: S }), // salon
    paving(0.2, -4.44, 4.56, 1.04, 'marble', 0.04, { y: S }), // corridor
    paving(4.96, -5.5, 3.92, 2.2, 'marble', 0.04, { y: S }), // hall
    paving(8.88, -5.5, 4.01, 0.86, 'marble', 0.04, { y: S }), // entry
    paving(0.2, -6.66, 1.77, 2.02, 'cement', 0.04, { y: S }), // sdb 2
    paving(2.07, -6.66, 2.69, 2.02, 'wood', 0.04, { y: S }), // dressing and passage
    paving(0.2, -10.16, 4.56, 3.3, 'wood', 0.04, { y: S }), // chambre 2

    /* ── Exterior walls: full height at the back, cut on the terrace side ── */
    group([
      pw(-0.2, -10.4, 5.2, 0.24), // back of chambre 2
      pw(-0.2, -10.4, 0.4, 4.9), // left, rear block
      pw(4.76, -10.4, 0.24, 4.9), // right of the rear block
      pw(4.76, -5.74, 8.34, 0.24), // back of the hall
      pw(12.89, -5.74, 0.2, 5.54), // right, salon
    ]),
    group([pw(-0.2, -5.5, 0.4, 5.3, CUT), pw(-0.2, -0.2, 13.3, 0.2, CUT)]), // left front and the terrace side
    openings('front', frontWall, [[0.9, 0.05, 3.2, 1.0], [5.2, 0.05, 1.9, 1.0], [9.3, 0.05, 3.4, 1.0]], { noFrame: true }),

    /* ── Partitions ── */
    group([
      pw(4.76, -3.4, 0.2, 3.4), // chambre 1 | cuisine
      pw(7.28, -3.4, 0.1, 3.4), // cuisine | sdb
      pw(8.78, -4.44, 0.1, 4.44), // sdb | salon
      pw(0.2, -3.4, 4.56, 0.2), // chambre 1 back
      pw(4.96, -3.4, 3.82, 0.1), // cuisine and sdb back
      pw(8.88, -4.64, 4.01, 0.2), // salon back
    ]),
    group([
      pw(0.2, -4.64, 4.56, 0.2), // corridor | rear block
      pw(1.97, -6.66, 0.1, 2.02), // sdb 2 | dressing
      pw(3.71, -6.66, 0.1, 2.02), // dressing | passage
      pw(0.2, -6.86, 4.56, 0.2), // chambre 2 front
    ]),

    /* ── Finishes and furniture ── */
    group([box(8.94, Y, -3.9, 0.06, 2.3, 3.2, 'wood')]), // the TV wall panel
    group([box(11.99, Y, -4.0, 0.9, 0.45, 3.0, 'fabric'), box(9.6, Y, -4.0, 2.39, 0.45, 0.9, 'fabric')], { anim: 'grow' }), // the L sofa
    group([box(0.6, Y, -3.1, 1.9, 0.45, 2.1, 'fabric'), box(0.6, Y, -3.1, 1.9, 0.9, 0.1, 'wood')], { anim: 'grow' }), // bed, chambre 1
    group([box(1.4, Y, -10.06, 1.9, 0.45, 2.1, 'fabric'), box(1.4, Y, -10.06, 1.9, 0.9, 0.1, 'wood')], { anim: 'grow' }), // bed, chambre 2
    group([box(6.66, Y, -3.2, 0.6, 0.9, 2.8, PL), box(6.62, Y + 0.9, -3.2, 0.66, 0.05, 2.8, 'marbleDark')]), // the kitchen run
    fins(2.12, -6.6, 3.66, -6.6, 6, Y, 2.3, 0.05, 0.12, 'wood', { fine: true }), // dressing slats
    fins(2.13, -6.5, 2.13, -4.8, 6, Y, 2.3, 0.05, 0.12, 'wood', { fine: true }),

    /* ── Phase 2: the balustrade, then the loggia frame ── */
    rail(0, 2.78, 5.06, 2.78, Y, 1.0, 'metal', { fine: false, ...p2 }),
    rail(5.06, 3.68, 13.09, 3.68, Y, 1.0, 'metal', { fine: false, ...p2 }),
    rail(5.06, 2.78, 5.06, 3.68, Y, 1.0, 'metal', { fine: false, ...p2 }),
    rail(13.07, 0, 13.07, 3.68, Y, 1.0, 'metal', { fine: false, ...p2 }),
    rail(-0.18, 0, -0.18, 2.78, Y, 1.0, 'metal', { fine: false, ...p2 }),
    group(
      [
        box(4.9, 0, 1.6, 0.5, 3.2, 2.2, 'concrete'),
        box(12.9, 0, 1.6, 0.5, 3.2, 2.2, 'concrete'),
        box(4.9, 3.2, 1.6, 8.5, 0.45, 2.2, 'concrete'),
      ],
      { ...p2, anim: 'drop' }
    ),
  ];
  list.forEach((pc) => {
    pc.prims.forEach((p) => {
      p.x += dx;
      p.z += dz;
    });
  });
  return list;
}

export const appartement48 = build;
