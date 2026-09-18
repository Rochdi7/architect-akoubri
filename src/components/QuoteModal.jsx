import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ContactForm from './ContactForm';
import { business } from '../data/business';

/* ── Quote dialog ───────────────────────────────────────────────────────
   The header's "Demander un devis" opens the full enquiry form in place
   rather than navigating to /contact — the mission list is the point of
   the button, and a route change loses whatever the reader was looking at.

   It reuses ContactForm at full width (not `compact`): compact drops the
   mission and budget controls, which are exactly what this dialog exists
   to collect.

   Behaviour is borrowed wholesale from Lightbox — portal onto <body>,
   Escape to close, focus trapped while open and returned to the opener,
   body scroll locked without the layout shifting as the scrollbar goes.
   The panel swings in on rotateX from a perspective on the backdrop, the
   same vocabulary the lightbox uses, so the two read as one system.

   The portal matters here for the same reason it does in Select: the
   header sits under a `transition-transform` ancestor, and any transformed
   ancestor becomes the containing block for `position: fixed`.           */

export default function QuoteModal({ open, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  const [entered, setEntered] = useState(false);

  /* Remember the opener and play the swing in. Focus goes to the close
     button rather than the first field: landing directly in a text input
     pops the software keyboard on a phone before the reader has seen the
     dialog at all. */
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement;
    const raf = requestAnimationFrame(() => setEntered(true));
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      cancelAnimationFrame(raf);
      setEntered(false);
      const opener = openerRef.current;
      if (opener && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        /* The Select listbox inside handles its own Escape and stops
           there; if one is open this never fires, so closing the dropdown
           does not also close the dialog. */
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])'
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

    /* Lock scroll without the layout shifting as the scrollbar disappears.
       overflowY, not the `overflow` shorthand: the shorthand would
       overwrite the `overflow-x: clip` index.css sets deliberately, and
       making body a scroll container kills `position: sticky` on every
       descendant while the dialog is open. */
    const { overflowY, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflowY = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflowY = overflowY;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open, onClose]);

  if (!open) return null;

  const node = (
    <div
      className={`zv zv-quote ${entered ? 'zv-quote-in' : ''}`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="zv-quote-title"
        className="zv-quote__panel"
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          ref={closeRef}
          onClick={onClose}
          aria-label="Fermer"
          className="zv-quote__close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="zv-quote__head">
          <p className="zv-quote__eyebrow">Akoubri</p>
          <h2 id="zv-quote-title" className="zv-h3 zv-quote__title">Demander un devis</h2>
          <p className="zv-quote__lede">
            Décrivez votre projet en quelques lignes. Nous revenons vers vous sous 48 heures ouvrées.
          </p>
        </div>

        <div className="zv-quote__body">
          <ContactForm submitLabel="Envoyer ma demande" />

          <p className="zv-quote__foot">
            Ou écrivez-nous directement à{' '}
            <a href={`mailto:${business.email}`}>{business.email}</a>
            {' · '}
            <a href={business.phoneHref}>{business.phone}</a>
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
