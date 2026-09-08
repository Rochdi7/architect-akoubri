import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { business } from '../data/business';

/**
 * Mentions légales.
 *
 * Placeholders in ALL CAPS ([RAISON SOCIALE], [RC], …) are the values only
 * the studio can supply — registre du commerce, ICE, capital, hébergeur
 * contract. They are deliberately loud so they cannot ship unnoticed.
 */

const identity = [
  { term: 'Raison sociale', desc: '[RAISON SOCIALE] — [FORME JURIDIQUE, ex. SARL]' },
  { term: 'Siège social', desc: business.addressOneLine },
  { term: 'Capital social', desc: '[MONTANT] MAD' },
  { term: 'Registre du commerce', desc: 'RC n° [NUMÉRO] — Tribunal de commerce de [VILLE]' },
  { term: 'Identifiant commun (ICE)', desc: '[NUMÉRO ICE]' },
  { term: 'Identifiant fiscal', desc: '[NUMÉRO IF]' },
  { term: 'Directeur de la publication', desc: '[NOM DU RESPONSABLE]' },
  { term: 'Contact', desc: `${business.email} — ${business.phone}` },
];

export default function Legal() {
  useReveal();

  return (
    <>
      <section className="zv pt-24 sm:pt-32 md:pt-44">
        <div className="shell">
          <div data-reveal className="reveal mx-auto max-w-3xl">
            <span className="zv-subtitle">Informations légales</span>
            <h1 className="zv-h1 mt-5">Mentions légales</h1>
            <p className="zv-lead zv-muted mt-5 max-w-xl">
              Éditeur du site, hébergement, propriété intellectuelle et
              conditions d'utilisation de akoubri.com.
            </p>
          </div>
        </div>
      </section>

      <section className="zv zv-section pt-14 sm:pt-20">
        <div className="shell">
          <article className="mx-auto max-w-3xl space-y-14 md:space-y-20">
            <Block n="01" title="Éditeur du site">
              <p className="zv-body zv-muted">
                Le présent site est édité par&nbsp;:
              </p>
              <dl className="mt-7 divide-y divide-[var(--zv-border)] border-y border-[var(--zv-border)]">
                {identity.map((row) => (
                  <div key={row.term} className="grid gap-1 py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
                    <dt className="zv-small font-medium">{row.term}</dt>
                    <dd className="zv-small zv-muted">{row.desc}</dd>
                  </div>
                ))}
              </dl>
            </Block>

            <Block n="02" title="Hébergement">
              <p className="zv-body zv-muted">
                Le site est hébergé par Hostinger International Ltd., 61 Lordou
                Vironos Street, 6023 Larnaca, Chypre — hostinger.com. L'hébergeur
                assure la disponibilité technique du service&nbsp;; il n'intervient
                pas sur le contenu éditorial publié par l'éditeur.
              </p>
            </Block>

            <Block n="03" title="Propriété intellectuelle">
              <p className="zv-body zv-muted">
                L'ensemble des contenus présentés sur akoubri.com — textes,
                plans, photographies, images de synthèse, identité graphique,
                logotype et code source — est protégé par le droit d'auteur et
                demeure la propriété exclusive de l'éditeur ou de ses ayants
                droit.
              </p>
              <p className="zv-body zv-muted mt-5">
                Toute reproduction, représentation, adaptation ou diffusion,
                totale ou partielle, sur quelque support que ce soit, est
                interdite sans autorisation écrite préalable. Les images de
                projets peuvent en outre être soumises aux droits des maîtres
                d'ouvrage et des photographes concernés.
              </p>
            </Block>

            <Block n="04" title="Données personnelles">
              <p className="zv-body zv-muted">
                Les informations transmises via le formulaire de contact sont
                utilisées uniquement pour répondre à votre demande. Le détail des
                traitements, des durées de conservation et de vos droits figure
                dans notre{' '}
                <Link to="/confidentialite" className="underline underline-offset-4 hover:text-[var(--zv-primary)]">
                  politique de confidentialité
                </Link>
                .
              </p>
            </Block>

            <Block n="05" title="Responsabilité">
              <p className="zv-body zv-muted">
                L'éditeur s'efforce de maintenir des informations exactes et à
                jour, sans garantir l'exhaustivité des contenus publiés. Les
                surfaces, délais, budgets et états d'avancement mentionnés sur les
                pages projets sont donnés à titre indicatif et ne constituent pas
                un engagement contractuel.
              </p>
              <p className="zv-body zv-muted mt-5">
                Les liens sortants vers des sites tiers sont proposés pour votre
                commodité&nbsp;; l'éditeur n'exerce aucun contrôle sur leur contenu
                et décline toute responsabilité à leur égard.
              </p>
            </Block>

            <Block n="06" title="Droit applicable">
              <p className="zv-body zv-muted">
                Les présentes mentions sont soumises au droit marocain. À défaut de
                résolution amiable, tout litige relatif à l'utilisation du site
                relève de la compétence des tribunaux de [VILLE].
              </p>
            </Block>
          </article>
        </div>
      </section>

      <section className="zv zv-alt zv-section">
        <div className="shell">
          <div data-reveal className="reveal mx-auto max-w-2xl text-center">
            <h2 className="zv-h3">Une question sur ces informations&nbsp;?</h2>
            <p className="zv-lead zv-muted mx-auto mt-5 max-w-md">
              Écrivez-nous, nous répondons sous 48&nbsp;heures ouvrées.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/contact" className="zv-btn">Nous contacter</Link>
              <Link to="/confidentialite" className="zv-btn zv-btn-outline">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Block({ n, title, children }) {
  return (
    <section data-reveal className="reveal">
      <div className="mb-6 flex items-baseline gap-4 border-b border-[var(--zv-border)] pb-4">
        <span className="zv-small text-[var(--zv-primary)]">{n}</span>
        <h2 className="zv-h4">{title}</h2>
      </div>
      {children}
    </section>
  );
}
