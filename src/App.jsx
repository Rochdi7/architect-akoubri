import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Agency from './pages/Agency';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Legal from './pages/Legal';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import { getProject } from './data/projects';
import { getPost } from './data/posts';

const TITLES = {
  '/': "Akoubri — Cabinet d'architecture & design d'intérieur",
  '/projets': 'Projets — Akoubri',
  '/agence': 'L\'agence — Akoubri',
  '/services': 'Services — Akoubri',
  '/contact': 'Contact — Akoubri',
  '/journal': "Journal — Notes d'agence — Akoubri",
  '/mentions-legales': 'Mentions légales — Akoubri',
  '/confidentialite': 'Politique de confidentialité — Akoubri',
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
          <Route path="/journal" element={<Blog />} />
          <Route path="/journal/:slug" element={<BlogDetail />} />
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
  const navigationType = useNavigationType();

  useEffect(() => {
    /* Only reset for real navigations. On POP (back/forward) the browser
       restores the previous offset, which is what the user expects there. */
    if (navigationType === 'POP') return;

    /* `html { scroll-behavior: smooth }` applies to programmatic scrolls too,
       so a plain scrollTo would animate the whole page height back up — long
       enough that the new page reads as "nothing happened". `behavior:
       'instant'` overrides the CSS and lands at the top immediately. */
    const jump = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    jump();
    /* Browsers restore the scroll offset asynchronously, after this effect
       runs, so a single call can be undone. Re-assert on the next frame. */
    const frame = requestAnimationFrame(jump);

    let title = TITLES[pathname];
    if (!title && pathname.startsWith('/projets/')) {
      const project = getProject(pathname.split('/')[2]);
      title = project ? `${project.name} — Akoubri` : 'Projet — Akoubri';
    }
    if (!title && pathname.startsWith('/journal/')) {
      const post = getPost(pathname.split('/')[2]);
      title = post ? `${post.title} — Akoubri` : 'Journal — Akoubri';
    }
    document.title = title || 'Akoubri';

    return () => cancelAnimationFrame(frame);
  }, [pathname, navigationType]);

  return null;
}
