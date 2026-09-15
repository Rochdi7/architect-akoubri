import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { spatialProjects } from '../../data/spatialStories';
import { detectEnvironment, supportsWebGL } from './environment';
import ElevationFallback from './ElevationFallback';
import ProjectSelector from './ProjectSelector';
import ProjectInfo from './ProjectInfo';
import './SpatialStories.css';

/* Spatial Stories — five of the studio's projects as massing models on a
   plinth, presented as in a design review. The section pins for a little
   over a viewport of scroll; over that scroll the camera follows each
   project's own narrative and its phase-2 pieces are set down (see
   scene/ArchitectureScene.js and data/spatialStories).

   Layers, bottom to top:
     .ss-grid     a faint drafting grid on the paper ground (CSS only)
     .ss-canvas   the WebGL canvas, and over it the SVG elevation that
                  stands in until the chunk has loaded — or for good when
                  there is no usable WebGL
     .ss-ui       the HTML: viewpoint markers, label, counter, project
                  list, title block, CTA

   The three.js chunk is only requested once the section is within 600px of
   the viewport, and the frame loop only runs while the stage is on screen.
   Under prefers-reduced-motion the section does not pin, the camera does not
   move and each study is shown complete, at rest.                          */

const pad = (n) => String(n).padStart(2, '0');
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);

export default function SpatialStories({ projects = spatialProjects, headingTag: H = 'h2' }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const envRef = useRef(null);
  const inViewRef = useRef(false);
  const progressRef = useRef(0);
  const activeRef = useRef(projects[0]);

  const [activeId, setActiveId] = useState(projects[0].id);
  const [shownId, setShownId] = useState(projects[0].id);
  const [switching, setSwitching] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | fallback
  const [viewId, setViewId] = useState(null); // the viewpoint the visitor stands in
  const spotRefs = useRef({});

  const active = projects.find((p) => p.id === activeId) || projects[0];
  const shown = projects.find((p) => p.id === shownId) || active;
  const index = projects.indexOf(shown);
  activeRef.current = active;
  const views = shown.views || [];
  const view = views.find((v) => v.id === viewId) || null;

  /* ── Environment, scroll progress, visibility, resize, pointer ── */
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const wrap = wrapRef.current;
    if (!section || !stage || !wrap) return undefined;

    const env = detectEnvironment();
    envRef.current = env;
    section.dataset.tier = env.tier;

    let ticking = false;
    let lastP = -1;
    const measure = () => {
      const rect = section.getBoundingClientRect();
      const room = rect.height - stage.clientHeight;
      return room > 4 ? clamp01(-rect.top / room) : 1;
    };
    const apply = () => {
      ticking = false;
      const p = env.reduced ? 1 : measure();
      if (p === lastP) return;
      lastP = p;
      progressRef.current = p;
      section.style.setProperty('--ss-p', p.toFixed(3));
      sceneRef.current?.setProgress(p);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    apply();

    const vis = () => sceneRef.current?.setVisible(inViewRef.current && !document.hidden);
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        vis();
      },
      { threshold: 0 }
    );
    io.observe(stage);
    document.addEventListener('visibilitychange', vis);

    const ro = new ResizeObserver(() => {
      sceneRef.current?.resize(wrap.clientWidth, wrap.clientHeight);
      onScroll();
    });
    ro.observe(wrap);

    const onMove = (e) => {
      if (!inViewRef.current) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      sceneRef.current?.setPointer(x, y);
      section.style.setProperty('--ss-mx', x.toFixed(3));
      section.style.setProperty('--ss-my', y.toFixed(3));
    };
    const parallax = env.pointerFine && !env.reduced;
    if (parallax) window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('visibilitychange', vis);
      if (parallax) window.removeEventListener('pointermove', onMove);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  /* ── Lazy scene ── */
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return undefined;
    if (!supportsWebGL()) {
      setStatus('fallback');
      return undefined;
    }

    let cancelled = false;
    let scene = null;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setStatus('loading');
        import('./scene/ArchitectureScene')
          .then(({ createScene }) => {
            if (cancelled) return;
            const env = envRef.current || detectEnvironment();
            scene = createScene(canvas, {
              tier: env.tier,
              reducedMotion: env.reduced,
              onSwap: (p) => {
                setShownId(p.id);
                setSwitching(false);
              },
              // 'ready' hides the drawing; wait for the first frame drawn
              // on screen so the model rises out of it.
              onFirstFrame: () => {
                if (!cancelled) setStatus('ready');
              },
              // Marker positions come straight from the frame loop and go
              // straight to the DOM: no React render per frame.
              onMarkers: (list) => {
                list.forEach((m) => {
                  const el = spotRefs.current[m.id];
                  if (!el) return;
                  el.style.left = `${m.x}px`;
                  el.style.top = `${m.y}px`;
                  el.dataset.on = m.visible ? 'true' : 'false';
                });
              },
            });
            sceneRef.current = scene;
            const wrap = wrapRef.current;
            scene.resize(wrap.clientWidth, wrap.clientHeight);
            scene.setProgress(progressRef.current);
            scene.setProject(activeRef.current);
            scene.setVisible(inViewRef.current && !document.hidden);
          })
          .catch(() => {
            if (!cancelled) setStatus('fallback');
          });
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(section);

    return () => {
      cancelled = true;
      io.disconnect();
      sceneRef.current = null;
      if (scene) scene.dispose();
    };
  }, []);

  /* ── Viewpoints: step in, step out (Escape, or a project change) ── */
  useEffect(() => {
    sceneRef.current?.setView(view);
  }, [view]);

  useEffect(() => {
    setViewId(null);
  }, [activeId]);

  useEffect(() => {
    if (!viewId) return undefined;
    const wrap = wrapRef.current;
    const onKey = (e) => {
      if (e.key === 'Escape') setViewId(null);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        if (e.target instanceof HTMLElement && e.target.closest('.ss-nav')) return;
        e.preventDefault();
        sceneRef.current?.lookBy(e.key === 'ArrowLeft' ? -0.22 : 0.22, 0);
      }
    };
    // Drag on the stage to look around: left/right mostly, a little up/down.
    let drag = null;
    const down = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, moved: false };
      wrap.setPointerCapture?.(e.pointerId);
      wrap.dataset.grab = 'true';
    };
    const move = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 1) drag.moved = true;
      sceneRef.current?.lookBy(-dx * 0.0045, -dy * 0.003);
    };
    const up = (e) => {
      if (!drag) return;
      drag = null;
      wrap.releasePointerCapture?.(e.pointerId);
      delete wrap.dataset.grab;
    };
    window.addEventListener('keydown', onKey);
    wrap.addEventListener('pointerdown', down);
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerup', up);
    wrap.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('keydown', onKey);
      wrap.removeEventListener('pointerdown', down);
      wrap.removeEventListener('pointermove', move);
      wrap.removeEventListener('pointerup', up);
      wrap.removeEventListener('pointercancel', up);
      delete wrap.dataset.grab;
    };
  }, [viewId]);

  /* The on-screen arrows: a tap turns a step, a press keeps turning. */
  const turnRef = useRef(0);
  const turnStop = () => {
    if (turnRef.current) cancelAnimationFrame(turnRef.current);
    turnRef.current = 0;
  };
  const turnStart = (dir) => {
    turnStop();
    let t0 = 0;
    const tick = (now) => {
      if (!t0) t0 = now;
      if (now - t0 > 220) sceneRef.current?.lookBy(dir * 0.028, 0);
      turnRef.current = requestAnimationFrame(tick);
    };
    turnRef.current = requestAnimationFrame(tick);
  };
  const turnTap = (dir) => {
    turnStop();
    sceneRef.current?.lookBy(dir * 0.3, 0);
  };
  useEffect(() => turnStop, []);

  /* ── Project change ── */
  useEffect(() => {
    if (shownId === activeId) return undefined;
    const scene = sceneRef.current;
    if (scene) {
      setSwitching(true);
      scene.setProject(active); // onSwap swaps the copy at the right beat
      return undefined;
    }
    // No scene (yet): the drawing swaps on a short CSS beat instead.
    setSwitching(true);
    const t = setTimeout(() => {
      setShownId(activeId);
      setSwitching(false);
    }, 320);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const total = projects.length;

  return (
    <section
      ref={sectionRef}
      id="spatial-stories"
      className="zv ss"
      aria-labelledby="ss-heading"
      data-status={status}
      data-view={view ? view.id : undefined}
    >
      <div ref={stageRef} className="ss-stage">
        <div className="ss-grid" aria-hidden="true" />

        <div ref={wrapRef} className="ss-canvas">
          <canvas ref={canvasRef} className="ss-gl" aria-hidden="true" />
          <div className={`ss-drawing${status === 'ready' ? ' is-hidden' : ''}`}>
            <ElevationFallback project={shown} />
          </div>
        </div>

        <div className="ss-ui">
          {status === 'ready' && (
            <div className="ss-spots">
              {views.map((v) => (
                <button
                  key={`${shown.id}-${v.id}`}
                  ref={(el) => {
                    spotRefs.current[v.id] = el;
                  }}
                  type="button"
                  className="ss-spot"
                  data-on="false"
                  aria-label={`Entrer : ${v.label}`}
                  onClick={() => setViewId(v.id)}
                >
                  <span className="ss-spot-dot" aria-hidden="true" />
                  <span className="ss-spot-label" aria-hidden="true">
                    {v.label}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="shell ss-ui-inner">
            <header className="ss-top">
              <div>
                <H id="ss-heading" className="ss-label">
                  Spatial Stories
                </H>
                <p className="ss-lede">
                  Cinq projets du studio, modélisés à l&apos;échelle et présentés comme en revue de projet.
                </p>
              </div>
              <p className="ss-counter" aria-hidden="true">
                <span className="ss-counter-n">{pad(index + 1)}</span>
                <span className="ss-counter-sep">/</span>
                <span>{pad(total)}</span>
              </p>
              <p className="sr-only" aria-live="polite">
                {`Projet ${index + 1} sur ${total} : ${shown.title}${shown.subtitle ? `, ${shown.subtitle}` : ''}${view ? ` — ${view.label}` : ''}`}
              </p>
            </header>

            <ProjectSelector projects={projects} activeId={activeId} onSelect={setActiveId} />

            <footer className="ss-bottom">
              <ProjectInfo project={shown} switching={switching} />
              <div className="ss-actions">
                {view && (
                  <button type="button" className="ss-exit" onClick={() => setViewId(null)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Retour à la maquette
                  </button>
                )}
                <Link to={shown.href} className={`ss-cta${switching ? ' is-switching' : ''}`}>
                  Explorer le projet
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </footer>

            <p className="ss-hint" aria-hidden="true">
              <span className="ss-hint-line" />
              Faites défiler
            </p>

            {view && (
              <div className="ss-look" role="group" aria-label="Regarder autour">
                <button
                  type="button"
                  className="ss-look-btn"
                  aria-label="Regarder à gauche"
                  onClick={() => turnTap(-1)}
                  onPointerDown={() => turnStart(-1)}
                  onPointerUp={turnStop}
                  onPointerLeave={turnStop}
                  onPointerCancel={turnStop}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span className="ss-look-label" aria-hidden="true">
                  Glissez pour regarder autour
                </span>
                <button
                  type="button"
                  className="ss-look-btn"
                  aria-label="Regarder à droite"
                  onClick={() => turnTap(1)}
                  onPointerDown={() => turnStart(1)}
                  onPointerUp={turnStop}
                  onPointerLeave={turnStop}
                  onPointerCancel={turnStop}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
