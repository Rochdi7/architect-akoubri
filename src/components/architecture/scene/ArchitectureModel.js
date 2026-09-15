import * as THREE from 'three';

/* Turns a project's piece list (data/spatialStories) into a THREE.Group.

   Every box is the same unit BoxGeometry scaled into place, every column the
   same unit cylinder, so a project costs no geometry of its own: building
   one is a few hundred Object3D allocations, and tearing it down is a
   single removeFromParent(). Each piece becomes a Group whose origin sits at
   the piece's own base centre — that is what lets it rise, drop, grow,
   slide or sink from the right place when the model is assembled, taken
   down or scrolled through. */

export function createGeometries() {
  const box = new THREE.BoxGeometry(1, 1, 1);
  return {
    box,
    cyl: new THREE.CylinderGeometry(1, 1, 1, 18, 1),
    boxEdges: new THREE.EdgesGeometry(box),
  };
}

export function disposeGeometries(geos) {
  Object.values(geos).forEach((g) => g.dispose());
}

const NO_SHADOW = new Set(['glass', 'water', 'light']);

export function buildModel(project, { mats, geos, lite = false, edges = true }) {
  const root = new THREE.Group();
  const pieces = [];
  const solids = []; // opaque meshes, for the viewpoint markers' occlusion test

  project.pieces.forEach((pc, index) => {
    if (lite && pc.fine) return;
    const prims = pc.prims.filter((p) => !(lite && p.fine));
    if (!prims.length) return;

    // Base centre of the piece: origin for its assembly animation.
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    let minY = Infinity;
    prims.forEach((p) => {
      const x0 = p.k === 'b' ? p.x : p.x - p.r;
      const x1 = p.k === 'b' ? p.x + p.w : p.x + p.r;
      const z0 = p.k === 'b' ? p.z : p.z - p.r;
      const z1 = p.k === 'b' ? p.z + p.d : p.z + p.r;
      minX = Math.min(minX, x0);
      maxX = Math.max(maxX, x1);
      minZ = Math.min(minZ, z0);
      maxZ = Math.max(maxZ, z1);
      minY = Math.min(minY, p.y);
    });
    const cx = (minX + maxX) / 2;
    const cz = (minZ + maxZ) / 2;

    const group = new THREE.Group();
    group.position.set(cx, minY, cz);

    prims.forEach((p) => {
      const mat = mats[p.m] || mats.concrete;
      let mesh;
      if (p.k === 'b') {
        mesh = new THREE.Mesh(geos.box, mat);
        mesh.position.set(p.x + p.w / 2 - cx, p.y + p.h / 2 - minY, p.z + p.d / 2 - cz);
        mesh.scale.set(p.w, p.h, p.d);
        if (edges && p.e) {
          const line = new THREE.LineSegments(geos.boxEdges, mats.edge);
          line.renderOrder = 1;
          mesh.add(line);
        }
      } else {
        mesh = new THREE.Mesh(geos.cyl, mat);
        mesh.position.set(p.x - cx, p.y + p.h / 2 - minY, p.z - cz);
        mesh.scale.set(p.r, p.h, p.r);
      }
      mesh.castShadow = !NO_SHADOW.has(p.m);
      mesh.receiveShadow = true;
      if (mesh.castShadow) solids.push(mesh);
      group.add(mesh);
    });

    root.add(group);
    const phase = pc.phase || 1;
    pieces.push({
      group,
      anim: pc.anim,
      phase,
      baseY: minY,
      baseZ: cz,
      index,
      // A slab that is set down by the scroll travels less than one that
      // drops in during assembly, so it never hangs far above its walls.
      lift: phase === 2 ? 1.1 : 2.2,
      // 'slide': how far (m, along z) the piece travels to reach its place.
      slide: pc.slide ?? -3,
      // 'sink': the fraction of its height a cut wall keeps once scrolled.
      keep: pc.keep ?? 0.4,
      // Phase-2 window of the scroll reveal. Authored windows let a group
      // of pieces move as one; otherwise the scene sequences them.
      win: pc.win ? [pc.win[0], pc.win[1]] : null,
      enter: 1, // 0..1 assembly factor, tweened by the scene
      reveal: 1, // effective visibility last applied
      sink: 0, // 0..1 how far a 'sink' piece has been cut down
    });
  });

  return { root, pieces, solids };
}

/** Apply a 0..1 reveal to a piece: rise from its base, drop from above,
    grow from its centre, or slide in along z. `sink` (0..1) cuts a 'sink'
    piece down towards its `keep` height. At reveal 1 and sink 0 the piece
    is exactly where the data put it. */
export function applyReveal(piece, r, sink = 0) {
  piece.reveal = r;
  piece.sink = sink;
  const g = piece.group;
  const v = Math.max(r, 0.0001);
  g.visible = r > 0.015;
  if (piece.anim === 'rise') {
    g.scale.set(1, v, 1);
    g.position.y = piece.baseY;
  } else if (piece.anim === 'drop') {
    const s = 0.86 + 0.14 * v;
    g.scale.set(s, 1, s);
    g.position.y = piece.baseY + (1 - v) * piece.lift;
  } else if (piece.anim === 'slide') {
    g.scale.set(1, 1, 1);
    g.position.y = piece.baseY;
    g.position.z = piece.baseZ + (1 - v) * piece.slide;
  } else if (piece.anim === 'sink') {
    g.scale.set(1, v * (1 - sink * (1 - piece.keep)), 1);
    g.position.y = piece.baseY;
  } else {
    g.scale.set(v, v, v);
    g.position.y = piece.baseY;
  }
}

export function removeModel(model) {
  if (model?.root) model.root.removeFromParent();
}
