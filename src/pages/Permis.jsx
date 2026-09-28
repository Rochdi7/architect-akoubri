import { Link } from 'react-router-dom';
import InkTitle from '../components/InkTitle';
import GetInTouch from '../components/GetInTouch';
import { useInkFill } from '../hooks/useInkFill';
import { usePageMeta } from '../hooks/usePageMeta';
import { useFaqSchema } from '../hooks/useFaqSchema';

/* Permis de construire à Marrakech — service page.

   Content rule for this page: everything stated here is already stated
   somewhere on the site or in the studio's own journal article
   (/journal/permis-de-construire-maroc). Nothing about the Moroccan
   procedure is invented — the five stages below are the article's own
   list. The one-month dossier figure is the owner's own (2026-09-25).
   No price, no guarantee and no legal obligation is asserted.          */

/* The five stages, in the order the studio's article sets them out. */
const stages = [
  {
    n: '01',
    title: 'Le titre foncier et le règlement',
    text: "Vérification du titre foncier et du règlement d'urbanisme applicable à la parcelle. C'est la phase qui décide de la volumétrie, avant même le premier tracé.",
  },
  {
    n: '02',
    title: 'La note de renseignements',
    text: "La note de renseignements urbanistiques établit ce que la parcelle autorise réellement — hauteur, emprise, recul, stationnement.",
  },
  {
    n: '03',
    title: 'La conception et le dossier',
    text: "Conception architecturale et mise au point du dossier avec les bureaux d'études. Le projet est arbitré sur des images fidèles avant d'être figé.",
  },
  {
    n: '04',
    title: 'Le dépôt',
    text: "Dépôt en commission, puis passage devant les services concernés. Un dossier complet au dépôt évite de repartir en file d'attente.",
  },
  {
    n: '05',
    title: "L'instruction et l'autorisation",
    text: "Réponse, réserves éventuelles, reprise du dossier, autorisation. L'instruction administrative ne dépend pas de nous ; la qualité du dossier, si.",
  },
];

/* What the studio handles — each line is a mission already listed in the
   Architecture service or described in the article. */
const handled = [
  "Lecture du règlement d'urbanisme applicable à la parcelle",
  'Faisabilité et esquisse, rendues en 3D',
  'Conception architecturale et plans du dossier',
  "Coordination des bureaux d'études",
  'Constitution et dépôt du dossier',
  'Suivi des réserves jusqu’à l’autorisation',
];

/* Not rendered: the owner removed the visible FAQ (2026-09-25) but wants
   the questions kept for search engines. They are emitted as FAQPage
   JSON-LD below — the same text, so nothing is claimed that the page does
   not stand behind. */
const faq = [
  {
    q: 'Quel est le délai entre le premier contact et le permis ?',
    a: "Le dossier est prêt en un mois maximum. Vient ensuite l'instruction administrative, dont la durée dépend de la commune et que nous ne maîtrisons pas.",
  },
  {
    q: 'Pouvez-vous intervenir uniquement sur le permis ?',
    a: "Oui. C'est une mission partielle, facturée au forfait, comme les intérieurs seuls ou les images seules. Le devis est fixé avant tout démarrage.",
  },
  {
    q: 'Travaillez-vous en dehors de Marrakech ?',
    a: "Oui. Nous suivons des chantiers partout au Maroc. Au-delà de 200 km, nous calons un rythme de visites groupées pour maîtriser les frais de déplacement.",
  },
  {
    q: 'Que se passe-t-il après l’autorisation ?',
    a: "La mission peut se poursuivre en suivi de chantier — visite hebdomadaire, arbitrages en direct, réception — puis en design d'intérieur si le programme le justifie.",
  },
];

export default function Permis() {
  const heroInk = useInkFill({ play: true });

  usePageMeta({
    description:
      "Accompagnement au permis de construire à Marrakech : lecture du règlement d'urbanisme, conception architecturale, constitution et dépôt du dossier, suivi jusqu'à l'autorisation.",
    canonical: '/services/permis-de-construire-marrakech',
  });

  useFaqSchema(faq);

  return (
    <>
      {/* ── Hero ── */}
      <section className="zv zv-section pt-24 sm:pt-32 md:pt-44">
        <div className="shell">
          <div data-reveal className="reveal mx-auto max-w-3xl text-center">
            <span className="zv-subtitle">Architecture</span>
            <h1 ref={heroInk} className="zv-h2 mt-5">
              Permis de construire à Marrakech
            </h1>
            <p className="zv-lead mx-auto mt-5 max-w-xl">
              Une demande d'autorisation se prépare bien avant le dépôt. Nous lisons
              le règlement applicable à la parcelle, concevons le projet dans ce
              cadre, puis constituons et déposons le dossier.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/contact" className="zv-btn w-full justify-center sm:w-auto">
                Parler de votre terrain
              </Link>
              <Link
                to="/services"
                className="zv-btn zv-btn-outline w-full justify-center sm:w-auto"
              >
                Voir toutes nos missions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What the mission covers ── */}
      <section className="zv zv-alt zv-section">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div data-reveal className="reveal lg:sticky lg:top-32 lg:self-start">
            <span className="zv-subtitle">La mission</span>
            <InkTitle className="zv-h2 mt-5">Ce que nous prenons en charge</InkTitle>
            <p className="zv-lead mt-6 max-w-md">
              Le permis n'est pas une formalité détachée du projet : il découle de la
              conception architecturale. C'est pourquoi nous ne dessinons rien avant
              d'avoir vérifié ce que la parcelle autorise.
            </p>
          </div>

          <div data-reveal data-reveal-delay="80" className="reveal">
            <ul className="grid gap-4 sm:grid-cols-2">
              {handled.map((item) => (
                <li
                  key={item}
                  className="zv-body flex items-start gap-3 border-t border-[var(--zv-border)] pt-5"
                >
                  <span className="zv-marker" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="zv-lead mt-10 max-w-xl">
              Les délais varient d'une commune à l'autre. Nous annonçons une
              fourchette observée sur nos propres dossiers dans la ville concernée,
              jamais une moyenne nationale. Notre méthode complète est détaillée dans{' '}
              <Link
                to="/journal/permis-de-construire-maroc"
                className="zv-inline-link"
              >
                notre article sur le calendrier réel d'un permis de construire au Maroc
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ── The stages ── */}
      <section className="zv zv-section">
        <div className="shell">
          <div data-reveal className="reveal zv-section-head">
            <span className="zv-subtitle">Déroulé</span>
            <InkTitle className="zv-h2">Les étapes, dans l'ordre</InkTitle>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stages.map((s, i) => (
              <div
                key={s.n}
                data-reveal
                data-reveal-delay={i * 70}
                className="reveal zv-card zv-icon-card"
              >
                <span className="zv-icon">
                  <span className="zv-h6 leading-none">{s.n}</span>
                </span>
                <h2 className="zv-h5">{s.title}</h2>
                <p className="zv-body">{s.text}</p>
              </div>
            ))}
          </div>

          <p
            data-reveal
            className="reveal zv-body zv-muted mt-10 max-w-2xl"
          >
            Nous constituons votre dossier en un mois maximum. Un dossier incomplet,
            déposé pour gagner du temps, repart en file d'attente — c'est la première
            cause de retard que nous voyons.
          </p>
        </div>
      </section>

      {/* ── After the permit ── */}
      <section className="zv zv-alt zv-section">
        <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal className="reveal zv-media">
            <img
              src="/media/projets/akoubri_le-sentier-toiture-piscine-atlas-01.webp"
              alt="Toiture-terrasse du Sentier : piscine à débordement, terrasse en bois et Atlas enneigé à l'horizon"
              loading="lazy"
              width="1280"
              height="853"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div data-reveal data-reveal-delay="90" className="reveal">
            <span className="zv-subtitle">Ensuite</span>
            <InkTitle className="zv-h3 mt-5">Du permis au chantier</InkTitle>
            <p className="zv-lead mt-6 max-w-md">
              L'autorisation obtenue, la mission se poursuit naturellement en{' '}
              <Link
                to="/services"
                className="zv-inline-link"
              >
                suivi de chantier
              </Link>{' '}
              : visite hebdomadaire, arbitrages en direct, réception. Puis en{' '}
              <Link
                to="/services"
                className="zv-inline-link"
              >
                design d'intérieur
              </Link>{' '}
              lorsque le programme le justifie.
            </p>
            <p className="zv-lead mt-5 max-w-md">
              Chaque étape est arbitrée sur des images de synthèse fidèles plutôt que
              sur des intentions —{' '}
              <Link
                to="/projets"
                className="zv-inline-link"
              >
                nos projets livrés à Marrakech
              </Link>{' '}
              montrent ce que cela donne.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA — the shared closing band, with this page's own wording ── */}
      <GetInTouch title="Votre terrain, son règlement" submitLabel="Envoyer ma demande">
        Le plus utile pour un premier échange est le plan cadastral ou les
        coordonnées du terrain. Nous revenons vers vous avec une première
        lecture des contraintes, sous 48&nbsp;heures ouvrées.
      </GetInTouch>
    </>
  );
}
