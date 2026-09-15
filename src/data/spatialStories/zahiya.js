import { box, wall, mass, glazing, paving, fins, openings, group } from './helpers';

/* 02 · Zahiya — Résidence, Marrakech.

   R+2, flat roof, a U-shaped plan in deep graphite mineral render around a
   rear courtyard, in a low-rise neighbourhood (video aerial, frame 2). On
   the street the upper floors alternate: sand-coloured bays step half a
   metre forward, dark bays hold recessed balconies with glass rails. Deep
   punched windows with dark reveals, corner retail behind black storefront
   frames, and a black entrance portal with vertical fins and a backlit
   signage plane.

   Plot: 26 × 22 m, street to +z. The front bar and the right wing stand
   first; the rear bar that closes the U is the phase-2 mass, revealed as
   the camera swings round to the open side of the courtyard (-x).      */

const FH = 3.2;
const H = 3 * FH; // 9.6
const TOP = H + 0.6; // parapet

/** Places to stand: marker position, eye, and what the eye looks at. */
export const zahiyaViews = [
  { id: 'portail', label: 'Le portail', at: [-6.9, 1.8, 12.6], eye: [-6.9, 1.7, 15.2], look: [-6.9, 2.4, 10.6] },
  { id: 'balcon', label: 'Un balcon', at: [1.1, 2 * FH + 1.6, 10.8], eye: [1.1, 2 * FH + 1.6, 10.35], look: [9, 4.5, 20] },
  { id: 'cour', label: 'La cour', at: [-6, 1.8, -1], eye: [-11.6, 1.7, -0.6], look: [6, 3.6, -3] },
];

export function zahiya() {
  const gf = wall(-13, 0, 3, 25.4, FH, 6.4); // recessed shop floor, face at z 9.4
  const body = wall(-13, FH, 3, 26, TOP - FH, 7); // upper front bar, face at z 10
  const rightWing = wall(6, 0, -12, 7, TOP, 15); // z -12..3
  const rearBar = wall(-13, 0, -12, 19, TOP, 7); // z -12..-5, phase 2

  const out = [
    /* ── Ground floor: corner retail behind black storefronts ── */
    mass(gf, 'graphite'),
    group([box(-12.6, 0.1, 8.2, 25, FH - 0.3, 1.2, 'dark', { e: false })]), // the shops, in shadow
    glazing(-12.6, 0.1, 9.4, 25, FH - 0.3, 0.3),
    fins(-12.6, 9.55, 12.4, 9.55, 12, 0.1, FH - 0.3, 0.08, 0.36, 'metal', { fine: true }),
    glazing(12.4, 0.1, 3.4, 0.3, FH - 0.3, 5.8), // the corner return
    fins(12.55, 3.4, 12.55, 9.2, 4, 0.1, FH - 0.3, 0.08, 0.36, 'metal', { fine: true }),
    group([box(-13, FH - 0.32, 9.4, 26, 0.32, 0.6, 'metal')]), // fascia under the overhang

    /* ── The body and the wing ── */
    mass(body, 'graphite'),
    mass(rightWing, 'graphite'),

    /* ── Entrance portal: black, finned, with the backlit plane ── */
    group([box(-8.6, 0, 9.4, 3.4, FH + 0.5, 1.4, 'dark')]),
    glazing(-7.6, 0.1, 10.8, 1.4, 2.6, 0.06),
    fins(-8.5, 10.85, -7.65, 10.85, 4, 0.1, FH + 0.3, 0.06, 0.1, 'metal', { fine: true }),
    fins(-6.15, 10.85, -5.3, 10.85, 4, 0.1, FH + 0.3, 0.06, 0.1, 'metal', { fine: true }),
    group([box(-8.1, 2.85, 10.82, 2.4, 0.5, 0.04, 'light')], { anim: 'grow' }),
  ];

  /* ── Upper floors on the street: sand bays and dark balcony bays ── */
  const bays = [-11.2, -4.2, 1.6, 8.6]; // x of each 3.6 m sand bay
  const darkBays = [-7.2, -0.2, 5.6]; // x of each 2.6 m recessed balcony
  bays.forEach((x) => {
    const bay = wall(x, FH, 9.7, 3.6, H - FH, 0.8); // face at z 10.5
    out.push(
      mass(bay, 'concrete'),
      openings('front', bay, [
        [1.0, 0.5, 1.6, 1.8],
        [1.0, FH + 0.5, 1.6, 1.8],
      ])
    );
  });
  const balc = [];
  const glassRails = [];
  const recess = [];
  darkBays.forEach((x) => {
    for (let k = 0; k < 2; k += 1) {
      const y = FH + k * FH;
      recess.push([x + 13, y - FH + 0.3, 2.6, FH - 0.6]);
      balc.push(box(x, y, 10, 2.6, 0.2, 0.9, 'concrete'));
      glassRails.push(box(x, y + 0.2, 10.86, 2.6, 1.0, 0.04, 'glass'));
    }
  });
  out.push(
    openings('front', body, recess, { noFrame: true }),
    group(balc, { anim: 'drop' }),
    group(glassRails, { fine: true })
  );

  /* ── The corner: one sand bay wrapping onto the side street ── */
  const sideBay = wall(13, FH, 4.2, 0.5, H - FH, 4.4);
  out.push(
    mass(sideBay, 'concrete'),
    openings('right', sideBay, [
      [1.2, 0.5, 2.0, 1.8],
      [1.2, FH + 0.5, 2.0, 1.8],
    ])
  );

  /* ── Punched windows: side street, courtyard faces ── */
  const side = [];
  const courtShops = []; // the shop floor's courtyard face
  const courtFront = []; // the front bar's courtyard face, floors 1-2
  const courtWing = []; // the wing's courtyard face (only z -5..3 is exposed)
  const courtRear = [];
  for (let k = 0; k < 3; k += 1) {
    const v = k * FH + 0.5;
    side.push([1.5, v, 1.2, 1.7], [8.0, v, 1.2, 1.7], [12.5, v, 1.2, 1.7]);
    const row = [[1.5, v, 1.3, 1.7], [6.5, v, 1.3, 1.7], [11.5, v, 1.3, 1.7], [16.0, v, 1.3, 1.7]];
    if (k === 0) courtShops.push(...row);
    else courtFront.push(...row.map(([u, vv, w, h]) => [u, vv - FH, w, h]));
    courtWing.push([7.6, v, 1.2, 1.7], [11.4, v, 1.2, 1.7]);
    courtRear.push([1.5, v, 1.3, 1.7], [6.5, v, 1.3, 1.7], [11.0, v, 1.3, 1.7], [15.5, v, 1.3, 1.7]);
  }
  out.push(
    openings('right', rightWing, side),
    openings('back', body, courtFront),
    openings('back', gf, courtShops),
    openings('left', rightWing, courtWing),
    paving(-13, -5, 19, 8, 'paving', 0.08) // the courtyard ground
  );

  /* ── The rear bar that closes the U: phase 2 ── */
  const p2 = { phase: 2 };
  out.push(
    mass(rearBar, 'graphite', p2),
    openings('front', rearBar, courtRear, p2),
    group(
      [box(-6.5, FH, -5, 2.6, 0.2, 0.9, 'concrete'), box(-6.5, 2 * FH, -5, 2.6, 0.2, 0.9, 'concrete')],
      { ...p2, anim: 'drop' }
    ),
    group(
      [box(-6.5, FH + 0.2, -4.14, 2.6, 1.0, 0.04, 'glass'), box(-6.5, 2 * FH + 0.2, -4.14, 2.6, 1.0, 0.04, 'glass')],
      { ...p2, fine: true }
    )
  );

  return out;
}
