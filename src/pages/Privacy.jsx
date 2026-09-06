import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

/**
 * Politique de confidentialité.
 *
 * The processing described here mirrors what public/api/contact.php actually
 * does: it mails the six form fields plus the caller's IP address, and writes
 * a throttle file keyed on a SHA-256 hash of that IP. If the handler changes,
 * this page changes with it.
 */

const collected = [
  { field: 'Nom', why: 'Vous identifier et personnaliser notre réponse.', required: 'Obligatoire' },
  { field: 'E-mail', why: 'Vous répondre.', required: 'Obligatoire' },
  { field: 'Téléphone', why: 'Vous rappeler si vous le souhaitez.', required: 'Facultatif' },
  { field: 'Type de mission', why: 'Orienter la demande vers le bon interlocuteur.', required: 'Facultatif' },
  { field: 'Budget indicatif', why: 'Évaluer la faisabilité en amont.', required: 'Facultatif' },
  { field: 'Message', why: 'Comprendre votre projet.', required: 'Obligatoire' },
  { field: 'Adresse IP', why: 'Limiter les envois automatisés et les abus.', required: 'Collecte automatique' },
];

const rights = [
  ['Accès', 'Obtenir une copie des données que nous détenons sur vous.'],
  ['Rectification', 'Corriger une information inexacte ou incomplète.'],
  ['Suppression', "Demander l'effacement de vos données."],
  ['Opposition', 'Vous opposer au traitement de vos données.'],
];

export default function Privacy() {
  useReveal();

  return (
    <>
      <section className="zv pt-24 sm:pt-32 md:pt-44">
        <div className="shell">
          <div data-reveal className="reveal mx-auto max-w-3xl">
            <span className="zv-subtitle">Vos données</span>
            <h1 className="zv-h1 mt-5">Politique de confidentialité</h1>
            <p className="zv-lead zv-muted mt-5 max-w-xl">
              Ce que nous collectons, pourquoi, combien de temps nous le
              conservons, et comment exercer vos droits.
            </p>
            <p className="zv-small zv-muted mt-7">
              Dernière mise à jour&nbsp;: [DATE DE MISE EN LIGNE]
            </p>
          </div>
        </div>
      </section>

      <section className="zv zv-section pt-14 sm:pt-20">
        <div className="shell">
          <article className="mx-auto max-w-3xl space-y-14 md:space-y-20">
            <Block n="01" title="Responsable du traitement">
              <p className="zv-body zv-muted">
                Le responsable du traitement est [RAISON SOCIALE], dont le siège
                et les coordonnées figurent dans les{' '}
                <Link to="/mentions-legales" className="underline underline-offset-4 hover:text-[var(--zv-primary)]">
                  mentions légales
                </Link>
                . Pour toute question relative à vos données, écrivez à{' '}
                <a href="mailto:contact@akoubri.com" className="underline underline-offset-4 hover:text-[var(--zv-primary)]">
                  contact@akoubri.com
                </a>
                .
              </p>
            </Block>

            <Block n="02" title="Données collectées">
              <p className="zv-body zv-muted">
                Nous ne collectons que les données que vous nous transmettez via
                le formulaire de contact, auxquelles s&apos;ajoute votre adresse IP
                pour des raisons de sécurité&nbsp;:
              </p>
              <dl className="mt-7 divide-y divide-[var(--zv-border)] border-y border-[var(--zv-border)]">
                {collected.map((row) => (
                  <div
                    key={row.field}
                    className="grid gap-1 py-4 sm:grid-cols-[160px_1fr_auto] sm:items-baseline sm:gap-6"
                  >
                    <dt className="zv-small font-medium">{row.field}</dt>
                    <dd className="zv-small zv-muted">{row.why}</dd>
                    <dd className="zv-small text-[var(--zv-primary)] sm:text-right">{row.required}</dd>
                  </div>
                ))}
              </dl>
              <p className="zv-small zv-muted mt-6">
                Aucune donnée sensible n&apos;est demandée. Nous ne vous demandons
                jamais de coordonnées bancaires par ce formulaire.
              </p>
            </Block>

            <Block n="03" title="Finalité et base légale">
              <p className="zv-body zv-muted">
                Vos données servent exclusivement à traiter votre demande et à
                assurer le suivi commercial qui en découle. La base légale est
                votre consentement, matérialisé par l&apos;envoi volontaire du
                formulaire, ainsi que notre intérêt légitime à protéger le site
                contre les envois automatisés.
              </p>
              <p className="zv-body zv-muted mt-5">
                Vos données ne sont ni vendues, ni louées, ni transmises à des
                fins publicitaires. Aucune prospection commerciale non sollicitée
                ne vous sera adressée.
              </p>
            </Block>

            <Block n="04" title="Destinataires et sous-traitants">
              <p className="zv-body zv-muted">
                Les messages sont reçus par courrier électronique par l&apos;équipe
                de l&apos;agence, seule destinataire. L&apos;acheminement technique
                est assuré par notre hébergeur, Hostinger, qui agit en qualité de
                sous-traitant et n&apos;exploite pas ces contenus pour son compte.
              </p>
            </Block>

            <Block n="05" title="Durée de conservation">
              <p className="zv-body zv-muted">
                Les demandes sans suite sont conservées douze mois à compter du
                dernier échange, puis supprimées. Les échanges liés à un projet
                engagé suivent la durée légale de conservation des documents
                contractuels. Le fichier technique anti-abus, qui ne contient
                qu&apos;une empreinte chiffrée de l&apos;adresse IP, expire au bout
                de soixante secondes.
              </p>
            </Block>

            <Block n="06" title="Cookies et mesure d'audience">
              <p className="zv-body zv-muted">
                Ce site ne dépose aucun cookie publicitaire et n&apos;utilise aucun
                traceur de mesure d&apos;audience. Les seules ressources externes
                chargées sont les polices d&apos;écriture servies par Google Fonts,
                qui reçoit à cette occasion votre adresse IP. Aucun consentement
                préalable n&apos;est donc requis pour naviguer.
              </p>
            </Block>

            <Block n="07" title="Sécurité">
              <p className="zv-body zv-muted">
                Le site est servi exclusivement en HTTPS. Le formulaire est
                protégé par un champ leurre, une limitation du nombre
                d&apos;envois par adresse IP et un filtrage des contenus soumis.
                L&apos;accès à la boîte de réception est restreint aux membres de
                l&apos;agence.
              </p>
            </Block>

            <Block n="08" title="Vos droits">
              <p className="zv-body zv-muted">
                Conformément à la loi 09-08 relative à la protection des personnes
                physiques à l&apos;égard du traitement des données à caractère
                personnel, vous disposez des droits suivants&nbsp;:
              </p>
              <ul className="mt-7 grid gap-3 border-t border-[var(--zv-border)] pt-7 sm:grid-cols-2">
                {rights.map(([title, text]) => (
                  <li key={title} className="zv-small zv-muted flex items-start gap-3">
                    <span className="mt-2 h-px w-4 shrink-0 bg-[var(--zv-primary)]" />
                    <span>
                      <span className="font-medium">{title}</span> — {text}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="zv-body zv-muted mt-7">
                Pour exercer ces droits, écrivez à contact@akoubri.com. Nous
                répondons sous trente jours. Vous pouvez également saisir la
                Commission Nationale de contrôle de la protection des Données à
                caractère Personnel (CNDP) — cndp.ma.
              </p>
            </Block>
          </article>
        </div>
      </section>

      <section className="zv zv-alt zv-section">
        <div className="shell">
          <div data-reveal className="reveal mx-auto max-w-2xl text-center">
            <h2 className="zv-h3">Une demande concernant vos données&nbsp;?</h2>
            <p className="zv-lead zv-muted mx-auto mt-5 max-w-md">
              Un simple e-mail suffit — nous traitons chaque demande
              individuellement.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/contact" className="zv-btn">Nous contacter</Link>
              <Link to="/mentions-legales" className="zv-btn zv-btn-outline">
                Mentions légales
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
