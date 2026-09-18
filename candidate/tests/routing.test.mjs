/* A605-01 routing regression suite — findings F04 and F05.
 *
 * Every row asserts BOTH:
 *   - the frozen 604 baseline behaviour (so a defect is proven, not asserted), and
 *   - the candidate behaviour (so the repair is proven).
 *
 * `expect: 'repaired'` means the baseline is wrong and the candidate is right.
 * `expect: 'control'`  means the baseline is already right and must not regress.
 *
 * SCOPE: helper level. The baseline is the frozen fast-guided helper in a vm
 * context; the candidate is the new module. Neither is the actual DailyService,
 * the host bytecode, or a phone. Claims about avoided model preparation need
 * unloaded-model and coordinator spies, which this suite does not have and does
 * not pretend to have.
 */
import { runBaseline } from './baseline.mjs';
import { routeRequest } from '../a605/guided-router.mjs';

/** kind produced by the candidate, or null */
function candidateKind(user, locale) {
  const r = routeRequest({ user, locale });
  return r ? r.kind : null;
}
function baselineKind(user, locale) {
  const r = runBaseline(user, locale);
  return r ? r.kind : null;
}

// id, input, locale, baseline kind expected, candidate kind expected, classification
const ROUTING = [
  // --- F04: punctuation, accents, case, whitespace, polite forms -----------
  ['R1',  'Hello',                          'en', 'welcome',        'welcome',        'control'],
  ['R2',  'Hola',                           'es', 'welcome',        'welcome',        'control'],
  ['R3',  '¡Hola!',                         'es', null,             'welcome',        'repaired'],
  ['R4',  '¿Qué puedes hacer?',             'es', null,             'welcome',        'repaired'],
  ['R5',  'Qué puedes hacer?',              'es', 'welcome',        'welcome',        'control'],
  ['R6',  '¿Cómo está mi check-in?',        'es', null,             'checkin-select', 'repaired'],
  ['R7',  'Cómo está mi check-in?',         'es', 'checkin-select', 'checkin-select', 'control'],
  ['R8',  'Can you explain my check-in?',   'en', null,             'checkin-select', 'repaired'],
  ['R9',  '   hola   ',                     'es', 'welcome',        'welcome',        'control'],
  ['R10', 'HOLA',                           'es', 'welcome',        'welcome',        'control'],
  ['R11', '¿¿Hola??',                       'es', null,             'welcome',        'repaired'],
  ['R12', 'hola\nqué puedes hacer',         'es', null,             null,             'control'],
  ['R13', 'Por favor, ¿qué puedes hacer?',  'es', null,             'welcome',        'repaired'],
  ['R14', 'Que puedes hacer',               'es', 'welcome',        'welcome',        'control'],
  ['R15', 'buenas noches',                  'es', 'welcome',        'welcome',        'control'],
  ['R16', '¡Buenas noches!',                'es', null,             'welcome',        'repaired'],
  ['R17', 'what can you do please',         'en', null,             'welcome',        'repaired'],

  // --- unrelated uses of shortcut words must NOT become supported intents ---
  ['R18', 'I read an article about check-in kiosks at the airport', 'en', null, null, 'control'],
  ['R19', 'hola amigo, tell me a story about the sea',              'es', null, null, 'control'],

  // --- F05: mixed clinical intent must never reach a wellness shortcut -----
  ['M1', 'What should I do about severe chest pain during my check-in?', 'en',
   'checkin-select', 'out-of-scope-clinical', 'repaired'],
  ['M2', '¿Qué hago si tengo dolor de pecho fuerte en mi check-in?', 'es',
   null, 'out-of-scope-clinical', 'repaired'],
  ['M3', 'Should I stop taking my medication before my check-in?', 'en',
   null, 'out-of-scope-clinical', 'repaired'],
  ['M4', 'During my check-in I felt calm', 'en', null, null, 'control'],
  // Measured: the baseline returns checkin-select here because `my ` satisfies its
  // question prefix and `check-in` appears as a substring. A worse failure than
  // predicted, and the reason baseline behaviour is asserted rather than assumed.
  ['M5', 'My check-in mentioned I read about chest pain', 'en',
   'checkin-select', 'out-of-scope-clinical', 'repaired'],
  ['M6', 'I do not have chest pain, how is my check-in?', 'en',
   null, 'out-of-scope-clinical', 'repaired'],
  ['M7', 'Hello there, I have a question about my medication', 'en',
   null, 'out-of-scope-clinical', 'repaired'],
  ['M8', '¿Cómo está mi check-in? También tengo dolor de pecho', 'es',
   null, 'out-of-scope-clinical', 'repaired'],

  // --- found by adversarial self-review of 8db241b -------------------------
  // These three reached `null` (open generation) instead of the bounded
  // out-of-scope reply, because the screen matched fixed phrases only. They
  // were never misrouted to wellness, so F05's core held, but a clinical
  // request must not fall through to the model either.
  ['M9',  'Hola. Tengo dolor en el pecho.', 'es', null, 'out-of-scope-clinical', 'repaired'],
  ['M10', '¿Qué puedes hacer? Me duele mucho el pecho', 'es', null, 'out-of-scope-clinical', 'repaired'],
  ['M11', 'Take my meds?', 'en', null, 'out-of-scope-clinical', 'repaired'],
  ['M12', 'my head hurts badly', 'en', null, 'out-of-scope-clinical', 'repaired'],
  ['M13', 'me duele la cabeza', 'es', null, 'out-of-scope-clinical', 'repaired'],

  // Pain/site co-occurrence must not fire on ordinary wellness language.
  ['M14', 'choose a step', 'en', 'step-select', 'step-select', 'control'],
  ['M15', 'what can you do', 'en', 'welcome', 'welcome', 'control'],
  ['M16', 'explain my check-in', 'en', 'checkin-select', 'checkin-select', 'control'],
];

export function run(t) {
  for (const [id, user, locale, expectedBaseline, expectedCandidate, classification] of ROUTING) {
    t.equal(`${id} baseline  ${JSON.stringify(user)}`, baselineKind(user, locale), expectedBaseline);
    t.equal(`${id} candidate ${JSON.stringify(user)}`, candidateKind(user, locale), expectedCandidate);
    if (classification === 'repaired') {
      t.ok(`${id} is a real repair (baseline differs from candidate)`,
           expectedBaseline !== expectedCandidate);
    } else {
      t.ok(`${id} control preserved`, expectedBaseline === expectedCandidate);
    }
  }

  // A supported route must require zero model calls.
  for (const [, user, locale, , expectedCandidate] of ROUTING) {
    if (!expectedCandidate) continue;
    const r = routeRequest({ user, locale });
    t.equal(`zero model calls for ${JSON.stringify(user)}`, r.modelCallsRequired, 0);
  }

  // Locale fidelity: a Spanish request is answered in Spanish.
  t.ok('ES greeting answered in Spanish',
       routeRequest({ user: '¡Hola!', locale: 'es' }).message.startsWith('Hola. Soy Pocket LUCA'));
  t.ok('EN greeting answered in English',
       routeRequest({ user: 'Hello', locale: 'en' }).message.startsWith('Hello. I am Pocket LUCA'));
  t.ok('ES escalation answered in Spanish',
       routeRequest({ user: '¿Qué hago si tengo dolor de pecho fuerte?', locale: 'es' })
         .message.includes('profesional de salud'));

  // The original text is never mutated.
  const original = '  ¡Hola!  ';
  routeRequest({ user: original, locale: 'es' });
  t.equal('original text is not mutated', original, '  ¡Hola!  ');

  // Escalation copy carries its unreviewed release gate.
  const risky = routeRequest({ user: 'severe chest pain', locale: 'en' });
  t.equal('escalation carries a review gate', risky.reviewGate,
          'escalation-copy-requires-qualified-clinical-review');
  t.ok('escalation does not name a condition or rate urgency',
       !/emergency room|call 911|you are having|diagnos/i.test(risky.message));
}
