import { useEffect } from 'react';

/* ── usePageMeta ────────────────────────────────────────────────────────
   Per-route <meta> maintenance.

   Titles are set centrally in App.jsx, but description/canonical/og were
   previously written once in index.html and therefore identical on every
   route. This hook lets a page own its own description and canonical.

   It writes into the existing tags where index.html already provides them
   and creates the tag only when it is missing, so the static markup stays
   the source of truth for anything a page does not override. On unmount
   the previous value is restored — without that, navigating from a page
   that sets a description to one that does not would leave the former
   page's text in place.

   No SSR layer exists, so this runs after hydration: it is for users and
   for crawlers that execute JS, not a substitute for prerendering.      */

const SITE = 'https://akoubri.com';

function upsert(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

export function usePageMeta({ description, canonical } = {}) {
  useEffect(() => {
    const restore = [];

    if (description) {
      const tags = [
        upsert('meta[name="description"]', () => {
          const m = document.createElement('meta');
          m.setAttribute('name', 'description');
          return m;
        }),
        upsert('meta[property="og:description"]', () => {
          const m = document.createElement('meta');
          m.setAttribute('property', 'og:description');
          return m;
        }),
      ];

      tags.forEach((tag) => {
        restore.push([tag, tag.getAttribute('content')]);
        tag.setAttribute('content', description);
      });
    }

    if (canonical) {
      const href = canonical.startsWith('http') ? canonical : `${SITE}${canonical}`;

      const link = upsert('link[rel="canonical"]', () => {
        const l = document.createElement('link');
        l.setAttribute('rel', 'canonical');
        return l;
      });
      restore.push([link, link.getAttribute('href')]);
      link.setAttribute('href', href);

      const og = upsert('meta[property="og:url"]', () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:url');
        return m;
      });
      restore.push([og, og.getAttribute('content')]);
      og.setAttribute('content', href);
    }

    return () => {
      restore.forEach(([el, value]) => {
        const attr = el.tagName === 'LINK' ? 'href' : 'content';
        if (value === null) el.removeAttribute(attr);
        else el.setAttribute(attr, value);
      });
    };
  }, [description, canonical]);
}

export default usePageMeta;
