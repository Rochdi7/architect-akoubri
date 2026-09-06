import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/* ── Image lightbox ─────────────────────────────────────────────────────
   Shared by the project gallery and the journal article. Arrow keys page
   through, Escape closes, body scroll is locked while it is open, and focus
   is trapped inside the dialog and returned to the opener on close.

   The 3D bit: the panel opens by swinging in on rotateX from a perspective
   set on the backdrop, and each paged image swings in on rotateY in the
   direction of travel. Both are plain CSS transitions on a class, not GSAP —
   the lightbox mounts on a click rather than on scroll, so it must not wait
   on the lazy motion chunk to become visible. With reduced motion the panel
   simply appears; nothing here is required to see the image.

   Rendered through a portal so the fixed backdrop is never trapped by an
   ancestor's transform or overflow.                                        */

const FLIP_MS = 420;

export default function Lightbox({ images, index, alt, onClose, onChange, caption }) {
  const many = images.length > 1;
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  // The element that had focus before opening, so it can be restored.
  const openerRef = useRef(null);

  // `entered` drives the open swing; `dir` re-keys the image so paging
  // remounts it and replays the rotateY swing in the travelled direction.
  const [entered, setEntered] = useState(false);
  const [dir, setDir] = useState(0);

  const go = useCallback(
    (step) => {
      if (!many) return;
      setDir(step);
      onChange((index + step + images.length) % images.length);
    },
    [index, images.length, many, onChange]
  );

  // Open: remember the opener, focus the close button, play the swing in.
  useEffect(() => {
    openerRef.current = document.activeElement;
    const raf = requestAnimationFrame(() => setEntered(true));
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      cancelAnimationFrame(raf);
      const opener = openerRef.current;
      if (opener && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key !== 'Tab') return;
      // Focus trap: the dialog is the whole UI while it is open.
      const focusables = panelRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);

    // Lock scroll without the layout shifting as the scrollbar disappears.
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [go, onClose]);

  const node = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className={`zv m3-lb ${entered ? 'm3-lb-in' : ''}`}
      onClick={onClose}
    >
      <div className="m3-lb__panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          ref={closeRef}
          onClick={onClose}
          aria-label="Fermer"
          className="m3-lb__close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <figure className="m3-lb__figure">
          <img
            // Re-keyed per image so each page swings in rather than swapping.
            key={index}
            src={images[index]}
            alt={alt}
            className={`m3-lb__img ${dir > 0 ? 'from-right' : dir < 0 ? 'from-left' : ''}`}
            style={{ '--m3-lb-flip': `${FLIP_MS}ms` }}
          />
          {(caption || many) && (
            <figcaption className="m3-lb__cap">
              {caption}
              {caption && many ? ' · ' : ''}
              {many ? `${index + 1} / ${images.length}` : ''}
            </figcaption>
          )}
        </figure>

        {/* On a phone this row sits under the image; from `sm` up the CSS
            makes it `display: contents` so the buttons position themselves
            against the viewport edges instead. */}
        {many && (
          <div className="m3-lb__navrow">
            <NavBtn side="left" onClick={() => go(-1)} />
            <NavBtn side="right" onClick={() => go(1)} />
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

function NavBtn({ side, onClick }) {
  const isLeft = side === 'left';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? 'Image précédente' : 'Image suivante'}
      className={`m3-lb__nav ${isLeft ? 'is-left' : 'is-right'}`}
    >
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d={isLeft ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
