import { cloneElement, isValidElement, useId, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import Select from '../components/Select';

const budgets = [
  'Moins de 500 000 MAD',
  '500 000 — 1,5 M MAD',
  '1,5 — 5 M MAD',
  'Plus de 5 M MAD',
  'À définir',
];

const missions = [
  'Architecture',
  "Design d'intérieur",
  'Images de synthèse',
  'Mission complète',
];

// The four contact facts, shown as the reference's icon-led card row.
const info = [
  { icon: 'mail', label: 'E-mail', value: 'contact@adostigia.com', href: 'mailto:contact@adostigia.com', cta: 'Nous écrire' },
  { icon: 'phone', label: 'Téléphone', value: '+212 6 00 00 00 00', href: 'tel:+212600000000', cta: 'Appeler' },
  { icon: 'pin', label: 'Bureaux', value: 'Marrakech & Casablanca' },
  { icon: 'clock', label: 'Horaires', value: 'Lun — Ven, 9h — 18h' },
];

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  mission: '',
  budget: '',
  message: '',
  company: '', // honeypot — must stay empty
};

export default function Contact() {
  useReveal();

  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errors, setErrors] = useState({});

  /* setValue takes the value itself; set() adapts a DOM change event to
     it. The custom Select reports a value, native inputs report events. */
  const setValue = (k) => (value) => {
    setForm((f) => ({ ...f, [k]: value }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const set = (k) => (e) => setValue(k)(e.target.value);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Indiquez votre nom.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Adresse e-mail invalide.';
    if (form.message.trim().length < 20) e.message = 'Décrivez votre projet en quelques lignes (20 caractères minimum).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (form.company) return; // bot filled the honeypot
    if (!validate()) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('bad status');
      setStatus('sent');
      setForm(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {/* ── Banner ── */}
      <section className="zv pt-36 md:pt-44">
        <div className="shell text-center">
          <h1 data-reveal className="reveal zv-h1">
            Parlons de votre projet
          </h1>
          <p
            data-reveal
            data-reveal-delay="80"
            className="reveal zv-body zv-muted mx-auto mt-5 max-w-xl"
          >
            Un terrain, un plan ou une simple intention : écrivez-nous et nous
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
                src="/media/adostigia/adostigia-01.jpg"
                alt="Hall d'accueil Adostigia"
                width="1280"
                height="960"
                fetchpriority="high"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            <form data-reveal data-reveal-delay="100" className="reveal" onSubmit={onSubmit} noValidate>
              {status === 'sent' && (
                <div
                  role="status"
                  className="zv-small mb-8 rounded-2xl border border-[var(--zv-primary)] bg-white px-5 py-4"
                >
                  Message envoyé. Nous revenons vers vous sous 48 heures ouvrées.
                </div>
              )}
              {status === 'error' && (
                <div
                  role="alert"
                  className="zv-small mb-8 rounded-2xl border border-red-700 bg-red-50 px-5 py-4 text-red-800"
                >
                  L'envoi a échoué. Écrivez-nous directement à{' '}
                  <a href="mailto:contact@adostigia.com" className="underline">
                    contact@adostigia.com
                  </a>
                  .
                </div>
              )}

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <Field label="Nom complet" required error={errors.name} id="f-name">
                    <input
                      type="text"
                      value={form.name}
                      onChange={set('name')}
                      className="zv-field"
                      autoComplete="name"
                      placeholder="Votre nom"
                      required
                    />
                  </Field>
                  <Field label="E-mail" required error={errors.email} id="f-email">
                    <input
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      className="zv-field"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="vous@exemple.com"
                      required
                    />
                  </Field>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row">
                  <Field label="Téléphone">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      className="zv-field"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+212 6 00 00 00 00"
                    />
                  </Field>
                  <Field label="Mission souhaitée">
                    <Select
                      name="mission"
                      value={form.mission}
                      onChange={setValue('mission')}
                      options={missions}
                    />
                  </Field>
                </div>

                <Field label="Budget travaux estimé">
                  <Select
                    name="budget"
                    value={form.budget}
                    onChange={setValue('budget')}
                    options={budgets}
                  />
                </Field>

                <Field label="Votre projet" required error={errors.message} id="f-message">
                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    className="zv-field"
                    rows={5}
                    placeholder="Terrain, surface, programme, échéance…"
                    required
                  />
                </Field>

                {/* Honeypot — hidden from humans, irresistible to bots. */}
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={set('company')}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <button type="submit" className="zv-btn w-full" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                  {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
                </button>
              </div>
            </form>
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
                <div className="zv-body mt-1 font-medium">{c.value}</div>
                {c.href && (
                  <a
                    href={c.href}
                    className="zv-small mt-auto inline-flex items-center gap-2 pt-6 transition-opacity hover:opacity-70"
                  >
                    {c.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>

          <p data-reveal className="reveal zv-body zv-muted mx-auto mt-12 max-w-2xl text-center">
            Pour un premier échange, le plus utile est de nous envoyer le plan
            cadastral ou les coordonnées du terrain. Nous vous répondons avec une
            première lecture des contraintes.
          </p>
        </div>
      </section>
    </>
  );
}

/**
 * Field — label, control, and error message as one block.
 *
 * The control is cloned rather than wrapped so the error can drive both
 * `aria-invalid` (which the stylesheet keys the red rule off) and
 * `aria-describedby`, without every call site repeating the wiring.
 */
function Field({ label, required, error, children, id }) {
  const auto = useId();
  const base = id || auto;
  const errorId = `${base}-error`;
  const labelId = `${base}-label`;

  /* A <label> wrapping a <button> forwards its click to it, which would
     open the custom Select and immediately close it again. Only native
     controls get the implicit label; the listbox is tied to its text by
     aria-labelledby instead. */
  const custom = isValidElement(children) && children.type === Select;
  const Wrapper = custom ? 'div' : 'label';

  const control = isValidElement(children)
    ? cloneElement(children, {
        ...(error ? { 'aria-invalid': 'true', 'aria-describedby': errorId } : null),
        ...(custom ? { 'aria-labelledby': labelId } : null),
      })
    : children;

  return (
    <Wrapper className="block w-full">
      <span id={labelId} className="zv-small font-medium">
        {label}
        {required && <span className="text-[var(--zv-primary)]" aria-hidden="true"> *</span>}
      </span>
      {control}
      {error && (
        <span id={errorId} className="mt-1.5 flex items-center gap-1.5 text-xs text-[#b4342b]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 7.5v5.5M12 16.2v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {error}
        </span>
      )}
    </Wrapper>
  );
}

function InfoIcon({ name }) {
  const d = {
    mail: 'M3 7h18v12H3zM3 7l9 7 9-7',
    phone: 'M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5.5 5.5L16 15l5 2v3a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1',
    pin: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4',
    clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2',
  }[name];
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
