import { useInkFill } from '../hooks/useInkFill';
import { usePageMeta } from '../hooks/usePageMeta';
import ContactForm from '../components/ContactForm';
import { business } from '../data/business';

/* The four contact facts, shown as the reference's icon-led card row. Every
   value comes from data/business.js so this page cannot drift from the
   footer, the mentions légales or the LocalBusiness schema. */
const info = [
  {
    icon: 'mail',
    label: 'E-mail',
    value: business.email,
    href: `mailto:${business.email}`,
    cta: 'Nous écrire',
  },
  {
    icon: 'phone',
    label: 'Téléphone',
    // Both numbers, each stacked on its own line. As a single string with
    // an em dash they wrapped mid-number ("06 63 66 45 / 87"), which reads
    // as a typo rather than as two contacts.
    values: [business.phone, business.phone2],
    href: business.phoneHref,
    cta: 'Appeler',
  },
  {
    icon: 'pin',
    label: 'Bureaux',
    value: business.addressLines.join(', '),
    href: business.maps.link,
    cta: "Voir l'itinéraire",
    external: true,
  },
  { icon: 'clock', label: 'Horaires', value: business.hours },
];

export default function Contact() {

  usePageMeta({
    description:
      "Contacter un architecte à Marrakech : conception architecturale, permis de construire, suivi de chantier et design d'intérieur. Réponse sous 48 heures ouvrées.",
    canonical: '/contact',
  });
  const ink = useInkFill({ play: true });

  return (
    <>
      {/* ── Banner ── */}
      <section className="zv pt-24 sm:pt-32 md:pt-44">
        <div className="shell text-center">
          <span data-reveal className="reveal zv-subtitle">Contact</span>
          <h1 ref={ink} data-reveal data-reveal-delay="80" className="reveal zv-h1 mt-5">
            Parlons de votre projet
          </h1>
          <p
            data-reveal
            data-reveal-delay="160"
            className="reveal zv-lead zv-muted mx-auto mt-5 max-w-xl"
          >
            Un terrain, un plan ou une simple intention : écrivez-nous et nous
            revenons vers vous avec une première lecture.
          </p>
        </div>
      </section>

      {/* ── Image + form ── */}
      <section className="zv pt-14 md:pt-20">
        <div className="shell">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div data-reveal className="reveal zv-media">
              <img
                src="/media/projets/akoubri_adostigia-accueil-enseigne-relief-marbre-01.webp"
                alt="Accueil du projet Adostigia : enseigne en relief sur panneau de marbre sombre rétroéclairé, murs de pierre claire cannelée"
                width="1280"
                height="960"
                fetchpriority="high"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            {/* The reveal lives on a wrapper, not on the form: ContactForm
                forwards only className, and the Select listbox inside must
                not sit under a will-change containing block. */}
            <div data-reveal data-reveal-delay="100" className="reveal">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Info cards ── */}
      <section className="zv pt-16 md:pt-24">
        <div className="shell">
          <div className="grid overflow-hidden rounded-3xl sm:grid-cols-2 lg:grid-cols-4">
            {info.map((c, i) => (
              <div
                key={c.label}
                data-reveal
                data-reveal-delay={i * 70}
                className={`reveal zv-info-card ${
                  i > 0 ? 'border-t border-[var(--zv-border)] sm:border-t-0 sm:border-l' : ''
                } ${i === 2 ? 'sm:border-t sm:border-l-0 lg:border-t-0 lg:border-l' : ''}`}
              >
                <span className="zv-info-icon">
                  <InfoIcon name={c.icon} />
                </span>
                <div className="zv-small zv-muted">{c.label}</div>
                {c.values ? (
                  <div className="zv-body mt-1 font-medium">
                    {c.values.map((v) => (
                      <div key={v} className="whitespace-nowrap">{v}</div>
                    ))}
                  </div>
                ) : (
                  <div className="zv-body mt-1 font-medium [overflow-wrap:anywhere]">{c.value}</div>
                )}
                {c.href && (
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noreferrer' } : null)}
                    className="zv-small mt-auto inline-flex items-center gap-2 pt-6 transition-opacity hover:opacity-70"
                  >
                    {c.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
                {/* Horaires has nothing to link to. An empty spacer of the
                    same height keeps its card bottom on the same line as
                    the three that do carry a CTA — inventing a label here
                    would put words in the practice's mouth. */}
                {!c.href && <span aria-hidden="true" className="zv-small mt-auto pt-6 leading-[14px]">&nbsp;</span>}
              </div>
            ))}
          </div>

          <p data-reveal className="reveal zv-body zv-muted mx-auto mt-8 max-w-2xl text-center md:mt-12">
            Pour un premier échange, le plus utile est de nous envoyer le plan
            cadastral ou les coordonnées du terrain. Nous vous répondons avec une
            première lecture des contraintes.
          </p>
        </div>
      </section>
    </>
  );
}

function InfoIcon({ name }) {
  const d = {
    mail: 'M3 7h18v12H3zM3 7l9 7 9-7',
    phone: 'M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5.5 5.5L16 15l5 2v3a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1',
    pin: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4',
    clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2',
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d[name]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
