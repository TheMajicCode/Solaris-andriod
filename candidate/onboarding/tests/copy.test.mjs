/* U0-03 EN/ES copy suite.
 *
 * Completeness (same keys, no empties), no English leaking into Spanish,
 * the contract's exact strings, no model size and no diagnosis claim, and every
 * key the code asks for exists (and every stored key is used).
 * SCOPE: string tables only. Not a qualified clinical or translation review.
 */
import { readFileSync } from 'node:fs';
import { COPY, LOCALES, SAME_IN_BOTH, NATIVE_HANDOFF_KEYS, t } from '../copy.mjs';

const source = name => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

// Exact strings from docs/reports/WELCOME-AND-ONBOARDING-CONTRACT-2026-09-18.md.
const CONTRACT = [
  ['welcome.title', 'Your health. Your space.', 'Tu salud. Tu espacio.'],
  ['welcome.body', 'A place for your records, your reflections and your next small step.', 'Un espacio para tus registros, tus reflexiones y tu próximo pequeño paso.'],
  ['welcome.start', 'Get started', 'Comenzar'],
  ['welcome.restore', 'I have a vault to restore', 'Tengo una bóveda para restaurar'],
  ['native.title', 'Make this space yours.', 'Haz tuyo este espacio.'],
  ['native.body', 'Set up or restore your vault using the available device and recovery options.', 'Configura o restaura tu bóveda con las opciones disponibles del dispositivo y de recuperación.'],
  ['ch1.title', 'You choose what LUCA can use.', 'Tú eliges qué puede usar LUCA.'],
  ['ch1.body', 'Your records are personal. Choose the records LUCA may use, within your permissions. Review the sources chosen for each personal reply.', 'Tus registros son personales. Elige los registros que puede usar LUCA, según tus permisos. Revisa las fuentes elegidas para cada respuesta personal.'],
  ['common.continue', 'Continue', 'Continuar'],
  ['common.skip', 'Skip for now', 'Omitir por ahora'],
  ['ch2.title', 'Support, on your phone.', 'Apoyo en tu teléfono.'],
  ['ch2.body', 'Pocket LUCA offers brief local help. Personal answers need the records you choose. You can use your daily tools without AI.', 'Pocket LUCA ofrece ayuda breve en tu teléfono. Las respuestas personales necesitan los registros que elijas. Puedes usar tus herramientas diarias sin IA.'],
  ['ch2.setup', 'Set up Pocket LUCA', 'Configurar Pocket LUCA'],
  ['ch2.withoutAI', 'Continue without AI', 'Continuar sin IA'],
  ['ch3.title', 'One small step, at your pace.', 'Un paso pequeño, a tu ritmo.'],
  ['ch3.body', 'You can explore now and complete your profile later.', 'Puedes explorar ahora y completar tu perfil más adelante.'],
  ['ch3.done', 'Done', 'Listo'],
  ['returning.title', 'Welcome back.', 'Te damos la bienvenida de nuevo.'],
  ['returning.body', 'Unlock your vault to continue.', 'Desbloquea tu bóveda para continuar.'],
  ['returning.unlock', 'Unlock my vault', 'Desbloquear mi bóveda'],
  ['vision.title', 'The wider Solaris vision', 'La visión de Solaris'],
  ['vision.planned', 'Planned', 'En desarrollo'],
];

// Whole English words that must not appear in Spanish copy.
const ENGLISH = /\b(the|your|and|with|you|vault|records?|step|continue|back|done|skip|open|setup|choose|try|again|not|this|phone|planned|welcome|unlock|restore|saving|checking|opening|close)\b/i;
const MODEL_SIZE = /\b\d+(?:[.,]\d+)?\s?(?:MB|MiB|GB|GiB|KB|KiB)\b/;
const CLINICAL = /diagnos|diagnós|\bcure\b|\bcura\b|treatment|tratamiento|medical intelligence|inteligencia médica|\bdoctor\b|\bmédico\b|prescri/i;

export function run(t) {
  const en = COPY.en;
  const es = COPY.es;
  const enKeys = Object.keys(en).sort();
  const esKeys = Object.keys(es).sort();
  t.equal('K1 same number of keys', esKeys.length, enKeys.length);
  t.equal('K2 identical key sets', JSON.stringify(esKeys), JSON.stringify(enKeys));
  t.equal('K3 locales listed', LOCALES.join(), 'en,es');
  for (const key of enKeys) {
    t.ok(`K4 en ${key} non-empty`, typeof en[key] === 'string' && en[key].trim().length > 0);
    t.ok(`K5 es ${key} non-empty`, typeof es[key] === 'string' && es[key].trim().length > 0);
    if (!SAME_IN_BOTH.includes(key)) t.ok(`K6 es ${key} is translated (differs from en)`, es[key] !== en[key]);
    t.ok(`K7 es ${key} has no English words`, SAME_IN_BOTH.includes(key) || !ENGLISH.test(es[key].replace(/Pocket LUCA AI|Pocket LUCA|LUCA|Solaris|Clinic OS|GPS\/RGB|Android|English/g, '')));
    for (const lang of LOCALES) {
      t.ok(`K8 ${lang} ${key} has no model size`, !MODEL_SIZE.test(COPY[lang][key]));
      t.ok(`K9 ${lang} ${key} makes no diagnosis/treatment claim`, !CLINICAL.test(COPY[lang][key]));
    }
  }
  for (const [key, enText, esText] of CONTRACT) {
    t.equal(`C1 contract en ${key}`, en[key], enText);
    t.equal(`C2 contract es ${key}`, es[key], esText);
  }
  t.equal('T1 progress en', t_('en', 'a11y.progress', { n: 2, total: 3 }), 'Step 2 of 3');
  t.equal('T2 progress es', t_('es', 'a11y.progress', { n: 2, total: 3 }), 'Paso 2 de 3');
  let threw = false;
  try { t_('en', 'no.such.key'); } catch { threw = true; }
  t.ok('T3 unknown key throws instead of rendering a raw key', threw);
  t.equal('T4 unknown locale falls back to en', t_('fr', 'ch3.done'), 'Done');
  t.ok('T5 guided greeting is labelled as not model output (en)', /not generated by AI/.test(en['ch2.greetingLabel']));
  t.ok('T6 guided greeting is labelled as not model output (es)', /no generado por IA/.test(es['ch2.greetingLabel']));
  t.ok('T7 wallets appear only as a planned, not-required vision item', Object.entries(en).filter(([, v]) => /wallet/i.test(v)).every(([k, v]) => k === 'vision.economy.body' && /None is needed/.test(v)));
  t.ok('T8 billeteras appear only as a planned, not-required vision item', Object.entries(es).filter(([, v]) => /billetera/i.test(v)).every(([k, v]) => k === 'vision.economy.body' && /Ninguna es necesaria/.test(v)));

  // Every key the code asks for exists, and every stored key is used.
  const code = source('render.mjs') + source('actions.mjs');
  const used = new Set([...code.matchAll(/'((?:[a-z0-9]+\.)+[a-zA-Z0-9]+)'/g)].map(m => m[1]).filter(k => Object.hasOwn(en, k) || /^(error|pending|common|welcome|returning|migration|ch[123]|opening|vision|lang|a11y|brand)\./.test(k)));
  for (const area of ['vault', 'web', 'clinic', 'economy']) { used.add(`vision.${area}.title`); used.add(`vision.${area}.body`); }
  for (const key of used) t.ok(`U1 code key ${key} exists in both locales`, Object.hasOwn(en, key) && Object.hasOwn(es, key));
  for (const key of enKeys) t.ok(`U2 stored key ${key} is used (or is native handoff copy)`, used.has(key) || NATIVE_HANDOFF_KEYS.includes(key));
}

function t_(locale, key, vars) {
  return t(locale, key, vars);
}
