import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Agency from './pages/Agency';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import { getProject } from './data/projects';

const TITLES = {
  '/': "Adostigia — Cabinet d'architecture & design d'intérieur",
  '/projets': 'Projets — Adostigia',
  '/agence': 'L\'agence — Adostigia',
  '/services': 'Services — Adostigia',
  '/contact': 'Contact — Adostigia',
  '/mentions-legales': 'Mentions légales — Adostigia',
  '/confidentialite': 'Politique de confidentialité — Adostigia',
};

export default function App() {
  return (
    <>
      <RouteEffects />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projets" element={<Projects />} />
          <Route path="/projets/:slug" element={<ProjectDetail />} />
          <Route path="/agence" element={<Agency />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

/* Scroll to top and set the document title on every navigation. Without an
   SSR layer this is the only place titles can be maintained. */
function RouteEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

    let title = TITLES[pathname];
    if (!title && pathname.startsWith('/projets/')) {
      const project = getProject(pathname.split('/')[2]);
      title = project ? `${project.name} — Adostigia` : 'Projet — Adostigia';
    }
    document.title = title || 'Adostigia';
  }, [pathname]);

  return null;
}
