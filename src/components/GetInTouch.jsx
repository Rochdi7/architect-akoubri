import InkTitle from './InkTitle';
import ContactForm from './ContactForm';
import { projects } from '../data/projects';
import { useEnquiryDesk } from '../hooks/useEnquiryDesk';

/* ── Get in touch ───────────────────────────────────────────────────────
   The enquiry band that closes a page, above the footer. Reference
   layout: the form centred in its own column with project cards tilted
   into the margins on either side.

   It began as a section of Home and is shared so every page closes the
   same way — Services carried an older variant of its own (square cards, a
   second hand-rolled form with no validation or honeypot) and Permis had
   the form with no cards at all. Only the wording differs per page, so
   that is all the props expose.

   The flanking cards are decoration, so they are aria-hidden and sit
   behind the form (pointer-events: none) — they must never intercept a tap
   meant for a field. Below lg there is no margin to put them in, so they
   are dropped entirely rather than stacked: on a phone the form is the
   whole point of the section. */
const SPOTS = [
  'left-0 top-[12%] -rotate-[4deg] xl:left-[3%]',
  'right-0 top-[10%] rotate-[4deg] xl:right-[3%]',
  'left-0 bottom-[8%] rotate-[3deg] xl:left-[3%]',
  'right-0 bottom-[6%] -rotate-[3deg] xl:right-[3%]',
];

export default function GetInTouch({
  eyebrow = 'Parlons-en',
  title = 'Démarrons votre projet',
  children,
  submitLabel = 'Envoyer',
  alt = false,
}) {
  const flank = projects.slice(0, 4);
  const scope = useEnquiryDesk();

  return (
    <section
      ref={scope}
      className={`zv zv-section relative overflow-hidden ${alt ? 'zv-alt' : ''}`}
    >
      {/* Decorative flanking cards — desktop only. The perspective lives on
          the wrapper so the cards can be dealt in from depth; it has no
          effect at rest, where nothing is transformed in Z. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden [perspective:1200px] lg:block"
      >
        {flank.map((p, i) => (
          <figure
            key={p.slug}
            className={`m3-card absolute w-[220px] overflow-hidden rounded-2xl bg-[var(--paper-raised)] p-3 shadow-[0_18px_50px_rgba(28,25,23,0.10)] xl:w-[280px] ${SPOTS[i]}`}
          >
            <figcaption className="mb-2 px-1 font-display text-sm uppercase tracking-tight">
              {p.name}
            </figcaption>
            <img
              src={p.cover}
              alt=""
              width="600"
              height="400"
              loading="lazy"
              className="block aspect-[3/2] w-full rounded-xl object-cover"
            />
          </figure>
        ))}
      </div>

      <div className="shell relative">
        <div className="mx-auto max-w-[560px]">
          <div data-reveal className="reveal text-center">
            <span className="zv-subtitle">{eyebrow}</span>
            <InkTitle className="zv-h2 mt-5">{title}</InkTitle>
            <p className="zv-body zv-muted mx-auto mt-4 max-w-md">
              {children ?? (
                <>
                  Décrivez-nous le terrain, le programme et l&apos;échéance. Nous
                  revenons vers vous sous 48&nbsp;heures ouvrées.
                </>
              )}
            </p>
          </div>

          {/* No data-reveal here: the form's entrance is the desk scene's
              per-field stagger, and a wrapper fading the whole block in at
              once would play over the top of it. Without the scene the
              form simply renders, which is its resting state anyway. */}
          <div className="m3-desk mt-10">
            <ContactForm compact submitLabel={submitLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
