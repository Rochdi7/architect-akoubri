import { useEffect } from 'react';

/* ── useFaqSchema ───────────────────────────────────────────────────────
   Emits a page's FAQ as FAQPage JSON-LD in <head>, without rendering it.

   The owner removed every visible FAQ on 2026-09-25 but wants the
   questions kept for search engines and AI crawlers. The text stays the
   studio's own answers, unchanged, so nothing is claimed that the site
   does not stand behind. A JSON-LD data block is not executed, so the
   script-src hash in .htaccess does not apply to it. The block is removed
   on unmount so the next route does not inherit it.                     */
export function useFaqSchema(items) {
  useEffect(() => {
    if (!items?.length) return undefined;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    });
    document.head.appendChild(el);
    return () => el.remove();
  }, [items]);
}

export default useFaqSchema;
