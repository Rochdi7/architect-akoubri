import * as THREE from 'three';

/* One material per architectural finish, shared by every mesh in the scene
   and by all five chapters — there are no per-project materials. The set is
   the studio's real palette, desaturated to model scale: warm sand
   travertine, earth-tinted render, graphite mineral render, near-black
   metal, oak and walnut, a hair of brass. Nothing here is glossy — the
   model should read as card, plaster and cast stone under studio light,
   not as a rendered product shot. */
const FINISHES = {
  // Light concrete / travertine: Le Sentier frames, Villa Bambou box,
  // the Adostigia counter.
  concrete: { color: 0xcfbea0, roughness: 0.93, metalness: 0, env: 0.32 },
  // Plaster: interior walls, the white villa body, parapets.
  plaster: { color: 0xece5d8, roughness: 0.9, metalness: 0, env: 0.28 },
  // Earth-tinted render: the Le Sentier wings. Red-brown, kept desaturated.
  earth: { color: 0x7c5a4c, roughness: 0.95, metalness: 0, env: 0.22 },
  // Graphite mineral render: the Zahiya body.
  graphite: { color: 0x3d3c3a, roughness: 0.96, metalness: 0, env: 0.18 },
  paving: { color: 0xd8d0c2, roughness: 0.96, metalness: 0, env: 0.25 },
  plinth: { color: 0xf1ece3, roughness: 1, metalness: 0, env: 0.2 },
  // Oak: slats, soffits, decks, bedroom floors. Walnut: the director's office.
  wood: { color: 0xb08c68, roughness: 0.8, metalness: 0, env: 0.32 },
  walnut: { color: 0x6b4a36, roughness: 0.72, metalness: 0, env: 0.35 },
  // Dark metal: canopies, storefront frames, portals, rails, window frames.
  metal: { color: 0x25272b, roughness: 0.46, metalness: 0.65, env: 0.8 },
  // Brass: entrance strips and signage edges — millimetres, never a glow.
  brass: { color: 0xb0905e, roughness: 0.38, metalness: 0.85, env: 0.7 },
  // Matte near-black: window reveals and the inside of loggias.
  dark: { color: 0x1d2023, roughness: 0.9, metalness: 0.05, env: 0.12 },
  // Light marble (public floors) and dark marble (tables, kitchen bars).
  marble: { color: 0xe4ddd1, roughness: 0.34, metalness: 0, env: 0.6 },
  marbleDark: { color: 0x2c2d30, roughness: 0.3, metalness: 0.1, env: 0.7 },
  // Upholstery and micro-cement.
  fabric: { color: 0xbcb09f, roughness: 1, metalness: 0, env: 0.15 },
  cement: { color: 0xc8c1b5, roughness: 0.86, metalness: 0, env: 0.25 },
  // Ceiling coves: a warm strip that is a little brighter than its wall,
  // without bloom or glow.
  light: { color: 0xfff1dc, emissive: 0xffd9ad, emissiveIntensity: 0.55, roughness: 1, metalness: 0, env: 0 },
  glass: {
    color: 0x66747e,
    roughness: 0.14,
    metalness: 0.1,
    env: 1.0,
    transparent: true,
    opacity: 0.52,
    depthWrite: false,
  },
  water: {
    color: 0x8ea5b0,
    roughness: 0.06,
    metalness: 0.2,
    env: 1.0,
    transparent: true,
    opacity: 0.78,
  },
};

export function createMaterials() {
  const mats = {};
  Object.entries(FINISHES).forEach(([name, f]) => {
    const { env, ...rest } = f;
    const m = new THREE.MeshStandardMaterial(rest);
    m.envMapIntensity = env;
    m.name = name;
    mats[name] = m;
  });
  // Hairline edges, drawn over the fabric so the volumes read as a drawing.
  mats.edge = new THREE.LineBasicMaterial({
    color: 0x0f243e,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });
  return mats;
}

export function disposeMaterials(mats) {
  Object.values(mats).forEach((m) => m.dispose());
}
