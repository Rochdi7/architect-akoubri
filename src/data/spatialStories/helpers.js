/* Spatial Stories — the primitive vocabulary the chapters are written in.

   A project is a list of *pieces*; every piece is a list of axis-aligned
   boxes or cylinders in metres, with the ground at y = 0 and the street
   side facing +z. The renderer (components/architecture/scene) knows
   nothing about houses — it only ever sees pieces — so the whole
   architectural content of the section lives in these data files.

   A piece is the unit of animation: it rises from the ground, drops from
   above, grows from its centre, slides in along z or (for a cut-away shell)
   sinks to sill height as the stage is scrolled. `phase: 2` marks what the
   scroll narrative sets down; `fine` marks detail (mullions, rails, slats)
   that the phone build leaves out.                                        */

/* ── Primitives ───────────────────────────────────────────────────────── */

// Hairline edges only on the opaque building fabric, never on glass, water,
// reveals or the millimetre-thin accents.
const NO_EDGE = new Set(['glass', 'water', 'dark', 'brass', 'light']);

export const box = (x, y, z, w, h, d, m = 'concrete', extra = {}) => ({
  k: 'b', x, y, z, w, h, d, m,
  e: !NO_EDGE.has(m),
  ...extra,
});
export const cyl = (x, y, z, r, h, m = 'concrete', extra = {}) => ({ k: 'c', x, y, z, r, h, m, ...extra });
export const piece = (opts, prims) => ({ phase: 1, anim: 'rise', ...opts, prims });
const lerp = (a, b, t) => a + (b - a) * t;

/** A solid volume: min corner + size. The returned object doubles as the
    wall reference that `openings()` punches into. */
export const wall = (x, y, z, w, h, d) => ({ x, y, z, w, h, d });

export const mass = (W, m = 'concrete', o = {}) =>
  piece({ anim: 'rise', ...o }, [box(W.x, W.y, W.z, W.w, W.h, W.d, m)]);

export const slab = (x, y, z, w, th, d, m = 'plaster', o = {}) =>
  piece({ anim: 'drop', ...o }, [box(x, y, z, w, th, d, m)]);

export const glazing = (x, y, z, w, h, d, o = {}) =>
  piece({ anim: 'rise', ...o }, [box(x, y, z, w, h, d, 'glass')]);

/** A sheet of water whose surface sits at `top`. */
export const water = (x, z, w, d, o = {}) => {
  const top = o.top ?? 0.04;
  return piece({ anim: 'grow', ...o }, [box(x, top - 0.12, z, w, 0.12, d, 'water')]);
};

/** A ground finish; `o.y` lifts it onto a roof or an upper floor. */
export const paving = (x, z, w, d, m = 'paving', h = 0.06, o = {}) =>
  piece({ anim: 'grow', ...o }, [box(x, o.y ?? 0, z, w, h, d, m)]);

/** A row of columns from (x0,z0) to (x1,z1), inclusive of both ends. */
export const columns = (x0, z0, x1, z1, n, y, h, r, m = 'concrete', o = {}) =>
  piece(
    { anim: 'rise', ...o },
    Array.from({ length: n }, (_, i) => {
      const t = n === 1 ? 0 : i / (n - 1);
      return cyl(lerp(x0, x1, t), y, lerp(z0, z1, t), r, h, m);
    })
  );

/** n vertical fins spread evenly along a line — brise-soleil, slatted
    walls, fluted stone. Every second fin is `fine` so a phone keeps the
    rhythm at half the count; `o.allFine` drops the whole piece there.
    With a small `h` and a long `depth` the same call makes a run of
    horizontal strips (a timber soffit). */
export const fins = (x0, z0, x1, z1, n, y, h, t, depth, m = 'wood', o = {}) => {
  const alongX = Math.abs(x1 - x0) >= Math.abs(z1 - z0);
  const { allFine, ...rest } = o;
  return piece(
    { anim: 'rise', ...rest },
    Array.from({ length: n }, (_, i) => {
      const u = (i + 0.5) / n;
      const cx = lerp(x0, x1, u);
      const cz = lerp(z0, z1, u);
      const fine = allFine || i % 2 === 1;
      return alongX
        ? box(cx - t / 2, y, cz - depth / 2, t, h, depth, m, { fine, e: false })
        : box(cx - depth / 2, y, cz - t / 2, depth, h, t, m, { fine, e: false });
    })
  );
};

/** Recessed openings on one face of a wall. `list` holds [u, v, w, h] in
    face coordinates: u along the face from its left end, v up from the wall
    base. A matte-dark reveal sits 3 cm proud of the face — at model scale it
    reads as a deep recess — and a thin metal frame lips the edge (fine).
    `o.noFrame` leaves the frame out (loggia glazing behind a rail). */
export const openings = (face, W, list, o = {}) => {
  const prims = [];
  const D = 0.38; // reveal depth
  const P = 0.03; // how far the reveal stands proud of the face
  const F = 0.07; // frame thickness
  const FP = 0.06; // frame protrusion
  const { noFrame, ...rest } = o;
  list.forEach(([u, v, w, h]) => {
    let r;
    let frame;
    if (face === 'front' || face === 'back') {
      const z = face === 'front' ? W.z + W.d - D + P : W.z - P;
      r = box(W.x + u, W.y + v, z, w, h, D, 'dark');
      const fz = face === 'front' ? W.z + W.d - FP / 2 : W.z - FP / 2;
      frame = [
        box(W.x + u - F, W.y + v - F, fz, w + 2 * F, F, FP, 'metal'),
        box(W.x + u - F, W.y + v + h, fz, w + 2 * F, F, FP, 'metal'),
        box(W.x + u - F, W.y + v, fz, F, h, FP, 'metal'),
        box(W.x + u + w, W.y + v, fz, F, h, FP, 'metal'),
      ];
    } else {
      const x = face === 'right' ? W.x + W.w - D + P : W.x - P;
      r = box(x, W.y + v, W.z + u, D, h, w, 'dark');
      const fx = face === 'right' ? W.x + W.w - FP / 2 : W.x - FP / 2;
      frame = [
        box(fx, W.y + v - F, W.z + u - F, FP, F, w + 2 * F, 'metal'),
        box(fx, W.y + v + h, W.z + u - F, FP, F, w + 2 * F, 'metal'),
        box(fx, W.y + v, W.z + u - F, FP, h, F, 'metal'),
        box(fx, W.y + v, W.z + u + w, FP, h, F, 'metal'),
      ];
    }
    prims.push(r);
    if (!noFrame) frame.forEach((b) => prims.push({ ...b, fine: true, e: false }));
  });
  return piece({ anim: 'grow', ...rest }, prims);
};

/** A flight of n steps descending toward +z from height `top`. */
export const steps = (x, z, w, n, top, run, m = 'paving', o = {}) =>
  piece(
    { anim: 'grow', ...o },
    Array.from({ length: n }, (_, i) => box(x, 0, z + i * run, w, top - (top / n) * i, run, m))
  );

/** A thin rail (balustrade) along a line at height y: a 4 cm metal box.
    `fine` by default — a phone reads the parapet without it. */
export const rail = (x0, z0, x1, z1, y, h, m = 'metal', o = {}) => {
  const alongX = Math.abs(x1 - x0) >= Math.abs(z1 - z0);
  const t = 0.04;
  const b = alongX
    ? box(Math.min(x0, x1), y, z0 - t / 2, Math.abs(x1 - x0), h, t, m, { e: false })
    : box(x0 - t / 2, y, Math.min(z0, z1), t, h, Math.abs(z1 - z0), m, { e: false });
  return piece({ anim: 'rise', fine: true, ...o }, [b]);
};

/** A millimetre strip along a line — brass under a balcony edge, a ceiling
    cove. Thin in both other directions; `fine` by default. */
export const strip = (x0, z0, x1, z1, y, m = 'brass', o = {}) => {
  const alongX = Math.abs(x1 - x0) >= Math.abs(z1 - z0);
  const t = o.t ?? 0.05;
  const h = o.h ?? 0.05;
  const b = alongX
    ? box(Math.min(x0, x1), y, z0 - t / 2, Math.abs(x1 - x0), h, t, m, { e: false })
    : box(x0 - t / 2, y, Math.min(z0, z1), t, h, Math.abs(z1 - z0), m, { e: false });
  const { t: _t, h: _h, ...rest } = o; // eslint-disable-line no-unused-vars
  return piece({ anim: 'grow', fine: true, ...rest }, [b]);
};

/** Several primitives that move as one piece (a frame, a piece of furniture). */
export const group = (prims, o = {}) => piece({ anim: 'rise', ...o }, prims);
