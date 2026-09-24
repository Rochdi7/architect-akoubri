/* Spatial Stories — five chapters from the studio's real projects, shown in
   the home-page 3D section.

   Each chapter is a simplified massing model of a real building: a list of
   *pieces*, every one an axis-aligned box or a cylinder in metres, ground at
   y = 0, street facing +z (see ./helpers.js). The renderer knows nothing
   about houses — it only ever sees pieces — so the architecture lives here,
   next to the copy, one file per project.

   `camera` frames each chapter: azimuth/elevation in radians around the
   model, `radius` the bounding sphere the lens has to fit, `ty` the height
   the camera looks at; `swing`/`rise`/`approach` are how far the scroll
   moves it, `portrait` overrides for a phone held upright. `sun` is the
   key light's position when a chapter needs its own raking light.
   `views` are the places a visitor can step into (marker `at`, camera
   `eye` and `look`, in metres); the section draws them as hotspots.
   `href` is where "Explorer le projet" leads: the project's own page.    */

import { projects } from '../projects';
import { leSentier, leSentierViews } from './le-sentier';
import { zahiya, zahiyaViews } from './zahiya';
import { villaBambou, villaBambouViews } from './villa-bambou';
import { adostigia, adostigiaViews } from './adostigia';
import { appartement48, appartement48Views } from './appartement-48';

export * from './helpers';

const real = (slug) => projects.find((p) => p.slug === slug);
const meta = (slug) => {
  const p = real(slug);
  return { title: p.name, category: p.category, location: p.location, href: `/projets/${slug}` };
};

export const spatialProjects = [
  {
    id: 1,
    slug: 'le-sentier',
    ...meta('le-sentier'),
    note:
      "Trois cadres de béton clair empilés et décalés d'un étage à l'autre, chacun tenant une loggia de deux mètres, sous une toiture-terrasse à bassin.",
    camera: {
      az: 0.38,
      el: 0.1,
      zoom: 0.98,
      ty: 7.0,
      radius: 17.5,
      swing: 0.5,
      rise: 0.62,
      approach: -0.06,
      portrait: { radius: 25, ty: 6.4, el: 0.14 },
    },
    sun: [-24, 14, 16],
    views: leSentierViews,
    pieces: leSentier(),
  },
  {
    id: 2,
    slug: 'zahiya',
    ...meta('zahiya'),
    note:
      "Un bloc en U d'enduit graphite ouvert sur une cour arrière, dont les travées claires avancent d'un demi-mètre sur la rue pour rythmer la façade.",
    camera: {
      az: 0.78,
      el: 0.2,
      zoom: 0.95,
      ty: 5.0,
      radius: 17,
      swing: -2.3,
      rise: 0.34,
      approach: -0.04,
      portrait: { radius: 22, ty: 4.6 },
    },
    sun: [-18, 18, 14],
    views: zahiyaViews,
    pieces: zahiya(),
  },
  {
    id: 3,
    slug: 'villa-bambou',
    ...meta('villa-bambou'),
    note:
      "Un volume de pierre claire en porte-à-faux de trois mètres au-dessus de la terrasse et du bassin, sous-face en lattes de bois, socle vitré à l'angle.",
    camera: {
      az: 0.35,
      el: 0.04,
      zoom: 0.95,
      ty: 2.8,
      radius: 11.5,
      swing: 0.45,
      rise: 0.4,
      approach: 0.04,
      portrait: { radius: 15.5, ty: 2.4 },
    },
    views: villaBambouViews,
    pieces: villaBambou(),
  },
  {
    id: 4,
    slug: 'adostigia',
    ...meta('adostigia'),
    note:
      "Un plateau de bureaux en coupe : accueil en travertin cannelé et comptoir monolithe, couloir en lames de bois, salle de réunion et bureau de direction en noyer.",
    camera: {
      az: 0.5,
      el: 0.14,
      zoom: 0.95,
      ty: 1.4,
      radius: 11.8,
      swing: 0.25,
      rise: 0.72,
      approach: 0.08,
      portrait: { radius: 19, ty: 1.2 },
    },
    sun: [-10, 26, 12],
    views: adostigiaViews,
    pieces: adostigia(),
  },
  {
    id: 5,
    slug: 'le-sentier-appartement-48',
    ...meta('le-sentier'),
    navTitle: 'Appartement 48',
    subtitle: 'Appartement témoin N°48 · 4ᵉ étage',
    note:
      "Le plan de l'appartement témoin coupé à hauteur d'allège : séjour, cuisine ouverte et deux chambres autour d'un couloir, sous le cadre de la loggia qui court en façade.",
    camera: {
      az: 0.3,
      el: 0.1,
      zoom: 0.96,
      ty: 1.0,
      radius: 11.2,
      swing: 0.4,
      rise: 0.72,
      approach: -0.02,
      portrait: { radius: 16, ty: 0.9 },
    },
    sun: [-8, 26, 14],
    views: appartement48Views,
    pieces: appartement48(),
  },
];

/** Bounds of a project's pieces (all phases), used by the 2D elevation. */
export function projectBounds(project, { lite = false } = {}) {
  const b = { minX: Infinity, maxX: -Infinity, minY: 0, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity };
  project.pieces.forEach((pc) => {
    if (lite && pc.fine) return;
    pc.prims.forEach((p) => {
      if (lite && p.fine) return;
      const x0 = p.k === 'b' ? p.x : p.x - p.r;
      const x1 = p.k === 'b' ? p.x + p.w : p.x + p.r;
      const z0 = p.k === 'b' ? p.z : p.z - p.r;
      const z1 = p.k === 'b' ? p.z + p.d : p.z + p.r;
      b.minX = Math.min(b.minX, x0);
      b.maxX = Math.max(b.maxX, x1);
      b.minZ = Math.min(b.minZ, z0);
      b.maxZ = Math.max(b.maxZ, z1);
      b.minY = Math.min(b.minY, p.y);
      b.maxY = Math.max(b.maxY, p.y + p.h);
    });
  });
  return b;
}
