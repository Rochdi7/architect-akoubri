import { useLayoutEffect, useRef, useState } from 'react';

/* ── Accordion ──────────────────────────────────────────────────────────
   One-at-a-time FAQ list. Only a single item can be open: opening a new
   one closes the previous with the same height/opacity transition rather
   than snapping shut, so the list never jumps under the thumb.

   Kept on <details>/<summary> for semantics and no-JS fallback, but the
   `open` attribute is driven from React state — the native toggle is
   prevented so the browser cannot open two at once. The panel animates on
   max-height, measured per item, so each answer gets its own real height
   instead of a shared guess. */

function Item({ item, index, isOpen, onToggle, delay, renderIcon, summaryClass, bodyClass }) {
  const panelRef = useRef(null);
  const [maxH, setMaxH] = useState(0);

  // Re-measure on open and on resize: a long answer reflows to a different
  // height at another width, and a stale max-height would clip it.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;

    const measure = () => setMaxH(panel.scrollHeight);
    measure();

    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(panel);
    return () => ro.disconnect();
  }, [item.a]);

  // `open` stays set at the DOM level: the browser would otherwise hide the
  // panel the instant state flips, killing the collapse animation. The visual
  // open/closed state is data-open plus the panel max-height.
  return (
    <details
      data-reveal
      data-reveal-delay={delay}
      className="reveal zv-accordion group"
      data-open={isOpen ? 'true' : 'false'}
      open
    >
      <summary
        className={summaryClass}
        onClick={(e) => {
          // Own the toggle so state, not the browser, decides what is open.
          e.preventDefault();
          onToggle(index);
        }}
      >
        <span className="zv-h5">{item.q}</span>
        {renderIcon()}
      </summary>
      <div
        ref={panelRef}
        className="zv-accordion-panel"
        style={{ maxHeight: isOpen ? `${maxH}px` : 0 }}
      >
        <p className={bodyClass}>{item.a}</p>
      </div>
    </details>
  );
}

export default function Accordion({
  items,
  stagger = 60,
  summaryClass = 'flex cursor-pointer list-none items-center justify-between gap-5 p-6',
  bodyClass = 'zv-body zv-muted px-6 pb-6',
  renderIcon,
  className = 'space-y-4',
}) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className={className}>
      {items.map((f, i) => (
        <Item
          key={f.q}
          item={f}
          index={i}
          delay={i * stagger}
          isOpen={openIndex === i}
          onToggle={(idx) => setOpenIndex((cur) => (cur === idx ? null : idx))}
          renderIcon={renderIcon}
          summaryClass={summaryClass}
          bodyClass={bodyClass}
        />
      ))}
    </div>
  );
}
