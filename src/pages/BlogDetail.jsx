import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { formatDate, getPost, sortedPosts } from '../data/posts';
import { useReveal } from '../hooks/useReveal';
import { useInkFill } from '../hooks/useInkFill';
import PostCard from '../components/PostCard';
import Lightbox from '../components/Lightbox';

/* ── Journal detail ─────────────────────────────────────────────────────
   Reading layout rather than the two-column gallery used by a project:

     ┌───────────────────────────────────┐
     │ meta + title, centred, max 3xl    │
     │ full-bleed cover (top-rounded)    │
     ├──────────┬────────────────────────┤
     │ sticky   │ article prose, 68ch    │
     │ summary  │                        │
     └──────────┴────────────────────────┘
     followed by "à lire ensuite".

   Prose is capped near 68ch because a measure wider than that is the main
   reason long-form pages on portfolio sites go unread.                   */
export default function BlogDetail() {
  const { slug } = useParams();
  const post = getPost(slug);

  const ink = useInkFill({ play: true });
  // Index into `gallery`, or null when closed. Declared above the early
  // return below so hook order stays stable across renders.
  const [lightbox, setLightbox] = useState(null);

  /* Cover first, then every image in the body, so the reader can page
     through the article's pictures without leaving the lightbox. */
  const gallery = useMemo(() => {
    if (!post) return [];
    const imgs = [{ src: post.cover, alt: post.title }];
    post.body.forEach((b) => {
      if (b.kind === 'image') imgs.push({ src: b.src, alt: b.alt, caption: b.caption });
    });
    return imgs;
  }, [post]);

  useReveal([slug]);

  if (!post) return <Navigate to="/journal" replace />;

  const idx = sortedPosts.findIndex((p) => p.slug === slug);
  // The next two posts in date order, wrapping around the end of the list.
  const related = Array.from(
    { length: Math.min(2, sortedPosts.length - 1) },
    (_, i) => sortedPosts[(idx + 1 + i) % sortedPosts.length]
  );

  // Headings become the in-page summary, so a long read is scannable.
  const headings = post.body.filter((b) => b.kind === 'h2').map((b) => b.text);

  return (
    <>
    <article className="zv pt-24 sm:pt-28 md:pt-32">
      <div className="shell">
        <Link
          to="/journal"
          className="zv-small zv-muted -my-2 inline-flex min-h-[44px] items-center gap-2 py-2 transition-opacity hover:opacity-70"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M13 8H3M7 4L3 8l4 4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Tous les articles
        </Link>

        {/* Title block */}
        <header data-reveal className="reveal mx-auto mt-8 max-w-3xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="zv-small font-medium text-[var(--zv-primary)]">{post.category}</span>
            <span aria-hidden="true" className="zv-small text-[var(--zv-gray-100)]">·</span>
            <time dateTime={post.date} className="zv-small text-[var(--zv-gray-400)]">
              {formatDate(post.date)}
            </time>
            <span aria-hidden="true" className="zv-small text-[var(--zv-gray-100)]">·</span>
            <span className="zv-small text-[var(--zv-gray-400)]">
              {post.readingTime} min de lecture
            </span>
          </div>
          <h1 ref={ink} className="zv-h2 mt-6">{post.title}</h1>
          <p className="zv-lead zv-muted mx-auto mt-6 max-w-2xl">{post.excerpt}</p>
        </header>

        {/* Cover — deliberately NOT data-reveal. It is the LCP element and it
            sits just below the fold on a laptop, where a tall block can be
            only partially intersecting at load; gating it on the observer
            leaves the article looking empty until the reader scrolls. */}
        <button
          type="button"
          onClick={() => setLightbox(0)}
          aria-label={`${post.title} — agrandir l'image`}
          className="m3-lb-open mt-12 rounded-t-[24px] bg-[var(--zv-bg-alt)] md:mt-16"
        >
          <img
            src={post.cover}
            alt={post.title}
            width="1280"
            height="853"
            fetchpriority="high"
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]"
          />
        </button>

        {/* Body */}
        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* Sticky summary. aria-hidden is wrong here — these are real
              in-page links — so it stays in the tree, but it is ordered
              after the article on mobile via CSS order. */}
          <aside
            data-reveal
            className="reveal order-2 lg:order-1 lg:sticky lg:top-28 lg:self-start"
          >
            <div className="border-t border-[var(--zv-border)] pt-6">
              {/* `.zv h2` styles bare headings with the display face at
                  --zv-h2. A Tailwind utility cannot win that: index.css
                  (which emits @tailwind utilities) is imported BEFORE
                  zenvira.css, so at equal specificity zenvira always wins.
                  This is a caption rather than a display heading, so the
                  type is pinned inline while the h2 keeps the outline
                  semantics for assistive tech. */}
              <h2
                className="font-medium"
                style={{
                  fontFamily: 'var(--zv-body)',
                  fontSize: 'var(--zv-p-sm)',
                  lineHeight: 1.5,
                  textTransform: 'none',
                  letterSpacing: 0,
                }}
              >
                Au sommaire
              </h2>
              <ol className="mt-5 space-y-3">
                {headings.map((h, i) => (
                  <li key={h} className="flex gap-3">
                    <span className="zv-small shrink-0 text-[var(--zv-gray-100)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <a
                      href={`#section-${i}`}
                      className="zv-small zv-muted transition-colors hover:text-[var(--zv-primary)]"
                    >
                      {h}
                    </a>
                  </li>
                ))}
              </ol>

              <div className="mt-8 border-t border-[var(--zv-border)] pt-6">
                <p className="zv-small zv-muted">
                  Un projet en tête&nbsp;? Nous répondons sous 48&nbsp;heures
                  ouvrées.
                </p>
                <Link to="/contact" className="zv-btn zv-btn-outline mt-5 w-full">
                  Nous écrire
                </Link>
              </div>
            </div>
          </aside>

          <div className="order-1 max-w-[68ch] lg:order-2">
            <Body blocks={post.body} onOpen={setLightbox} />
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="zv-section">
        <div className="shell">
          <div data-reveal className="reveal zv-section-head">
            <span className="zv-subtitle">Poursuivre</span>
            <h2 className="zv-h2 mt-5">À lire ensuite</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {related.map((p, i) => (
              <PostCard key={p.slug} post={p} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>
    </article>

    {lightbox !== null && (
      <Lightbox
        images={gallery.map((g) => g.src)}
        index={lightbox}
        alt={gallery[lightbox]?.alt || post.title}
        caption={gallery[lightbox]?.caption}
        onClose={() => setLightbox(null)}
        onChange={setLightbox}
      />
    )}
    </>
  );
}

/* Block renderer. `h2Index` counts only headings so anchor ids stay stable
   and match the summary above, regardless of what sits between them. */
function Body({ blocks, onOpen }) {
  let h2Index = -1;
  // Gallery index 0 is the cover, so body images start at 1 — counted in
  // the same order the gallery was built.
  let imgIndex = 0;

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'h2': {
            h2Index += 1;
            return (
              <h2
                key={i}
                id={`section-${h2Index}`}
                data-reveal
                className="reveal zv-h4 scroll-mt-28 pt-6"
              >
                {block.text}
              </h2>
            );
          }

          case 'p':
            return (
              <p key={i} data-reveal className="reveal zv-body zv-muted">
                {block.text}
              </p>
            );

          case 'list':
            return (
              <ul key={i} data-reveal className="reveal space-y-3 py-2">
                {block.items.map((item) => (
                  <li key={item} className="zv-body zv-muted flex items-start gap-4">
                    <span className="mt-[0.7em] h-px w-4 shrink-0 bg-[var(--zv-primary)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case 'quote':
            return (
              <blockquote
                key={i}
                data-reveal
                className="reveal my-4 border-l-2 border-[var(--zv-primary)] py-2 pl-6"
              >
                <p className="zv-h5">{block.text}</p>
              </blockquote>
            );

          case 'image': {
            imgIndex += 1;
            const at = imgIndex;
            return (
              <figure key={i} data-reveal className="reveal my-8">
                <button
                  type="button"
                  onClick={() => onOpen(at)}
                  aria-label={`${block.alt} — agrandir l'image`}
                  className="m3-lb-open rounded-t-[24px] bg-[var(--zv-bg-alt)]"
                >
                  <img
                    src={block.src}
                    alt={block.alt}
                    loading="lazy"
                    width="1280"
                    height="853"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
                {block.caption && (
                  <figcaption className="zv-small mt-3 text-[var(--zv-gray-400)]">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
