import { useEffect, useId, useRef, useState } from 'react';

/**
 * Select — a listbox that replaces the native <select>.
 *
 * The native control cannot be styled where it matters: the open list is
 * drawn by the OS, so the selected row arrives as a hard system blue no
 * matter what CSS the page sets on <option>. This is the standard ARIA
 * listbox pattern, which puts the popup in the document where the clay
 * palette applies.
 *
 * The trade the native control makes for us and this one has to make by
 * hand: focus management, type-ahead, and the full keyboard map. On
 * touch the popup is a bottom sheet, since a dropdown anchored to a
 * field near the fold would open off-screen.
 */
export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Sélectionner…',
  name,
  id,
  invalid,
  describedBy,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const buttonRef = useRef(null);
  const typeahead = useRef({ term: '', at: 0 });
  const autoId = useId();
  const listId = `${id || autoId}-list`;

  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const selected = items.findIndex((o) => o.value === value);
  const current = selected >= 0 ? items[selected] : null;

  /* Opening lands the highlight on the current value, or the first row. */
  const openList = (index) => {
    if (disabled) return;
    setActive(index ?? (selected >= 0 ? selected : 0));
    setOpen(true);
  };

  const close = (refocus = true) => {
    setOpen(false);
    setActive(-1);
    if (refocus) buttonRef.current?.focus();
  };

  const commit = (index) => {
    const item = items[index];
    if (!item) return;
    onChange(item.value);
    close();
  };

  /* Pointer down outside, rather than click, so the list closes before a
     click on another field can land — otherwise focus fights the popup. */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) close(false);
    };

    /* On desktop the popup is anchored under the button, so a scroll that
       moves the button leaves it stranded. The sheet is fixed-position and
       has a scrim over the page, so there is nothing to chase there — and
       closing on scroll would dismiss it the moment a touch drag begins. */
    const anchored = !window.matchMedia('(max-width: 639px)').matches;
    const onScroll = (e) => {
      if (listRef.current?.contains(e.target)) return; // reading the list
      close(false);
    };
    const onResize = () => close(false);

    document.addEventListener('pointerdown', onPointerDown);
    if (anchored) window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  /* While the sheet is up, the page behind it must not scroll away under
     the user's thumb. Desktop keeps its scrollbar — locking there would
     shift the layout as the gutter disappears. */
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 639px)').matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* Keep the highlighted row in view when arrowing past the fold. */
  useEffect(() => {
    if (!open || active < 0) return;
    const el = listRef.current?.children[active];
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const onKeyDown = (e) => {
    const last = items.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) return openList(selected >= 0 ? selected : 0);
        return setActive((i) => (i >= last ? 0 : i + 1));

      case 'ArrowUp':
        e.preventDefault();
        if (!open) return openList(selected >= 0 ? selected : last);
        return setActive((i) => (i <= 0 ? last : i - 1));

      case 'Home':
        if (!open) return;
        e.preventDefault();
        return setActive(0);

      case 'End':
        if (!open) return;
        e.preventDefault();
        return setActive(last);

      case 'Enter':
        if (!open) return; // let the form submit
        e.preventDefault();
        return commit(active);

      case ' ':
        e.preventDefault();
        return open ? commit(active) : openList();

      case 'Escape':
        if (!open) return;
        e.preventDefault();
        return close();

      case 'Tab':
        // Tabbing away commits nothing and closes, matching the native.
        if (open) close(false);
        return;

      default:
        break;
    }

    /* Type-ahead: printable keys jump to the next match, and repeated
       taps of one letter cycle through the entries starting with it. */
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now();
      const t = typeahead.current;
      t.term = now - t.at > 700 ? e.key : t.term + e.key;
      t.at = now;

      const term = t.term.toLowerCase();
      const from = (open ? active : selected) + 1;
      const order = [...items.slice(from), ...items.slice(0, from)];
      const hit = order.find((o) => o.label.toLowerCase().startsWith(term));

      if (hit) {
        const index = items.indexOf(hit);
        if (open) setActive(index);
        else onChange(hit.value);
      }
    }
  };

  return (
    <div className="zv-select" ref={rootRef} data-open={open || undefined}>
      {/* The real value, so an uncontrolled form post still carries it. */}
      {name && <input type="hidden" name={name} value={value || ''} />}

      <button
        type="button"
        ref={buttonRef}
        id={id}
        disabled={disabled}
        className="zv-field zv-select-button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-invalid={invalid ? 'true' : undefined}
        aria-describedby={describedBy}
        data-placeholder={current ? undefined : ''}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
      >
        <span className="zv-select-value">{current ? current.label : placeholder}</span>
        <Chevron />
      </button>

      {open && (
        <>
          {/* Scrim, touch only — the sheet needs a ground to sit against. */}
          <div className="zv-select-scrim" onClick={() => close(false)} aria-hidden="true" />

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            className="zv-select-list"
          >
            {items.map((o, i) => (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === selected}
                data-active={i === active || undefined}
                className="zv-select-option"
                /* Pointer down, not click: mousedown would otherwise blur
                   the button and close the list before the click lands. */
                onPointerDown={(e) => {
                  e.preventDefault();
                  commit(i);
                }}
                onPointerEnter={() => setActive(i)}
              >
                <span>{o.label}</span>
                {i === selected && <Check />}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Chevron() {
  return (
    <svg
      className="zv-select-chevron"
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 1.5L6 6.5l5-5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
