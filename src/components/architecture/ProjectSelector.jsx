import { useRef } from 'react';

const pad = (n) => String(n).padStart(2, '0');

/* The list of projects. Plain buttons — tab order, Enter and Space come for
   free — with the arrow keys added so the list behaves like the index of
   an exhibition catalogue: up/down (or left/right on a phone) move through
   the projects and show each one as they go. */
export default function ProjectSelector({ projects, activeId, onSelect }) {
  const refs = useRef([]);

  const onKeyDown = (e, i) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    const step = keys[e.key];
    let next = null;
    if (step) next = (i + step + projects.length) % projects.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = projects.length - 1;
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
    onSelect(projects[next].id);
  };

  return (
    <nav className="ss-nav" aria-label="Choisir un projet">
      <ol className="ss-nav-list">
        {projects.map((p, i) => {
          const active = p.id === activeId;
          return (
            <li key={p.id}>
              <button
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                className="ss-nav-item"
                aria-current={active ? 'true' : undefined}
                aria-label={`${pad(i + 1)} — ${p.navTitle || p.title}`}
                onClick={() => onSelect(p.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <span className="ss-nav-num" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <span className="ss-nav-title" aria-hidden="true">
                  {p.navTitle || p.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
