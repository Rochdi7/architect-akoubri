import { useInkFill } from '../hooks/useInkFill';

/* InkTitle — a display heading that inks itself in (useInkFill), so every
   page title on the site shares the one signature animation without each
   page having to allocate a ref per heading.

     <InkTitle as="h1" play className="zv-h1">Projets</InkTitle>

   `play` for a title already on screen at load (a hero); omit it for a
   section heading the reader scrolls down to. `dark` for a title on a navy
   ground: it swaps the pencil grey for a tone that reads as pencil on dark
   (see .m3-ink-dark in zenvira.css). Everything else passes straight to the
   heading element, so data-reveal and classes work as before. */
export default function InkTitle({ as: Tag = 'h2', play = false, dark = false, className = '', ...props }) {
  const ink = useInkFill({ play });
  const cls = dark ? `${className} m3-ink-dark`.trim() : className;
  return <Tag ref={ink} className={cls} {...props} />;
}
