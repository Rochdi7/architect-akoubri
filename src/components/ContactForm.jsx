import { cloneElement, isValidElement, useId, useState } from 'react';
import Select from './Select';
import { business } from '../data/business';

/* The project enquiry form, shared by the Contact page and the enquiry band
   on the home page. It was lifted out of Contact.jsx so the home section
   posts to the same endpoint with the same validation rather than shipping
   a second, decorative copy.

   `compact` drops the optional phone/mission/budget controls: the home band
   is an entry point, not the full brief. The honeypot travels with the form
   in both modes. */

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

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  mission: '',
  budget: '',
  message: '',
  company: '', // honeypot — must stay empty
};

export default function ContactForm({ compact = false, submitLabel, className = '' }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errors, setErrors] = useState({});

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
    <form className={className} onSubmit={onSubmit} noValidate>
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
          <a href={`mailto:${business.email}`} className="underline">
            {business.email}
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

        {!compact && (
          <>
            <div className="flex flex-col gap-6 sm:flex-row">
              <Field label="Téléphone">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  className="zv-field"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="06 00 00 00 00"
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
          </>
        )}

        <Field label="Votre projet" required error={errors.message} id="f-message">
          <textarea
            value={form.message}
            onChange={set('message')}
            className="zv-field"
            rows={compact ? 4 : 5}
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
          {status === 'sending' ? 'Envoi…' : submitLabel || 'Envoyer le message'}
        </button>
      </div>
    </form>
  );
}

export function Field({ label, required, error, children, id }) {
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
