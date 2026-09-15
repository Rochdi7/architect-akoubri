import { Link } from 'react-router-dom';
import InkTitle from '../components/InkTitle';
import SpatialStories from '../components/architecture/SpatialStories';
import { useReveal } from '../hooks/useReveal';

/* Maquette 3D — the Spatial Stories stage on a page of its own, reached
   from the header. The stage pins for a couple of viewports and carries
   its own heading (the series label is the page's h1); a short closing
   band hands the visitor on to the project pages and the contact form. */
export default function Maquette() {
  useReveal();

  return (
    <>
      <SpatialStories headingTag="h1" />

      <section className="zv zv-section">
        <div className="shell">
          <div data-reveal className="reveal flex flex-wrap items-end justify-between gap-8">
            <div>
              <span className="zv-subtitle">Et ensuite</span>
              <InkTitle className="zv-h2 mt-5 max-w-[560px]">Les mêmes projets, en images et en chiffres</InkTitle>
              <p className="zv-body zv-muted mt-5 max-w-[520px]">
                Chaque maquette renvoie à sa fiche : images de synthèse, programme, surface et
                mission. Un projet en tête ? Nous le modélisons avant de le construire.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/projets" className="zv-btn">
                Voir les projets
              </Link>
              <Link to="/contact" className="zv-btn zv-btn-outline">
                Parler de votre projet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
