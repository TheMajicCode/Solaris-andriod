/* A605 bounded host donor suite — candidate/a605/host-donor/fast-guided.js.
 *
 * The donor is evaluated here as plain JavaScript, exactly as the frozen
 * shipped helper is evaluated by baseline.mjs, with the same synthetic task
 * envelope. Every case is run against BOTH: the shipped helper must show the
 * recorded defect and the donor must not, so each assertion is also a
 * regression control against the baseline.
 *
 * SCOPE LIMIT: helper-level only. The same behaviour was measured on the ACTUAL
 * host bundle (tools/host/run-host-probe.py with donor-proof-cases.js), which
 * needs private inputs and cannot run in CI. This suite is what CI enforces.
 */
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { baselineTask, runBaseline } from './baseline.mjs';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DONOR_PATH = 'candidate/a605/host-donor/fast-guided.js';
const context = createContext({});
runInContext(readFileSync(join(REPO, DONOR_PATH), 'utf8'), context);
const runDonor = (user, locale, options) => context.fastGuided(baselineTask(user, locale, options));

const CHECKIN = { vitality: 2, clarity: 4, balance: 3, alignment: 5, date: '2026-09-15' };
const selected = () => ({
  facts: [{ fields: { ...CHECKIN } }],
  sources: [{ category: 'questionnaires' }],
  sourceRefs: [{ id: 'source_' + 'f'.repeat(32), revision: 1 }],
});

export function run(t) {
  // --- F04: boundary punctuation and polite prefixes -----------------------
  for (const [label, user, kind] of [
    ['leading inverted exclamation', '¡Hola!', 'welcome'],
    ['leading inverted question', '¿Qué puedes hacer?', 'welcome'],
    ['polite prefix with comma and punctuation', 'Por favor, ¿qué puedes hacer?', 'welcome'],
    ['can-you prefix', 'Can you explain my check-in?', 'checkin-select'],
    ['please prefix', 'Please explain my check-in', 'checkin-select'],
  ]) {
    const donor = runDonor(user, 'en');
    t.equal(`donor F04 ${label}: guided`, donor && donor.kind, kind);
    t.equal(`shipped F04 ${label}: NOT guided (the recorded defect)`, runBaseline(user, 'en'), null);
  }

  // A prefix only counts when a delimiter follows it; a word that merely starts
  // with the same letters is left alone.
  t.equal('please followed by a comma is a polite prefix', runDonor('Please, explain my check-in', 'en')?.kind, 'checkin-select');
  t.equal('a word that starts with por-favor is not a prefix', runDonor('por favorito', 'en'), null);
  t.equal('por favor followed by a space is a prefix', runDonor('por favor explica mi check-in', 'es')?.kind, 'checkin-select');

  // --- SP-CHAT-03: the app's own quick-action payloads ----------------------
  for (const [label, user, kind] of [
    ['step quick action', 'Help me choose a step today', 'step-select'],
    ['who-is quick action', 'Who is Pocket LUCA AI?', 'welcome'],
  ]) {
    t.equal(`donor ${label}: guided`, runDonor(user, 'en')?.kind, kind);
    t.equal(`shipped ${label}: NOT guided`, runBaseline(user, 'en'), null);
  }
  t.equal('the explain quick action was already guided and still is',
          runDonor('Explain my check-in', 'en')?.kind, 'checkin-select');

  // --- F05: the CHECK-IN branch no longer answers a mixed clinical request ---
  // Scope, stated exactly: this is the check-in branch only. The shipped history
  // and records-select branches are unchanged (see the no-widening block below),
  // so a clinical clause inside a sleep or history question behaves as in 604.
  for (const user of [
    'What should I do about severe chest pain during my check-in?',
    'How was my check-in yesterday after I fainted?',
    'What is my check-in? I have chest pain',
    'Explain my check-in because I took too many pills',
  ]) {
    t.equal(`donor F05 check-in branch not shortcut: ${user}`, runDonor(user, 'en'), null);
    t.equal(`donor F05 check-in branch not shortcut, with a selection: ${user}`, runDonor(user, 'en', selected()), null);
  }
  // Shipped answered every one of these with an ordinary check-in reply: its rule
  // only needs a leading question word plus the substring. (An earlier comment
  // here said two of them were never shortcut on shipped; that was wrong, S2R-10.)
  for (const user of ['What should I do about severe chest pain during my check-in?',
                      'How was my check-in yesterday after I fainted?',
                      'What is my check-in? I have chest pain',
                      'Explain my check-in because I took too many pills']) {
    t.equal(`shipped F05 defect reproduced: ${user}`, runBaseline(user, 'en')?.kind, 'checkin-select');
  }

  // --- S2R-1: normalization must never WIDEN a shipped substring branch -------
  // Each of these reached the model path on shipped 604. The first donor revision
  // normalized before the history/records-select tests and answered them with a
  // canned reply and zero model calls; the reviewer confirmed it on the host.
  for (const user of [
    'Can you tell me about my sleep? I took too many pills',
    'Please, my sleep is bad and I want to die',
    'Can you review my history? I overdosed',
    '¿Cómo están mis hábitos? Estoy sangrando mucho',
    'Could you show my sleep record? I cannot breathe',
    'Please show my recent activities',
    '¿Mis registros?',
  ]) {
    for (const locale of ['en', 'es']) {
      t.equal(`shipped takes the model path (${locale}): ${user}`, runBaseline(user, locale), null);
      t.equal(`donor does not widen (${locale}): ${user}`, runDonor(user, locale), null);
    }
  }
  // Pre-existing in 604 and deliberately unchanged here (recorded for the
  // clinician gate, not fixed by keyword): the donor must match shipped exactly.
  for (const user of ['How is my sleep? I want to kill myself', 'Show my sleep record, I overdosed']) {
    for (const locale of ['en', 'es']) {
      const shipped = runBaseline(user, locale);
      t.equal(`pre-existing 604 records-select unchanged (${locale}): ${user}`, runDonor(user, locale)?.message, shipped?.message);
      t.equal(`...and it is still the 604 records-select reply (${locale}): ${user}`, shipped?.kind, 'records-select');
    }
  }

  // --- S2R2-1: the records branch must not inherit shipped's check-in matches -
  // In 604 the substring check-in rule shadowed records-select. With whole-request
  // check-in matching, these fell through to "no records are selected" with no
  // model call (re-review of 76b24f6). They must take the model path instead.
  for (const user of ['Explain my check-in, I noted chest pain',
                      'How was my check-in? I recorded that I fainted',
                      'What is my check-in? My sleep is bad, I overdosed']) {
    for (const locale of ['en', 'es']) {
      t.equal(`shipped gave the check-in reply (${locale}): ${user}`, runBaseline(user, locale)?.kind, 'checkin-select');
      t.equal(`donor takes the model path, not records-select (${locale}): ${user}`, runDonor(user, locale), null);
    }
  }
  // Property over a generated corpus: wherever shipped answered with a check-in
  // reply, the donor answers with that same reply or returns null. It never
  // substitutes a different canned reply.
  const LEADS = ['explain my check-in', 'how was my check-in', 'what is my check-in', 'show my checkin',
                 'my check in', 'mi check-in', 'cómo está mi check-in', 'review my check-in'];
  const TAILS = ['', '?', ', my sleep record is bad', ', I noted chest pain', ' and my habits',
                 ' in my journal', ', I overdosed on my meds', '. I recorded that I fainted'];
  let substituted = 0;
  for (const lead of LEADS) for (const tail of TAILS) for (const locale of ['en', 'es']) {
    for (const options of [undefined, selected()]) {
      const shipped = runBaseline(lead + tail, locale, options);
      const donor = runDonor(lead + tail, locale, options);
      if (shipped && /^checkin/.test(shipped.kind) && donor && donor.kind !== shipped.kind) substituted += 1;
    }
  }
  t.equal('no shipped check-in reply is replaced by a different canned reply', substituted, 0);

  // --- S2R-11: bare help keeps shipped 604 semantics exactly -----------------
  // The donor has no risk screen, so it must not turn "Please help!" into the
  // product welcome. Only the shipped exact forms are recognised.
  for (const user of ['Please help!', '¡Ayuda!', 'Can you help?', 'Por favor, ayuda', 'help', 'Help!', 'ayuda']) {
    for (const locale of ['en', 'es']) {
      t.equal(`help keeps its 604 outcome (${locale}): ${user}`, runDonor(user, locale)?.kind ?? null, runBaseline(user, locale)?.kind ?? null);
    }
  }

  // --- positives: grounded values are unchanged and still come only from a
  //     selected record; no invented values without one -----------------------
  const grounded = runDonor('Can you explain my check-in?', 'en', selected());
  t.equal('donor grounded reply with a selected check-in', grounded?.kind, 'checkin');
  t.ok('it quotes the selected values', grounded?.message.includes('vitality: 2/5'));
  t.equal('it cites exactly the selected record', grounded?.sourceRefs.length, 1);
  const shippedGrounded = runBaseline('Explain my check-in', 'en', selected());
  const donorGrounded = runDonor('Explain my check-in', 'en', selected());
  t.equal('for a shipped-accepted form, donor and shipped render identically',
          donorGrounded?.message, shippedGrounded?.message);
  t.ok('without a selection no value is rendered',
       !/\d\/5/.test(runDonor('Explain my check-in', 'en')?.message || ''));

  // --- controls: open chat keeps the model path; Spanish locale still works --
  t.equal('open chat still returns null (model path)', runDonor('Tell me a short story', 'en'), null);
  t.equal('arbitrary text still returns null', runDonor('asdfghjkl', 'en'), null);
  t.ok('Spanish locale renders Spanish copy',
       (runDonor('¿Explica mi check-in?', 'es')?.message || '').startsWith('En Solaris'));
  t.equal('shipped did not guide the leading-¿ Spanish form', runBaseline('¿Explica mi check-in?', 'es'), null);

  // --- S2R-2: shipped check-in phrasings keep their grounded 604 reply --------
  // Whole-request matching must not silently move a 604 grounded answer to the
  // model path, where F03 is still open. The reviewer measured these phrasings;
  // each must render exactly what 604 renders, with and without a selection.
  const SHIPPED_CHECKIN = ['show my check-in', 'my check-in', 'summarize my check-in', 'what is my check-in',
    'explain my checkin', 'review my checkin', 'what did I record in my check-in?', 'how was my check-in',
    'how is my checkin', 'Explica mi checkin', 'cómo esta mi check-in', 'mi check-in', 'revisa mis check-in',
    'tell me about my check in', 'show me my check-in', 'Show my check-in please', 'explain my check-in, please',
    'Explain my check-in.'];
  for (const user of SHIPPED_CHECKIN) {
    for (const locale of ['en', 'es']) {
      for (const [label, options] of [['no selection', undefined], ['selected', selected()]]) {
        const shipped = runBaseline(user, locale, options);
        const donor = runDonor(user, locale, options);
        t.ok(`shipped guides it (${locale}, ${label}): ${user}`, shipped !== null);
        t.equal(`donor renders exactly what 604 renders (${locale}, ${label}): ${user}`,
                donor?.message, shipped?.message);
      }
    }
  }
  // The deliberate cost of the F05 fix, pinned so it cannot change unnoticed: a
  // check-in question 604 answered through its substring rule, but that is not
  // an accepted whole-request form, now takes the model path. These are
  // examples, not an exhaustive list; the owner and the clinician gate must
  // accept this trade (F03 remains open on the model path).
  for (const user of ['how did my check-in go', 'what does my check-in say about my energy',
                      'explain my check-in results', 'show my check-in from yesterday']) {
    t.equal(`deliberate difference, shipped guided: ${user}`, runBaseline(user, 'en', selected())?.kind, 'checkin');
    t.equal(`deliberate difference, donor takes the model path: ${user}`, runDonor(user, 'en', selected()), null);
  }

  // --- S2R-10: every normalization step is load-bearing ----------------------
  for (const [label, user, locale, kind] of [
    ['leading strip before the prefix', '¡Por favor, explica mi check-in!', 'es', 'checkin-select'],
    ['trailing strip before the suffix', 'Explain my check-in, please;', 'en', 'checkin-select'],
    ['could-you prefix', 'Could you explain my check-in?', 'en', 'checkin-select'],
    ['would-you prefix', 'Would you review my check-in?', 'en', 'checkin-select'],
    ['puedes prefix', '¿Puedes elegir un paso?', 'es', 'step-select'],
    ['podrías prefix', '¿Podrías elegir un paso?', 'es', 'step-select'],
    ['podrias prefix', 'podrias elegir un paso', 'es', 'step-select'],
    ['por-favor suffix', 'Explica mi check-in por favor', 'es', 'checkin-select'],
    ['good morning', 'Good morning!', 'en', 'welcome'],
    ['good evening', 'good evening', 'en', 'welcome'],
    ['buenos dias', 'buenos dias', 'es', 'welcome'],
    ['who-is, Spanish', '¿Quién es Pocket LUCA AI?', 'es', 'welcome'],
    ['who-is, Spanish unaccented', 'quien es pocket luca ai', 'es', 'welcome'],
    ['quien eres', 'Quién eres', 'es', 'welcome'],
    ['check in spelling', 'Explain my check in', 'en', 'checkin-select'],
  ]) {
    t.equal(`donor F04 ${label}: ${user}`, runDonor(user, locale)?.kind, kind);
  }

  // --- every shipped acceptance message keeps its shipped outcome AND text ----
  for (const user of ['Hello', 'Hi!', 'hola', 'What can you do?', 'Choose a step', 'Explain my check-in',
                      'What are my most recent activities?', 'Show my recent records', 'What are my habits?',
                      'How was my sleep?', 'Tell me a short story', 'My name is Nila', 'What name did I give?',
                      'Write a poem about a check-in', 'I could not sleep well']) {
    for (const [label, options] of [['no selection', undefined], ['selected', selected()]]) {
      const shipped = runBaseline(user, 'en', options);
      const donor = runDonor(user, 'en', options);
      t.equal(`shipped acceptance message keeps its reply (${label}): ${user}`, donor?.message, shipped?.message);
    }
  }
}
