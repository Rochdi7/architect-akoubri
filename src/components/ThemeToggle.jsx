import { useId } from 'react';
import { toggleTheme } from '../lib/theme';
import { useTheme } from '../hooks/useTheme';

/**
 * Jour / nuit switch.
 *
 * One drawing does both states: the sun's disc grows, a second circle slides
 * across it as a mask and bites the crescent out, and the rays wind in behind
 * it. All of it is driven from <html data-theme> in CSS (see "Theme toggle"
 * in index.css), not from React state — the page reveal is a view transition,
 * and the browser captures the new frame before React would have re-rendered,
 * so a state-driven icon would still show the old theme in that frame.
 *
 * `compact` is the round icon button for the phone pill; the default is the
 * sliding switch used in the desktop pill. The mask id is namespaced because
 * the header mounts both at once.
 */
export default function ThemeToggle({ compact = false, className = '' }) {
  const theme = useTheme();
  const uid = useId().replace(/:/g, '');
  const dark = theme === 'dark';

  const onClick = (e) => {
    // The reveal grows out of the thumb. A keyboard activation reports 0,0,
    // so fall back to the control's own centre.
    const r = e.currentTarget.getBoundingClientRect();
    const pointer = e.clientX || e.clientY;
    toggleTheme({
      x: pointer ? e.clientX : r.left + r.width / 2,
      y: pointer ? e.clientY : r.top + r.height / 2,
    });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Mode nuit"
      title={dark ? 'Passer en mode jour' : 'Passer en mode nuit'}
      onClick={onClick}
      className={`theme-toggle ${compact ? 'theme-toggle--compact' : ''} ${className}`}
    >
      {!compact && (
        <span className="theme-toggle__sky" aria-hidden="true">
          <i /><i /><i />
        </span>
      )}
      <span className="theme-toggle__thumb" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <mask id={`${uid}-bite`}>
            <rect width="24" height="24" fill="#fff" />
            <circle className="theme-toggle__bite" cx="12" cy="12" r="7.2" fill="#000" />
          </mask>
          {/* The mask sits on a wrapper, not on the disc: a mask is resolved
              in the space of the element that references it, so on the disc
              itself it would be scaled along with it and the bite would
              never land where the CSS puts it. */}
          <g mask={`url(#${uid}-bite)`}>
            <circle className="theme-toggle__disc" cx="12" cy="12" r="5" fill="currentColor" />
          </g>
          <g
            className="theme-toggle__rays"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M12 1.6v2.6M12 19.8v2.6M1.6 12h2.6M19.8 12h2.6M4.65 4.65l1.85 1.85M17.5 17.5l1.85 1.85M4.65 19.35l1.85-1.85M17.5 6.5l1.85-1.85" />
          </g>
        </svg>
      </span>
    </button>
  );
}
