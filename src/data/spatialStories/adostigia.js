import { box, cyl, wall, mass, paving, fins, strip, group } from './helpers';

/* 04 · Adostigia — Siège social, Casablanca. An interior fit-out, so the
   chapter is a sectional model: one office floor plate, the outer walls cut
   to sill height as the stage is scrolled, partitions full height, no
   ceiling. Plan invented from the renders (11.58.*), about 20 × 12 m:

     ┌──────────────┬──┬────────────────┐
     │  reception   │  │  director      │  +z (front)
     │  fluted wall │c │  walnut        │
     │  counter     │o ├────────────────┤
     │  lounge      │r │  meeting room  │
     │              │r │  marble table  │
     └──────────────┴──┴────────────────┘
      x -10 .. -1    -1..1   1 .. 10

   Light marble in the public zone, wood in the offices, warm cove strips
   along the tops of the walls.                                            */

const F = 0.3; // floor slab
const Y = F + 0.04; // finished floor
const WH = 3.2; // wall height

/** Places to stand: marker position, eye, and what the eye looks at. */
export const adostigiaViews = [
  { id: 'accueil', label: "L'accueil", at: [-4.5, Y + 1.5, 3.9], eye: [-3.4, Y + 1.5, 5.0], look: [-7, Y + 1.1, -5.6] },
  { id: 'reunion', label: 'La salle de réunion', at: [5.6, Y + 1.6, -3.0], eye: [8.7, Y + 1.5, -1.0], look: [2.5, Y + 0.6, -4.4] },
  { id: 'direction', label: 'Le bureau de direction', at: [2.8, Y + 1.5, 4.7], eye: [2.0, Y + 1.5, 5.3], look: [7, Y + 0.6, 2.0] },
];

export function adostigia() {
  // The shell: closed at first, sunk to 1.2 m by the scroll.
  const shell = { phase: 2, anim: 'sink', keep: 1.2 / WH, win: [0, 0.55] };
  const p2 = { phase: 2 };

  return [
    /* ── Plate and floors ── */
    group([box(-10, 0, -6, 20, F, 12, 'concrete')]),
    paving(-10, -6, 11, 12, 'marble', 0.04, { y: F }),
    paving(1, -6, 9, 12, 'wood', 0.04, { y: F }),

    /* ── The shell ── */
    mass(wall(-10, F, 5.7, 20, WH, 0.3), 'plaster', shell),
    mass(wall(-10, F, -6, 20, WH, 0.3), 'plaster', shell),
    mass(wall(-10, F, -5.7, 0.3, WH, 11.4), 'plaster', shell),
    mass(wall(9.7, F, -5.7, 0.3, WH, 11.4), 'plaster', shell),

    /* ── Partitions ── */
    group([box(-1.075, Y, -6, 0.15, WH, 8.2, 'plaster')]), // reception | corridor, open to the front
    group([box(0.93, Y, 0, 0.14, WH, 5.7, 'plaster')]), // corridor | director
    group([box(0.93, Y, -5.7, 0.14, WH, 5.7, 'glass')]), // corridor | meeting: black frosted glass
    group(
      [
        box(0.87, Y + 0.9, -5.7, 0.04, 0.12, 5.7, 'metal', { e: false }),
        box(0.87, Y + 1.5, -5.7, 0.04, 0.12, 5.7, 'metal', { e: false }),
        box(0.87, Y + 2.1, -5.7, 0.04, 0.12, 5.7, 'metal', { e: false }),
      ],
      { fine: true, anim: 'grow' }
    ), // its mirror strips
    group([box(1.07, Y, -0.075, 8.63, WH, 0.15, 'plaster')]), // meeting | director
    fins(0.89, 0.2, 0.89, 5.5, 14, Y, 3.0, 0.05, 0.08, 'wood', { fine: true }), // corridor slats, on the corridor side

    /* ── Reception ── */
    group([box(-9.7, Y, -5.7, 8.6, 3.1, 0.12, 'concrete')]), // the travertine wall
    fins(-9.6, -5.5, -1.2, -5.5, 26, Y, 3.1, 0.12, 0.16, 'concrete', { fine: true }), // its flutes
    group([box(-7.4, Y + 0.9, -5.44, 3.4, 1.5, 0.08, 'marbleDark')], { anim: 'grow' }), // the logo panel
    strip(-9.7, -5.46, -1.1, -5.46, Y + 3.08, 'light', { h: 0.05, t: 0.1 }),
    group([box(-8.2, Y, 1.4, 3.6, 1.05, 0.9, 'concrete')]), // the monolithic counter
    group([box(-9.6, Y, 3.4, 1.8, 0.4, 0.8, 'marbleDark')]), // the low bench
    group(
      [cyl(-3.6, Y, 2.6, 0.5, 0.72, 'fabric'), cyl(-5.4, Y, 3.9, 0.5, 0.72, 'fabric'), cyl(-4.4, Y, 3.0, 0.3, 0.42, 'marbleDark')],
      { anim: 'grow' }
    ),

    /* ── Meeting room: phase 2 ── */
    group([box(3.2, Y, -3.65, 5.2, 0.76, 1.3, 'marbleDark')], { ...p2, anim: 'grow' }),
    group(
      [3.5, 4.8, 6.1, 7.4].flatMap((x) => [box(x, Y, -4.75, 0.5, 0.85, 0.5, 'dark'), box(x, Y, -1.75, 0.5, 0.85, 0.5, 'dark')]),
      { ...p2, anim: 'grow' }
    ),
    group([box(4.2, Y + 1.0, -5.62, 3.4, 1.6, 0.06, 'plaster')], { ...p2, anim: 'grow' }), // the screen
    strip(1.15, -0.13, 9.6, -0.13, Y + 3.08, 'light', { ...p2, h: 0.05, t: 0.1 }),

    /* ── Director's office in walnut: phase 2 ── */
    group([box(4.2, Y, 2.2, 2.4, 0.76, 1.1, 'walnut'), box(5.1, Y, 3.5, 0.6, 0.9, 0.6, 'dark')], { ...p2, anim: 'grow' }),
    group([cyl(4.4, Y, 1.1, 0.38, 0.7, 'fabric'), cyl(6.0, Y, 1.1, 0.38, 0.7, 'fabric')], { ...p2, anim: 'grow' }),
    group([box(9.32, Y, 0.1, 0.38, 3.0, 5.5, 'walnut')], p2), // the shelving wall
    group(
      [box(9.28, Y + 1.0, 0.2, 0.04, 0.04, 5.3, 'plaster', { e: false }), box(9.28, Y + 2.0, 0.2, 0.04, 0.04, 5.3, 'plaster', { e: false })],
      { ...p2, fine: true, anim: 'grow' }
    ), // its shelf lines
    strip(1.15, 5.6, 9.2, 5.6, Y + 3.08, 'light', { ...p2, h: 0.05, t: 0.1 }),
  ];
}
