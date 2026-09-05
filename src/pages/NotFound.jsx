import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="zv flex min-h-[70svh] items-center pt-24 sm:pt-32">
      <div className="shell text-center">
        <span className="zv-subtitle">Erreur 404</span>
        <h1 className="zv-h1 mt-5">Cette page n'existe pas</h1>
        <p className="zv-lead zv-muted mx-auto mt-5 max-w-md">
          Le lien est peut-être ancien, ou la page a été déplacée.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="zv-btn">Retour à l'accueil</Link>
          <Link to="/projets" className="zv-btn zv-btn-outline">Voir les projets</Link>
        </div>
      </div>
    </section>
  );
}
