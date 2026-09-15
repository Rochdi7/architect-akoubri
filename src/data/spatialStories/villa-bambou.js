import { box, wall, mass, slab, glazing, water, paving, fins, openings, group } from './helpers';

/* 03 · Villa Bambou — Maison individuelle, périphérie de Marrakech.

   Two storeys. The upper volume is a light stone box in strong cantilever
   over the ground-floor terrace: a thick frame (floor, head, cheeks) with a
   timber-slat soffit and a single dark vertical panel, the window band set
   three metres back under the overhang. The ground floor is an open-corner
   glazed room with sliding doors onto a paved terrace, a rectangular pool
   in front with a sunken lounge step, and a second, lower volume behind
   to the right. The bamboo hedge is not modelled: a low wall marks the
   boundary.

   Modelled from render 11.58.49. Pool to +z; the upper box (phase 2)
   slides out over it as the stage is scrolled.                            */

const T = 0.35; // terrace deck height

/** Places to stand: marker position, eye, and what the eye looks at. */
export const villaBambouViews = [
  { id: 'terrasse', label: 'Sous le porte-à-faux', at: [-1, T + 1.6, 4.0], eye: [1.2, T + 1.6, 4.9], look: [-3.5, 4.2, -1.5] },
  { id: 'bassin', label: 'Le bassin', at: [-0.5, T + 0.9, 9.6], eye: [1.6, T + 0.9, 10.3], look: [-2, 4.6, 0] },
];

export function villaBambou() {
  const back = wall(-5, T, -6, 10, 3.1, 5.2); // z -6..-0.8
  const right = wall(2.4, T, -0.8, 2.6, 3.1, 2.8); // z -0.8..2
  const room = wall(-5.9, 4.0, -6.0, 9.5, 2.7, 8.0); // upper room, face at z 2

  // Everything of the upper box moves as one when the scroll sets it out.
  const up = { phase: 2, anim: 'slide', slide: -4.5, win: [0.05, 0.8] };

  return [
    /* ── Ground: terrace, pool, boundary ── */
    paving(-7, -6, 14, 11.5, 'paving', T), // interior floor and terrace, z -6..5.5
    group(
      [
        box(-6.3, 0, 5.5, 0.3, T, 5.5, 'paving'), // pool coping, a ring
        box(5.0, 0, 5.5, 0.3, T, 5.5, 'paving'),
        box(-6.3, 0, 10.7, 11.6, T, 0.3, 'paving'),
        box(-6, 0, 5.5, 11, 0.06, 5.2, 'cement'), // pool floor
      ],
      { anim: 'grow' }
    ),
    water(-6, 5.5, 11, 5.2, { top: T - 0.03 }),
    group([box(2.6, 0, 8.9, 2.2, 0.22, 1.6, 'paving')], { anim: 'grow' }), // sunken lounge step
    mass(wall(-8.6, 0, -9, 0.3, 1.5, 21), 'plaster'),
    mass(wall(-8.6, 0, -9, 19.2, 1.5, 0.3), 'plaster'),
    mass(wall(10.3, 0, -9, 0.3, 1.5, 21), 'plaster'),

    /* ── Ground floor: the open-corner glazed room ── */
    mass(back, 'plaster'),
    mass(right, 'plaster'),
    openings('back', back, [[1.2, 0.5, 1.4, 1.8], [6.0, 0.5, 1.4, 1.8]]),
    group([box(-4.7, T + 0.1, -0.8, 7.0, 2.9, 2.5, 'dark', { e: false })]), // the room, in shadow
    glazing(-4.9, T + 0.1, 1.7, 7.4, 2.9, 0.3),
    glazing(-5.0, T + 0.1, -0.8, 0.3, 2.9, 2.5),
    fins(-4.9, 1.85, 2.5, 1.85, 6, T + 0.1, 2.9, 0.07, 0.36, 'metal', { fine: true }),
    fins(-4.85, -0.8, -4.85, 1.7, 3, T + 0.1, 2.9, 0.07, 0.36, 'metal', { fine: true }),
    slab(-5.2, 3.25, -6.2, 10.4, 0.2, 8.4, 'plaster'), // ceiling slab of the room, under the frame

    /* ── The second, lower volume behind and to the right ── */
    mass(wall(5.2, T, -7, 4.6, 2.9, 6), 'plaster'),
    openings('front', wall(5.2, T, -7, 4.6, 2.9, 6), [[0.8, 0.5, 1.2, 1.6], [2.8, 0.5, 1.2, 1.6]]),
    slab(5.0, T + 2.9, -7.2, 5.0, 0.3, 6.4, 'concrete'),

    /* ── The cantilevered box: phase 2, slides out over the pool ── */
    group(
      [
        box(-6.5, 3.45, -6.5, 11.5, 0.55, 11.5, 'concrete'), // floor of the frame, z -6.5..5
        box(-6.5, 6.7, -6.5, 11.5, 0.65, 11.5, 'concrete'), // head
        box(3.6, 4.0, -6.5, 1.4, 2.7, 11.5, 'concrete'), // right cheek
        box(-6.5, 4.0, -6.5, 0.6, 2.7, 11.5, 'concrete'), // left cheek
        box(-5.9, 4.0, -6.5, 9.5, 2.7, 0.5, 'concrete'), // back
      ],
      up
    ),
    mass(room, 'plaster', up),
    openings('front', room, [[0.4, 0.5, 8.7, 1.7]], up),
    group([box(-5.9, 6.58, 2.0, 9.5, 0.12, 3.0, 'wood')], up), // timber ceiling of the recess
    fins(-5.9, 3.5, 3.6, 3.5, 12, 6.4, 0.18, 0.08, 3.0, 'wood', { ...up, fine: true }), // its slats
    group([box(-5.9, 3.33, 2.0, 9.5, 0.12, 2.9, 'wood')], up), // timber soffit under the cantilever
    fins(-5.9, 3.45, 3.6, 3.45, 12, 3.15, 0.18, 0.08, 2.9, 'wood', { ...up, fine: true }), // its slats
    group([box(-5.3, 4.1, 2.05, 1.5, 2.25, 0.1, 'dark')], up), // the dark vertical panel
  ];
}
